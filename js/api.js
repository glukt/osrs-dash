const HISCORES_LITE_URL = 'https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws';
const HISCORES_IRONMAN_URL = 'https://secure.runescape.com/m=hiscore_oldschool_ironman/index_lite.ws';
const HISCORES_HCIM_URL = 'https://secure.runescape.com/m=hiscore_oldschool_hardcore_ironman/index_lite.ws';
const HISCORES_UIM_URL = 'https://secure.runescape.wiki/w/Special:Lookup?type=hiscore_oldschool_ultimate&player=';

// Using a public CORS proxy to bypass browser restrictions on calling the Hiscores API.
// This is a common practice for client-side web tools.
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

const SKILL_NAMES = [
    "Overall", "Attack", "Defence", "Strength", "Hitpoints", "Ranged", "Prayer", 
    "Magic", "Cooking", "Woodcutting", "Fletching", "Fishing", "Firemaking", 
    "Crafting", "Smithing", "Mining", "Herblore", "Agility", "Thieving", 
    "Slayer", "Farming", "Runecraft", "Hunter", "Construction"
];

const ACTIVITY_NAMES = [
    "League Points", "Bounty Hunter - Hunter", "Bounty Hunter - Rogue", "Clue Scrolls (all)",
    "Clue Scrolls (beginner)", "Clue Scrolls (easy)", "Clue Scrolls (medium)", "Clue Scrolls (hard)",
    "Clue Scrolls (elite)", "Clue Scrolls (master)", "LMS - Rank", "PvP Arena - Rank", "Soul Wars Zeal",
    "Rifts closed", "Abyssal Sire", "Alchemical Hydra", "Barrows Chests", "Bryophyta", "Callisto",
    "Cerberus", "Chambers of Xeric", "Chambers of Xeric: Challenge Mode", "Chaos Elemental",
    "Chaos Fanatic", "Commander Zilyana", "Corporeal Beast", "Crazy Archaeologist", "Dagannoth Prime",
    "Dagannoth Rex", "Dagannoth Supreme", "Deranged Archaeologist", "General Graardor", "Giant Mole",
    "Grotesque Guardians", "Hespori", "Kalphite Queen", "King Black Dragon", "Kraken",
    "Kree'Arra", "K'ril Tsutsaroth", "Mimic", "Nex", "Nightmare", "Phosani's Nightmare", "Obor",
    "Sarachnis", "Scorpia", "Skotizo", "Tempoross", "The Gauntlet", "The Corrupted Gauntlet",

    "Theatre of Blood", "Theatre of Blood: Hard Mode", "Thermonuclear Smoke Devil", "Tombs of Amascut",
    "Tombs of Amascut: Expert Mode", "TzKal-Zuk", "TzTok-Jad", "Venenatis", "Vet'ion", "Vorkath",
    "Wintertodt", "Zalcano", "Zulrah"
];


function getHiscoresUrlForAccountType(accountType) {
    switch (accountType) {
        case 'ironman':
            return HISCORES_IRONMAN_URL;
        case 'hardcore_ironman':
            return HISCORES_HCIM_URL;
        case 'ultimate_ironman':
            return HISCORES_UIM_URL;
        case 'normal':
        default:
            return HISCORES_LITE_URL;
    }
}

/**
 * Fetches and parses player data from the OSRS Hiscores API.
 * @param {string} username - The player's username.
 * @param {string} accountType - The player's account type.
 * @returns {Promise<object>} A promise that resolves to the parsed hiscores data.
 */
async function fetchHiscores(username, accountType) {
    const baseUrl = getHiscoresUrlForAccountType(accountType);
    const fullUrl = `${CORS_PROXY}${encodeURIComponent(baseUrl + '?player=' + username)}`;

    try {
        const response = await fetch(fullUrl);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Player not found. Please check the username and account type.`);
            }
            throw new Error(`Failed to fetch hiscores. Status: ${response.status}`);
        }
        const textData = await response.text();
        return parseHiscores(textData);
    } catch (error) {
        console.error("Error fetching hiscores:", error);
        throw error; // Re-throw the error to be caught by the caller
    }
}

/**
 * Parses the CSV data from the Hiscores API into a structured object.
 * @param {string} textData - The raw CSV string from the API.
 * @returns {object} The parsed data with skills and bosses.
 */
function parseHiscores(textData) {
    const lines = textData.trim().split('\n');
    const skills = {};
    const bosses = {};

    // First 24 lines are skills
    for (let i = 0; i < SKILL_NAMES.length; i++) {
        const [rank, level, xp] = lines[i].split(',');
        skills[SKILL_NAMES[i]] = {
            rank: parseInt(rank),
            level: parseInt(level),
            xp: parseInt(xp)
        };
    }

    // The rest are activities/bosses
    for (let i = SKILL_NAMES.length; i < lines.length; i++) {
        const activityName = ACTIVITY_NAMES[i - SKILL_NAMES.length];
        if (activityName) {
            const [rank, score] = lines[i].split(',');
            if (parseInt(score) > 0) { // Only include bosses with at least one kill
                 bosses[activityName] = {
                    rank: parseInt(rank),
                    score: parseInt(score)
                };
            }
        }
    }

    return { skills, bosses };
}
