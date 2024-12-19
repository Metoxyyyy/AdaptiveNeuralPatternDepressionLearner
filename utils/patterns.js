function createPatternSet() {
    // Création des motifs comme montré dans la Figure 2
    const patterns = [];
    const targets = [];

    // Ajout des motifs supplémentaires montrés dans la Figure 2
    const additionalPatterns = [
        // Example '0+0'
        { input: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], target: 0 },
        // Example '0+1'
        { input: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], target: 1 },
        // Example '0+2'
        { input: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], target: 2 },
        // Example '0+3'
        { input: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], target: 3 },
        // Example '0+4'
        { input: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], target: 4 },
        // Example '0+5'
        { input: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], target: 5 },
        // Example '0+6'
        { input: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], target: 6 },
        // Example '0+7'
        { input: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], target: 7 },
        // Example '0+8'
        { input: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], target: 8 },
        // Example '0+9'
        { input: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], target: 9 },
        // Example '1+1'
        { input: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], target: 2 },
        // Example '1+2'
        { input: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], target: 3 },
        // Example '1+3'
        { input: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], target: 4 },
        // Example '1+4'
        { input: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], target: 5 },
        // Example '1+5'
        { input: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], target: 6 },
        // Example '1+6'
        { input: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], target: 7 },
        // Example '1+7'
        { input: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], target: 8 },
        // Example '1+8'
        { input: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], target: 9 },
        // Example '2+2'
        { input: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], target: 4 },
        // Example '2+3'
        { input: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], target: 5 },
        // Example '2+4'
        { input: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], target: 6 },
        // Example '2+5'
        { input: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], target: 7 },
        // Example '2+6'
        { input: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], target: 8 },
        // Example '2+7'
        { input: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], target: 9 },
        // Example '3+3'
        { input: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], target: 6 },
        // Example '3+4'
        { input: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], target: 7 },
        // Example '3+5'
        { input: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], target: 8 },
        // Example '3+6'
        { input: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], target: 9 },
        // Example '4+4'
        { input: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], target: 8 },
        // Example '4+5'
        { input: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], target: 9 }
    ]; 

    // Ajout des motifs supplémentaires
    additionalPatterns.forEach(({ input, target }) => {
        patterns.push(input);
        targets.push(target);
    });

    return { patterns, targets };
}

function createMovingTarget(steps = 2000) {
    // Simulation de la cible mobile (Figure 4)
    const positions = [];
    let currentPos = 55; // Position initiale

    for (let i = 0; i < steps; i++) {
        // Mouvement aléatoire
        currentPos += Math.random() > 0.5 ? 1 : -1;
        // Limites
        currentPos = Math.max(5, Math.min(105, currentPos));
        positions.push(currentPos);
    }

    return positions;
}

// Fonction pour visualiser un pattern
function visualizePattern(pattern) {
    return pattern.map(v => v === 1 ? "■" : "□").join(" ");
}

// Fonction pour tester la robustesse (comme montré dans la Figure 4)
function createPerturbations(pattern, perturbationType) {
    switch (perturbationType) {
        case "invert":
            return pattern.map(v => 1 - v);
        case "randomize":
            return pattern.map(() => Math.random() > 0.75 ? 1 : 0);
        case "remove":
            return pattern.map(v => Math.random() > 0.25 ? v : 0);
        default:
            return pattern;
    }
}

module.exports = {
    createPatternSet,
    createMovingTarget,
    visualizePattern,
    createPerturbations
};
