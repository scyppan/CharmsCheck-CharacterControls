function getname(word, mode) {
    const mappings = {
        "charms": "Charms",
        "transfiguration": "Transfiguration",
        "defense against the dark arts": "Defense",
        "dark arts": "DarkArts",
        "potions": "Potions",
        "herbology": "Herbology",
        "alchemy": "Alchemy",
        "artificing": "Artificing",
        "flying": "Flying",
        "arithmancy": "Arithmancy",
        "muggle studies": "Muggles",
        "history of magic": "History",
        "ancient runes": "Runes",
        "social skills": "Social",
        "perception": "Perception",
        "astronomy": "Astronomy",
        "divination": "Divination",
        "magical creatures": "Creatures"
    };

    const reverseMappings = Object.fromEntries(
        Object.entries(mappings).map(([long, short]) => [short.toLowerCase(), long])
    );

    const lowerWord = word.toLowerCase();

    if (mode === "short") {
        return mappings[lowerWord] || (console.log("default returning word", word), word);
    } else if (mode === "long") {
        return reverseMappings[lowerWord] || word;
    }
    
    console.log("Invalid mode:", mode);
    return word;
}
