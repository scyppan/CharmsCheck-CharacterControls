function getname(word, mode) {
    const lowerWord = word.toLowerCase();

    const skills = {
        "casting": {
            standard: "casting",
            display: "Casting",
            variants: ["casting", "spell casting", "Casting"]
        },
        "power": {
            standard: "power",
            display: "Power",
            variants: ["Power", "power"]
        },
        "erudition": {
            standard: "erudition",
            display: "Erudition",
            variants: ["erudition", "Erudition"]
        },
        "naturalism": {
            standard: "naturalism",
            display: "Naturalism",
            variants: ["naturalism", "Naturalism"]
        },
        "panache": {
            standard: "panache",
            display: "Panache",
            variants: ["panache", "Panache"]
        },
        "charms": {
            standard: "charms",
            display: "Charms",
            variants: ["charms", "charm", "charm spell", "spells of charm", "the charms"]
        },
        "transfiguration": {
            standard: "transfiguration",
            display: "Transfiguration",
            variants: ["transfiguration", "transfigure", "transfiguration magic", "transformations", "the transfiguration"]
        },
        "defense against the dark arts": {
            standard: "defense",
            display: "Defense",
            variants: [
                "defense against the dark arts",
                "defence against the dark arts",
                "defense", "defence",
                "defensive magic",
                "anti-dark arts",
                "protection magic",
            ]
        },
        "dark arts": {
            standard: "darkarts",
            display: "Dark Arts",
            variants: ["dark arts", "darkarts", "dark art", "dark magic", "black magic", "the dark arts"]
        },
        "potions": {
            standard: "potions",
            display: "Potions",
            variants: ["potions", "brews", "elixirs", "concoctions", "potion-making", "the potions"]
        },
        "herbology": {
            standard: "herbology",
            display: "Herbology",
            variants: ["herbology", "herbalism", "herbs", "plant magic", "the herbology"]
        },
        "alchemy": {
            standard: "alchemy",
            display: "Alchemy",
            variants: ["alchemy", "alchemistry", "chymistry", "elixir-making", "the alchemy"]
        },
        "artificing": {
            standard: "artificing",
            display: "Artificing",
            variants: ["artificing", "artifice", "magical crafting", "crafting magic", "the artificing"]
        },
        "flying": {
            standard: "flying",
            display: "Flying",
            variants: ["flying", "flight", "aeronautics", "soaring", "the flying"]
        },
        "arithmancy": {
            standard: "arithmancy",
            display: "Arithmancy",
            variants: ["arithmancy", "numeromancy", "arithmetic magic", "number magic", "the arithmancy"]
        },
        "muggle studies": {
            standard: "muggles",
            display: "Muggles",
            variants: ["muggle studies", "muggles", "studies of muggles", "non-magic studies", "the muggle studies"]
        },
        "history of magic": {
            standard: "history",
            display: "History",
            variants: ["history of magic", "magic history", "historical magic", "history", "the history of magic"]
        },
        "ancient runes": {
            standard: "runes",
            display: "Runes",
            variants: ["ancient runes", "runes", "old runes", "rune studies", "the ancient runes"]
        },
        "social skills": {
            standard: "social",
            display: "Social",
            variants: ["social skills", "social", "communication", "interpersonal skills", "societal interaction", "the social skills"]
        },
        "perception": {
            standard: "perception",
            display: "Perception",
            variants: ["perception", "awareness", "senses", "observational skills", "the perception"]
        },
        "astronomy": {
            standard: "astronomy",
            display: "Astronomy",
            variants: ["astronomy", "stargazing", "celestial studies", "sky watching", "the astronomy"]
        },
        "divination": {
            standard: "divination",
            display: "Divination",
            variants: ["divination", "fortune-telling", "prophecy", "augury", "soothsaying", "omen reading", "the divination"]
        },
        "magical creatures": {
            standard: "creatures",
            display: "Creatures",
            variants: ["Magical Creatures", "magical creatures", "creatures", "mythical beasts", "fantastical creatures", "beasts", "the magical creatures"]
        },
        "mental fortitude": {
            standard: "fortitude",
            display: "Fortitude",
            variants: ["mental fortitude", "Mental fortitude", "mental Fortitude", "fortitude", "Fortitude"]
        },
        "willpower": {
            standard: "willpower",
            display: "Willpower",
            variants: ["willpower", "Willpower"]
        },
        "intellect": {
            standard: "intellect",
            display: "Intellect",
            variants: ["intellect", "Intellect"]
        },
        "creativity": {
            standard: "creativity",
            display: "Creativity",
            variants: ["creativity", "Creativity"]
        },
        "equanimity": {
            standard: "equanimity",
            display: "Equanimity",
            variants: ["equanimity", "Equanimity"]
        },
        "charisma": {
            standard: "charisma",
            display: "Charisma",
            variants: ["charisma", "Charisma"]
        },
        "attractiveness": {
            standard: "attractiveness",
            display: "Attractiveness",
            variants: ["attractiveness", "Attractiveness"]
        },
        "strength": {
            standard: "strength",
            display: "Strength",
            variants: ["strength", "Strength"]
        },
        "agility": {
            standard: "agility",
            display: "Agility",
            variants: ["agility", "Agility"]
        },
        "generosity": {
            standard: "generosity",
            display: "Generosity",
            variants: ["generosity", "Generosity", "generocity", "Generocity"]
        },
        "permissiveness": {
            standard: "permissiveness",
            display: "Permissiveness",
            variants: ["Permissiveness", "permissiveness"]
        },
        "wealth": {
            standard: "wealth",
            display: "Wealth",
            variants: ["wealth", "Wealth", "welth", "Welth"]
        }
    };

    for (const key in skills) {
        const skill = skills[key];
        const allNames = [
            skill.standard.toLowerCase(),
            skill.display.toLowerCase(),
            ...skill.variants.map(v => v.toLowerCase())
        ];
        if (allNames.includes(lowerWord)) {
            if (mode === "standard") return skill.standard;
            if (mode === "display") return skill.display;
            if (mode === "variants") return skill.variants;
            return word;
        }
    }

    if (word !== '') {
        word = word.toLowerCase().replace(/\s+/g, '');
    }

    return word;
}
