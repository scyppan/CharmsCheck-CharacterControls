function getname(word, mode) {
    const lowerWord = word.toLowerCase();

    const skills = {
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
            display: "Defense Against the Dark Arts",
            variants: [
                "defense against the dark arts",
                "defence against the dark arts",
                "defense", "defence",
                "defensive magic",
                "anti-dark arts",
                "protection magic",
                "dark arts defense"
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
            display: "History of Magic",
            variants: ["history of magic", "magic history", "historical magic", "history", "the history of magic"]
        },
        "ancient runes": {
            standard: "runes",
            display: "Ancient Runes",
            variants: ["ancient runes", "runes", "old runes", "rune studies", "the ancient runes"]
        },
        "social skills": {
            standard: "social",
            display: "Social Skills",
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
            variants: ["magical creatures", "creatures", "mythical beasts", "fantastical creatures", "beasts", "the magical creatures"]
        },
        "mental fortitude": {
            standard: "fortitude",
            display: "Fortitude",
            variants: ["mental fortitude", "Mental fortitude", "mental Fortitude", "fortitude", "Fortitude"]
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

    if(word!=''){
        console.log("No mapping found for:", word, "with mode:", mode);
    }
    
    return word;
}
