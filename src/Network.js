module.exports = class Network {
    constructor(config) {
      this.inputSize = config.inputSize;
      this.hiddenSize = config.hiddenSize;
      this.outputSize = config.outputSize;
      this.depressionRate = config.depressionRate;
      this.weightsIH = this.initializeWeights(this.hiddenSize, this.inputSize);
      this.weightsHO = this.initializeWeights(this.outputSize, this.hiddenSize);
    }
  
    initializeWeights(rows, cols) {
      const array = Array(rows)
        .fill()
        .map(() =>
          Array(cols)
            .fill()
            .map(() => Math.random())
        );
      // normalize
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
  
      let maxOutputActivation = -Infinity;
      let strongestOutput = 0;
  
      for (let k = 0; k < this.outputSize; k++) {
        let activation = this.weightsHO[k][strongestHidden];
        if (activation > maxOutputActivation) {
          maxOutputActivation = activation;
          strongestOutput = k;
        }
      }
  
      return {
        output: strongestOutput,
        hiddenNeuron: strongestHidden,
        confidence: maxOutputActivation,
      };
    }
  
    depressConnections(neuronIndex, weights, strongestInput) {
      weights[neuronIndex][strongestInput] -= this.depressionRate;
      if (weights[neuronIndex][strongestInput] < 0) {
        weights[neuronIndex][strongestInput] = 0.001;
      }
  
      let sum = 0;
      for (let i = 0; i < weights.length; i++) {
        sum += weights[i][strongestInput];
      }
      for (let i = 0; i < weights.length; i++) {
        weights[i][strongestInput] = weights[i][strongestInput] / sum;
      }
  
      // const sum = weights[neuronIndex].reduce((a, b) => a + b, 0);
      // if (sum > 0) {
      //   weights[neuronIndex] = weights[neuronIndex].map((w) => w / sum);
      // }
    }
  
    async train(patterns, targets, maxIterations = 2000) {
      const errors = [];
      let iteration = 0;
      let totalError = 0;
  
      // Choisir un pattern spécifique pour suivre l'évolution des poids
      //const patternSuivi = 0;
  
      // console.log("\n=== ÉTAT INITIAL DES PATTERNS ===");
      // patterns.forEach((pattern, index) => {
      //     console.log(`Pattern ${index}: [${pattern}] -> Target: ${targets[index]}`);
      //     if (index === patternSuivi) {
      //         //console.log(`\n=== POIDS INITIAUX POUR LE PATTERN ${patternSuivi} ===`);
      //         // Trouver les positions des 1 dans le pattern
      //         const positionsUn = [];
      //         pattern.forEach((val, pos) => {
      //             if (val === 1) positionsUn.push(pos);
      //         });
      //         console.log(`Positions des 1 dans le pattern: ${positionsUn}`);
      //         console.log("Poids pour ces positions:");
      //         positionsUn.forEach(pos => {
      //             console.log(`Position ${pos}:`);
      //             this.weightsIH.forEach((row, idx) => {
      //                 console.log(`  Neurone caché ${idx}: ${row[pos].toFixed(3)}`);
      //             });
      //         });
      //     }
      // });
  
      while (iteration < maxIterations) {
        totalError = 0;
  
        let ordreApprentissage = Array.from(
          { length: patterns.length },
          (_, i) => i
        );
        ordreApprentissage.sort(() => Math.random() - 0.5);
        //console.log("\n=== ORDRE D'APPRENTISSAGE ===");
        //console.log("Ordre:", ordreApprentissage);
  
        for (let i = 0; i < patterns.length; i++) {
          const p = ordreApprentissage[i];
          const inference = this.infer(patterns[p]);
  
          if (inference.output !== targets[p]) {
            totalError++;
            this.depressConnections(
              inference.output,
              this.weightsHO,
              inference.hiddenNeuron
            );
  
            for (let j = 0; j < patterns[p].length; j++) {
              if (patterns[p][j] === 1) {
                this.depressConnections(
                  inference.hiddenNeuron,
                  this.weightsIH,
                  j
                );
              }
            }
          }
        }
  
        // console.log("\n=== RÉSULTATS APRÈS UNE ITÉRATION ===");
        // patterns.forEach((pattern, index) => {
        //     const inference = this.infer(pattern);
        //     console.log(`Pattern ${index}: Attendu ${targets[index]}, Prédit ${inference.output}`);
        //     if (index === patternSuivi) {
        //         console.log(`\n=== POIDS FINAUX POUR LE PATTERN ${patternSuivi} ===`);
        //         const positionsUn = [];
        //         pattern.forEach((val, pos) => {
        //             if (val === 1) positionsUn.push(pos);
        //         });
        //         console.log(`Positions des 1 dans le pattern: ${positionsUn}`);
        //         console.log("Poids pour ces positions:");
        //         positionsUn.forEach(pos => {
        //             console.log(`Position ${pos}:`);
        //             this.weightsIH.forEach((row, idx) => {
        //                 console.log(`  Neurone caché ${idx}: ${row[pos].toFixed(3)}`);
        //             });
        //         });
        //     }
        // });
  
        errors.push(totalError);
        console.log("train errors: ", totalError);
  
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
  