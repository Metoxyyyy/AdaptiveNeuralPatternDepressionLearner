module.exports = class Network {
  constructor(config) {
    this.inputSize = config.inputSize; // 60
    this.hiddenSize = config.hiddenSize;
    this.outputSize = config.outputSize; // 10
    this.depressionRate = config.depressionRate;

    this.weightsIH = this.initializeWeights(this.hiddenSize, this.inputSize);
    this.weightsHO = {
      units: this.initializeWeights(this.outputSize, this.hiddenSize),
      tens: this.initializeWeights(this.outputSize, this.hiddenSize),
      hundreds: this.initializeWeights(this.outputSize, this.hiddenSize),
      thousands: this.initializeWeights(this.outputSize, this.hiddenSize),
    };
  }

  initializeWeights(rows, cols) {
    const array = Array(rows)
      .fill()
      .map(() =>
        Array(cols)
          .fill()
          .map(() => Math.random())
      );
    return array;
  }

  infer(input) {
    let maxHiddenActivation = -Infinity;
    let strongestHidden = 0;

    for (let j = 0; j < this.hiddenSize; j++) {
      let activation = 0;
      for (let i = 0; i < this.inputSize; i++) {
        activation += this.weightsIH[j][i] * input[i];
      }
      if (activation > maxHiddenActivation) {
        maxHiddenActivation = activation;
        strongestHidden = j;
      }
    }

    const outputs = {
      units: { output: 0, confidence: -Infinity },
      tens: { output: 0, confidence: -Infinity },
      hundreds: { output: 0, confidence: -Infinity },
      thousands: { output: 0, confidence: -Infinity },
    };

    for (const digit of ["units", "tens", "hundreds", "thousands"]) {
      let maxOutputActivation = -Infinity;
      let strongestOutput = 0;

      for (let k = 0; k < this.outputSize; k++) {
        let activation = this.weightsHO[digit][k][strongestHidden];
        if (activation > maxOutputActivation) {
          maxOutputActivation = activation;
          strongestOutput = k;
        }
      }

      outputs[digit] = {
        output: strongestOutput,
        confidence: maxOutputActivation,
      };
    }

    return {
      outputs,
      hiddenNeuron: strongestHidden,
      hiddenActivation: maxHiddenActivation,
    };
  }

  depressConnections(
    neuronIndex,
    weights,
    strongestInput,
    correctionRate = this.depressionRate
  ) {
    weights[neuronIndex][strongestInput] -= correctionRate;
    if (weights[neuronIndex][strongestInput] < 0) {
      weights[neuronIndex][strongestInput] = 0.001;
    }

    const sum = weights[neuronIndex].reduce((a, b) => a + b, 0);
    if (sum > 0) {
      weights[neuronIndex] = weights[neuronIndex].map((w) => w / sum);
    }
  }

  async train(patterns, targets, maxIterations = 2000) {
    const errors = {
      units: [],
      tens: [],
      hundreds: [],
      thousands: [],
      total: [],
    };
    let iteration = 0;
    let totalError = 0;

    while (iteration < maxIterations) {
      totalError = 0;
      let digitErrors = {
        units: 0,
        tens: 0,
        hundreds: 0,
        thousands: 0,
      };

      let ordreApprentissage = Array.from(
        { length: patterns.length },
        (_, i) => i
      );
      ordreApprentissage.sort(() => Math.random() - 0.5);

      for (let i = 0; i < patterns.length; i++) {
        const p = ordreApprentissage[i];
        const inference = this.infer(patterns[p]);

        for (const digit of ["thousands", "hundreds", "tens", "units"]) {
          const d = ["thousands", "hundreds", "tens", "units"].indexOf(digit);
          if (inference.outputs[digit].output !== targets[p][3 - d]) {
            digitErrors[digit]++;
            totalError++;

            this.depressConnections(
              inference.outputs[digit].output,
              this.weightsHO[digit],
              inference.hiddenNeuron,
              this.depressionRate
            );

            for (let j = 0; j < patterns[p].length; j++) {
              if (patterns[p][j] === 1) {
                this.depressConnections(
                  inference.hiddenNeuron,
                  this.weightsIH,
                  j,
                  this.depressionRate * 0.25
                );
              }
            }
          }
        }
      }

      for (const digit of ["thousands", "hundreds", "tens", "units"]) {
        errors[digit].push(digitErrors[digit]);
      }
      errors.total.push(totalError);

      console.log("Train errors:", {
        total: totalError,
        ...digitErrors,
      });

      if (totalError === 0) {
        console.log(`Convergence atteinte à l'itération ${iteration}`);
        break;
      }

      iteration++;
    }

    if (iteration === maxIterations) {
      console.log(
        "Nombre maximum d'itérations atteint sans convergence complète"
      );
    }

    console.log(`\nTotal d'erreurs: ${totalError}`);
    return errors;
  }
};
