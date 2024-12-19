const Network = require("./src/Network");
const { createPatternSet } = require("./utils/patterns");

const CONFIG = {
  inputSize: 60,
  hiddenSize: 1000,
  outputSize: 10,
  depressionRate: 0.001,
};

async function main() {
  try {
    console.log("Initialisation du réseau...");
    const network = new Network(CONFIG);

    console.log("Création des motifs...");
    const { patterns, targets } = createPatternSet();

    console.log("\nTest d'inférence initial:");
    patterns.forEach((pattern, i) => {
      const inference = network.infer(pattern);
      // Extraction des nombres d'entrée depuis le pattern
      const firstNumber = pattern.slice(0, 10).indexOf(1);
      const secondNumber = pattern.slice(50, 60).indexOf(1);

      console.log(`Pattern ${i}: ${firstNumber}+${secondNumber}`, {
        attendu: `${targets[i][3]}${targets[i][2]}${targets[i][1]}${targets[i][0]}`, // Format MCDU
        prédit: `${inference.outputs.thousands.output}${inference.outputs.hundreds.output}${inference.outputs.tens.output}${inference.outputs.units.output}`,
        confiance: inference.outputs.units.confidence.toFixed(3),
      });
    });

    console.log("\nDébut de l'apprentissage...");
    const learningErrors = await network.train(patterns, targets, 800);

    console.log("Apprentissage terminé");
    console.log("\nÉvolution des erreurs par position:");
    console.log(
      "Unités:",
      learningErrors.units[learningErrors.units.length - 1]
    );
    console.log(
      "Dizaines:",
      learningErrors.tens[learningErrors.tens.length - 1]
    );
    console.log(
      "Centaines:",
      learningErrors.hundreds[learningErrors.hundreds.length - 1]
    );
    console.log(
      "Milliers:",
      learningErrors.thousands[learningErrors.thousands.length - 1]
    );
    console.log(
      "Total:",
      learningErrors.total[learningErrors.total.length - 1]
    );

    console.log("\nTest d'inférence final:");
    patterns.forEach((pattern, i) => {
      const inference = network.infer(pattern);
      const firstNumber = pattern.slice(0, 10).indexOf(1);
      const secondNumber = pattern.slice(50, 60).indexOf(1);

      console.log(`Pattern ${i}: ${firstNumber}+${secondNumber}`, {
        attendu: `${targets[i][3]}${targets[i][2]}${targets[i][1]}${targets[i][0]}`,
        prédit: `${inference.outputs.thousands.output}${inference.outputs.hundreds.output}${inference.outputs.tens.output}${inference.outputs.units.output}`,
        confiance: inference.outputs.units.confidence.toFixed(3),
      });
    });

    // Affichage des statistiques finales
    console.log("\nStatistiques d'apprentissage:");
    const totalIterations = learningErrors.total.length;
    console.log(`Nombre total d'itérations: ${totalIterations}`);
    console.log(
      `Erreur finale totale: ${learningErrors.total[totalIterations - 1]}`
    );
  } catch (error) {
    console.error("Erreur:", error.message);
  }
}

main().catch(console.error);

module.exports = { main };
