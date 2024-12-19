const Network = require('./Network');
const { createPatternSet } = require('./utils/patterns');

const CONFIG = {
    inputSize: 20,
    hiddenSize: 1000,
    outputSize: 10,
    depressionRate: 0.01
};

async function main() {
    try {
        console.log("Initialisation du réseau...");
        const network = new Network(CONFIG);

        console.log("Création des motifs...");
        const { patterns, targets } = createPatternSet();

        // Test d'inférence avant apprentissage
        console.log("\nTest d'inférence initial:");
        patterns.forEach((pattern, i) => {
            const inference = network.infer(pattern);
            console.log(`Pattern ${i}:`, {
                attendu: targets[i],
                prédit: inference.output,
                confiance: inference.confidence.toFixed(3)
            });
        });

        console.log("\nDébut de l'apprentissage...");
        const learningErrors = await network.train(patterns, targets, 800);

        console.log("Apprentissage terminé");
       // console.log("Évolution des erreurs:", learningErrors);

        // Test d'inférence après apprentissage
        console.log("\nTest d'inférence final:");
        patterns.forEach((pattern, i) => {
            const inference = network.infer(pattern);
            console.log(`Pattern ${i}:`, {
                attendu: targets[i],
                prédit: inference.output,
                confiance: inference.confidence.toFixed(3)
            });
        });

    } catch (error) {
        console.error("Erreur:", error.message);
    }
}

main().catch(console.error);

module.exports = { main };
