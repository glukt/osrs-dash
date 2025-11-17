// Wait for the HTML document to be fully loaded
document.addEventListener("DOMContentLoaded", () => {

    // --- Get Elements ---
    const loadButton = document.getElementById("loadButton");
    const usernameInput = document.getElementById("username");
    const accountTypeSelect = document.getElementById("accountType");
    // Get the new grid containers by their specific IDs
    const skillsGridContainer = document.getElementById("skills-grid-container");
    const activitiesGridContainer = document.getElementById("activities-grid-container"); // Correct ID
    const addGoalButton = document.getElementById("addGoalButton");
    const goalTypeInput = document.getElementById("goalType");
    const goalTargetInput = document.getElementById("goalTarget");
    const goalsListContainer = document.getElementById("goals-list");
    // const characterNameDisplay = document.getElementById("characterNameDisplay"); // Removed
    const goalNameSkillSelect = document.getElementById("goalNameSkill");
    const goalNameBossSelect = document.getElementById("goalNameBoss");
    const goalNameSkillContainer = document.getElementById("goalNameSkillContainer");
    const goalNameBossContainer = document.getElementById("goalNameBossContainer");


    // --- State Variables ---
    let hiscoresData = {
        skills: {},
        bosses: {}
    };
    let goals = []; // Single declaration

    // ===================================
    // --- OSRS XP Table & Helper ---
    // ===================================
    const xpForLevel = [
        0, 0, 83, 174, 276, 388, 512, 650, 801, 969, 1154, 1358, 1584, 1833, 2107, 2411, 2746, 3115, 3523, 3973, 4470, 5018, 5624, 6291, 7028, 7842, 8740, 9730, 10824, 12031, 13363, 14833, 16456, 18247, 20224, 22406, 24815, 27473, 30408, 33648, 37224, 41171, 45529, 50339, 55649, 61512, 67983, 75127, 83014, 91721, 101333, 111945, 123660, 136594, 150872, 166636, 184040, 203254, 224466, 247886, 273742, 302288, 333804, 368599, 407015, 449428, 496254, 547953, 605032, 668051, 737627, 814445, 899257, 992895, 1096278, 1210421, 1336443, 1475581, 1629200, 1798808, 1986068, 2192818, 2421087, 2673114, 2951373, 3258594, 3597792, 3972294, 4385776, 4842295, 5346332, 5902831, 6517253, 7195629, 7944614, 8771558, 9684577, 10692629, 11805606, 13034431
    ];

    function getXpForLevel(level) {
        if (level <= 1) return 0;
        const maxLevel = xpForLevel.length - 1;
        if (level > maxLevel) return xpForLevel[maxLevel];
        return xpForLevel[level];
    }

    // ===================================
    // --- Skill & Boss Definitions / Icons ---
    // ===================================
    const skillIconUrls = {
        "Attack": "https://oldschool.runescape.wiki/images/Attack_icon.png",
        "Defence": "https://oldschool.runescape.wiki/images/Defence_icon.png",
        "Strength": "https://oldschool.runescape.wiki/images/Strength_icon.png",
        "Hitpoints": "https://oldschool.runescape.wiki/images/Hitpoints_icon.png",
        "Ranged": "https://oldschool.runescape.wiki/images/Ranged_icon.png",
        "Prayer": "https://oldschool.runescape.wiki/images/Prayer_icon.png",
        "Magic": "https://oldschool.runescape.wiki/images/Magic_icon.png",
        "Cooking": "https://oldschool.runescape.wiki/images/Cooking_icon.png",
        "Woodcutting": "https://oldschool.runescape.wiki/images/Woodcutting_icon.png",
        "Fletching": "https://oldschool.runescape.wiki/images/Fletching_icon.png",
        "Fishing": "https://oldschool.runescape.wiki/images/Fishing_icon.png",
        "Firemaking": "https://oldschool.runescape.wiki/images/Firemaking_icon.png",
        "Crafting": "https://oldschool.runescape.wiki/images/Crafting_icon.png",
        "Smithing": "https://oldschool.runescape.wiki/images/Smithing_icon.png",
        "Mining": "https://oldschool.runescape.wiki/images/Mining_icon.png",
        "Herblore": "https://oldschool.runescape.wiki/images/Herblore_icon.png",
        "Agility": "https://oldschool.runescape.wiki/images/Agility_icon.png",
        "Thieving": "https://oldschool.runescape.wiki/images/Thieving_icon.png",
        "Slayer": "https://oldschool.runescape.wiki/images/Slayer_icon.png",
        "Farming": "https://oldschool.runescape.wiki/images/Farming_icon.png",
        "Runecraft": "https://oldschool.runescape.wiki/images/Runecraft_icon.png",
        "Hunter": "https://oldschool.runescape.wiki/images/Hunter_icon.png",
        "Construction": "https://oldschool.runescape.wiki/images/Construction_icon.png",
        "Overall": "https://oldschool.runescape.wiki/images/Skills_icon.png"
    };

     const skillDropdownNames = Object.keys(skillIconUrls).filter(name => name !== "Overall").sort();

     const bossIconUrls = {
        "Abyssal Sire": "https://oldschool.runescape.wiki/images/thumb/Abyssal_Sire.png/130px-Abyssal_Sire.png",
        "Alchemical Hydra": "https://oldschool.runescape.wiki/images/thumb/Alchemical_Hydra.png/130px-Alchemical_Hydra.png",
        "Artio": "https://oldschool.runescape.wiki/images/thumb/Artio.png/130px-Artio.png",
        "Barrows Chests": "https://oldschool.runescape.wiki/images/thumb/Barrows_Chests.png/130px-Barrows_Chests.png",
        "Bryophyta": "https://oldschool.runescape.wiki/images/thumb/Bryophyta.png/130px-Bryophyta.png",
        "Callisto": "https://oldschool.runescape.wiki/images/thumb/Callisto.png/130px-Callisto.png",
        "Calvar'ion": "https://oldschool.runescape.wiki/images/thumb/Calvar%27ion.png/130px-Calvar%27ion.png",
        "Cerberus": "https://oldschool.runescape.wiki/images/thumb/Cerberus.png/130px-Cerberus.png",
        "Chambers of Xeric": "https://oldschool.runescape.wiki/images/thumb/Chambers_of_Xeric_logo.png/130px-Chambers_of_Xeric_logo.png",
        "Chambers of Xeric: Challenge Mode": "https://oldschool.runescape.wiki/images/thumb/Chambers_of_Xeric_Challenge_Mode_logo.png/130px-Chambers_of_Xeric_Challenge_Mode_logo.png",
        "Chaos Elemental": "https://oldschool.runescape.wiki/images/thumb/Chaos_Elemental.png/130px-Chaos_Elemental.png",
        "Chaos Fanatic": "https://oldschool.runescape.wiki/images/thumb/Chaos_Fanatic.png/130px-Chaos_Fanatic.png",
        "Commander Zilyana": "https://oldschool.runescape.wiki/images/thumb/Commander_Zilyana.png/130px-Commander_Zilyana.png",
        "Corporeal Beast": "https://oldschool.runescape.wiki/images/thumb/Corporeal_Beast.png/130px-Corporeal_Beast.png",
        "Crazy Archaeologist": "https://oldschool.runescape.wiki/images/thumb/Crazy_archaeologist.png/130px-Crazy_archaeologist.png",
        "Dagannoth Prime": "https://oldschool.runescape.wiki/images/thumb/Dagannoth_Prime.png/130px-Dagannoth_Prime.png",
        "Dagannoth Rex": "https://oldschool.runescape.wiki/images/thumb/Dagannoth_Rex.png/130px-Dagannoth_Rex.png",
        "Dagannoth Supreme": "https://oldschool.runescape.wiki/images/thumb/Dagannoth_Supreme.png/130px-Dagannoth_Supreme.png",
        "Deranged Archaeologist": "https://oldschool.runescape.wiki/images/thumb/Deranged_archaeologist.png/130px-Deranged_archaeologist.png",
        "Duke Sucellus": "https://oldschool.runescape.wiki/images/thumb/Duke_Sucellus.png/130px-Duke_Sucellus.png",
        "General Graardor": "https://oldschool.runescape.wiki/images/thumb/General_Graardor.png/130px-General_Graardor.png",
        "Giant Mole": "https://oldschool.runescape.wiki/images/thumb/Giant_Mole.png/130px-Giant_Mole.png",
        "Grotesque Guardians": "https://oldschool.runescape.wiki/images/thumb/Grotesque_Guardians.png/130px-Grotesque_Guardians.png",
        "Hespori": "https://oldschool.runescape.wiki/images/thumb/Hespori.png/130px-Hespori.png",
        "Kalphite Queen": "https://oldschool.runescape.wiki/images/thumb/Kalphite_Queen.png/130px-Kalphite_Queen.png",
        "King Black Dragon": "https://oldschool.runescape.wiki/images/thumb/King_Black_Dragon.png/130px-King_Black_Dragon.png",
        "Kraken": "https://oldschool.runescape.wiki/images/thumb/Kraken.png/130px-Kraken.png",
        "Kree'Arra": "https://oldschool.runescape.wiki/images/thumb/Kree%27arra.png/130px-Kree%27arra.png",
        "K'ril Tsutsaroth": "https://oldschool.runescape.wiki/images/thumb/K%27ril_Tsutsaroth.png/130px-K%27ril_Tsutsaroth.png",
        "Mimic": "https://oldschool.runescape.wiki/images/thumb/Mimic.png/130px-Mimic.png",
        "Nex": "https://oldschool.runescape.wiki/images/thumb/Nex.png/130px-Nex.png",
        "Nightmare": "https://oldschool.runescape.wiki/images/thumb/The_Nightmare.png/130px-The_Nightmare.png",
        "Phosani's Nightmare": "https://oldschool.runescape.wiki/images/thumb/Phosani%27s_Nightmare.png/130px-Phosani%27s_Nightmare.png",
        "Obor": "https://oldschool.runescape.wiki/images/thumb/Obor.png/130px-Obor.png",
        "Phantom Muspah": "https://oldschool.runescape.wiki/images/thumb/Phantom_Muspah.png/130px-Phantom_Muspah.png",
        "Sarachnis": "https://oldschool.runescape.wiki/images/thumb/Sarachnis.png/130px-Sarachnis.png",
        "Scorpia": "https://oldschool.runescape.wiki/images/thumb/Scorpia.png/130px-Scorpia.png",
        "Scurrius": "https://oldschool.runescape.wiki/images/thumb/Scurrius.png/130px-Scurrius.png",
        "Skotizo": "https://oldschool.runescape.wiki/images/thumb/Skotizo.png/130px-Skotizo.png",
        "Sol Heredit": "https://oldschool.runescape.wiki/images/thumb/Sol_Heredit.png/130px-Sol_Heredit.png",
        "Spindel": "https://oldschool.runescape.wiki/images/thumb/Spindel.png/130px-Spindel.png",
        "Tempoross": "https://oldschool.runescape.wiki/images/thumb/Tempoross.png/130px-Tempoross.png",
        "The Gauntlet": "https://oldschool.runescape.wiki/images/thumb/The_Gauntlet_logo.png/130px-The_Gauntlet_logo.png",
        "The Corrupted Gauntlet": "https://oldschool.runescape.wiki/images/thumb/The_Corrupted_Gauntlet_logo.png/130px-The_Corrupted_Gauntlet_logo.png",
        "The Leviathan": "https://oldschool.runescape.wiki/images/thumb/The_Leviathan.png/130px-The_Leviathan.png",
        "The Whisperer": "https://oldschool.runescape.wiki/images/thumb/The_Whisperer.png/130px-The_Whisperer.png",
        "Theatre of Blood": "https://oldschool.runescape.wiki/images/thumb/Theatre_of_Blood_logo.png/130px-Theatre_of_Blood_logo.png",
        "Theatre of Blood: Hard Mode": "https://oldschool.runescape.wiki/images/thumb/Theatre_of_Blood_Hard_Mode_logo.png/130px-Theatre_of_Blood_Hard_Mode_logo.png",
        "Thermonuclear Smoke Devil": "https://oldschool.runescape.wiki/images/thumb/Thermonuclear_smoke_devil.png/130px-Thermonuclear_smoke_devil.png",
        "Tombs of Amascut": "https://oldschool.runescape.wiki/images/thumb/Tombs_of_Amascut_logo.png/130px-Tombs_of_Amascut_logo.png",
        "Tombs of Amascut: Expert Mode": "https://oldschool.runescape.wiki/images/thumb/Tombs_of_Amascut_Expert_Mode_logo.png/130px-Tombs_of_Amascut_Expert_Mode_logo.png",
        "TzKal-Zuk": "https://oldschool.runescape.wiki/images/thumb/TzKal-Zuk.png/130px-TzKal-Zuk.png",
        "TzTok-Jad": "https://oldschool.runescape.wiki/images/thumb/TzTok-Jad.png/130px-TzTok-Jad.png",
        "Vardorvis": "https://oldschool.runescape.wiki/images/thumb/Vardorvis.png/130px-Vardorvis.png",
        "Venenatis": "https://oldschool.runescape.wiki/images/thumb/Venenatis.png/130px-Venenatis.png",
        "Vet'ion": "https://oldschool.runescape.wiki/images/thumb/Vet%27ion.png/130px-Vet%27ion.png",
        "Vorkath": "https://oldschool.runescape.wiki/images/thumb/Vorkath.png/130px-Vorkath.png",
        "Wintertodt": "https://oldschool.runescape.wiki/images/thumb/Wintertodt.png/130px-Wintertodt.png",
        "Zalcano": "https://oldschool.runescape.wiki/images/thumb/Zalcano.png/130px-Zalcano.png",
        "Zulrah": "https://oldschool.runescape.wiki/images/thumb/Zulrah.png/130px-Zulrah.png"
    };

    const bossActivityNames = Object.keys(bossIconUrls).sort();

    // ===================================
    // --- SKILL UNLOCK MANIFEST ---
    // ===================================
    // Comprehensive unlock data for each skill (items, activities, recipes, quests, teleports)
    const skillUnlocks = {
        "Attack": [
            // Weapons - Swords
            { type: "item", name: "Bronze Sword", level: 1, category: "Weapon" },
            { type: "item", name: "Iron Sword", level: 1, category: "Weapon" },
            { type: "item", name: "Steel Sword", level: 5, category: "Weapon" },
            { type: "item", name: "Black Sword", level: 10, category: "Weapon" },
            { type: "item", name: "Mithril Sword", level: 20, category: "Weapon" },
            { type: "item", name: "Adamant Sword", level: 30, category: "Weapon" },
            { type: "item", name: "Rune Sword", level: 40, category: "Weapon" },
            { type: "item", name: "Dragon Sword", level: 60, category: "Weapon" },
            // Weapons - Scimitars
            { type: "item", name: "Bronze Scimitar", level: 1, category: "Weapon" },
            { type: "item", name: "Iron Scimitar", level: 1, category: "Weapon" },
            { type: "item", name: "Steel Scimitar", level: 5, category: "Weapon" },
            { type: "item", name: "Black Scimitar", level: 10, category: "Weapon" },
            { type: "item", name: "Mithril Scimitar", level: 20, category: "Weapon" },
            { type: "item", name: "Adamant Scimitar", level: 30, category: "Weapon" },
            { type: "item", name: "Rune Scimitar", level: 40, category: "Weapon" },
            { type: "item", name: "Dragon Scimitar", level: 60, category: "Weapon" },
            // Weapons - Longswords
            { type: "item", name: "Bronze Longsword", level: 1, category: "Weapon" },
            { type: "item", name: "Iron Longsword", level: 1, category: "Weapon" },
            { type: "item", name: "Steel Longsword", level: 5, category: "Weapon" },
            { type: "item", name: "Black Longsword", level: 10, category: "Weapon" },
            { type: "item", name: "Mithril Longsword", level: 20, category: "Weapon" },
            { type: "item", name: "Adamant Longsword", level: 30, category: "Weapon" },
            { type: "item", name: "Rune Longsword", level: 40, category: "Weapon" },
            { type: "item", name: "Dragon Longsword", level: 60, category: "Weapon" },
            // Weapons - Daggers
            { type: "item", name: "Bronze Dagger", level: 1, category: "Weapon" },
            { type: "item", name: "Iron Dagger", level: 1, category: "Weapon" },
            { type: "item", name: "Steel Dagger", level: 5, category: "Weapon" },
            { type: "item", name: "Black Dagger", level: 10, category: "Weapon" },
            { type: "item", name: "Mithril Dagger", level: 20, category: "Weapon" },
            { type: "item", name: "Adamant Dagger", level: 30, category: "Weapon" },
            { type: "item", name: "Rune Dagger", level: 40, category: "Weapon" },
            { type: "item", name: "Dragon Dagger", level: 60, category: "Weapon" },
            // Special Weapons
            { type: "item", name: "Abyssal Whip", level: 70, category: "Weapon" },
            { type: "item", name: "Abyssal Tentacle", level: 70, category: "Weapon" },
            { type: "item", "name": "Saradomin Sword", level: 70, category: "Weapon" },
            { type: "item", name: "Zamorakian Spear", level: 70, category: "Weapon" },
            { type: "item", name: "Godswords", level: 75, category: "Weapon" },
            { type: "item", name: "Scythe of Vitur", level: 80, category: "Weapon" },
            { type: "item", name: "Ghrazi Rapier", level: 80, category: "Weapon" },
            { type: "item", name: "Inquisitor's Mace", level: 80, category: "Weapon" },
            { type: "item", name: "Osmumten's Fang", level: 82, category: "Weapon" },
            // Quest Requirements
            { type: "quest", name: "Vampyre Slayer", level: 20, category: "Quest Requirement" },
            { type: "quest", name: "The Fremennik Trials", level: 40, category: "Quest Requirement" },
            { type: "quest", name: "Monkey Madness I", level: 43, category: "Quest Requirement" },
            { type: "quest", name: "Sins of the Father", level: 50, category: "Quest Requirement" },
            { type: "quest", name: "Dragon Slayer II", level: 60, category: "Quest Requirement" },
            { type: "quest", name: "The Forsaken Tower", level: 20, category: "Quest Requirement" }
        ],
        "Strength": [
            // Weapons - Battleaxes
            { type: "item", name: "Bronze Battleaxe", level: 1, category: "Weapon" },
            { type: "item", name: "Iron Battleaxe", level: 1, category: "Weapon" },
            { type: "item", name: "Steel Battleaxe", level: 5, category: "Weapon" },
            { type: "item", name: "Black Battleaxe", level: 10, category: "Weapon" },
            { type: "item", name: "Mithril Battleaxe", level: 20, category: "Weapon" },
            { type: "item", name: "Adamant Battleaxe", level: 30, category: "Weapon" },
            { type: "item", name: "Rune Battleaxe", level: 40, category: "Weapon" },
            { type: "item", name: "Dragon Battleaxe", level: 60, category: "Weapon" },
            // Weapons - Warhammers
            { type: "item", name: "Bronze Warhammer", level: 1, category: "Weapon" },
            { type: "item", name: "Iron Warhammer", level: 1, category: "Weapon" },
            { type: "item", name: "Steel Warhammer", level: 5, category: "Weapon" },
            { type: "item", name: "Black Warhammer", level: 10, category: "Weapon" },
            { type: "item", name: "Mithril Warhammer", level: 20, category: "Weapon" },
            { type: "item", name: "Adamant Warhammer", level: 30, category: "Weapon" },
            { type: "item", name: "Rune Warhammer", level: 40, "category": "Weapon" },
            { type: "item", name: "Dragon Warhammer", level: 60, category: "Weapon" },
            // Special Weapons
            { type: "item", name: "Granite Maul", level: 50, category: "Weapon" },
            { type: "item", name: "Dharok's Greataxe", level: 70, category: "Weapon" },
            { type: "item", name: "Abyssal Dagger", level: 70, category: "Weapon" },
            // Activities & Guilds
            { type: "activity", name: "Warriors' Guild", level: 65, category: "Guild Access" },
            { type: "activity", name: "Tzhaar Fight Cave", level: 40, category: "Minigame" },
            // Quest Requirements
            { type: "quest", name: "Haunted Mine", level: 15, category: "Quest Requirement" },
            { type: "quest", name: "Tai Bwo Wannai Trio", level: 30, category: "Quest Requirement" },
            { type: "quest", name: "Legends' Quest", level: 50, category: "Quest Requirement" }
        ],
        "Defence": [
            // Armor - Platebodies
            { type: "item", name: "Bronze Platebody", level: 1, category: "Armor" },
            { type: "item", name: "Iron Platebody", level: 1, category: "Armor" },
            { type: "item", name: "Steel Platebody", level: 5, category: "Armor" },
            { type: "item", name: "Black Platebody", level: 10, category: "Armor" },
            { type: "item", name: "Mithril Platebody", level: 20, category: "Armor" },
            { type: "item", name: "Adamant Platebody", level: 30, category: "Armor" },
            { type: "item", name: "Rune Platebody", level: 40, category: "Armor" },
            { type: "item", name: "Dragon Platebody", level: 60, category: "Armor" },
            // Armor - Shields
            { type: "item", name: "Bronze Kiteshield", level: 1, category: "Shield" },
            { type: "item", name: "Iron Kiteshield", level: 1, category: "Shield" },
            { type: "item", name: "Steel Kiteshield", level: 5, category: "Shield" },
            { type: "item", name: "Black Kiteshield", level: 10, category: "Shield" },
            { type: "item", name: "Mithril Kiteshield", level: 20, category: "Shield" },
            { type: "item", name: "Adamant Kiteshield", level: 30, category: "Shield" },
            { type: "item", name: "Rune Kiteshield", level: 40, category: "Shield" },
            { type: "item", name: "Dragon Kiteshield", level: 60, category: "Shield" },
            // Special Armor
            { type: "item", name: "Granite Shield", level: 50, category: "Shield" },
            { type: "item", name: "Dragonfire Shield", level: 75, category: "Shield" },
            { type: "item", name: "Barrows Armour", level: 70, category: "Armor" },
            { type: "item", name: "Bandos Armour", level: 65, category: "Armor" },
            { type: "item", name: "Justiciar Armour", level: 75, category: "Armor" },
            // Activities & Guilds
            { type: "activity", name: "Warriors' Guild", level: 65, category: "Guild Access" },
            // Quest Requirements
            { type: "quest", name: "Dragon Slayer I", level: 33, category: "Quest Requirement" },
            { type: "quest", name: "The Fremennik Trials", level: 40, category: "Quest Requirement" },
            { type: "quest", name: "Olaf's Quest", level: 40, category: "Quest Requirement" },
            { type: "quest", name: "King's Ransom", level: 45, category: "Quest Requirement" }
        ],
        "Ranged": [
            { type: "item", name: "Oak Shortbow", level: 5, category: "Weapon" },
            { type: "item", name: "Willow Shortbow", level: 20, category: "Weapon" },
            { type: "item", name: "Maple Shortbow", level: 30, category: "Weapon" },
            { type: "item", name: "Yew Shortbow", level: 40, category: "Weapon" },
            { type: "item", name: "Magic Shortbow", level: 50, category: "Weapon" },
            { type: "item", name: "Dark Bow", level: 60, category: "Weapon" },
            { type: "item", name: "Twisted Bow", level: 75, category: "Weapon" },
            { type: "activity", name: "Ranging Guild", level: 40, category: "Guild Access" }
        ],
        "Prayer": [
            { type: "spell", name: "Protect from Melee", level: 43, category: "Prayer" },
            { type: "spell", name: "Protect from Missiles", level: 40, category: "Prayer" },
            { type: "spell", name: "Protect from Magic", level: 37, category: "Prayer" },
            { type: "spell", name: "Piety", level: 70, category: "Prayer" },
            { type: "spell", name: "Rigour", level: 74, category: "Prayer" },
            { type: "spell", name: "Augury", level: 77, category: "Prayer" },
            { type: "item", name: "Dragon Bones Altar", level: 43, category: "Training" }
        ],
        "Magic": [
            { type: "spell", name: "Teleport to Varrock", level: 25, category: "Teleport" },
            { type: "spell", name: "Teleport to Lumbridge", level: 31, category: "Teleport" },
            { type: "spell", name: "Teleport to Falador", level: 37, category: "Teleport" },
            { type: "spell", name: "Teleport to Camelot", level: 45, category: "Teleport" },
            { type: "spell", name: "High Level Alchemy", level: 55, category: "Spell" },
            { type: "spell", name: "Ice Barrage", level: 94, category: "Spell" },
            { type: "quest", name: "Desert Treasure", level: 50, category: "Quest Requirement" },
            { type: "activity", name: "Magic Guild", level: 66, category: "Guild Access" }
        ],
        "Cooking": [
            { type: "item", name: "Cooked Shrimp", level: 1, category: "Food" },
            { type: "item", name: "Cooked Trout", level: 15, category: "Food" },
            { type: "item", name: "Cooked Salmon", level: 25, category: "Food" },
            { type: "item", name: "Cooked Tuna", level: 30, category: "Food" },
            { type: "item", name: "Cooked Lobster", level: 40, category: "Food" },
            { type: "item", name: "Cooked Swordfish", level: 45, category: "Food" },
            { type: "item", name: "Cooked Shark", level: 80, category: "Food" },
            { type: "item", name: "Cooked Anglerfish", level: 84, category: "Food" },
            { type: "recipe", name: "Pie Baking", level: 30, category: "Recipe" }
        ],
        "Woodcutting": [
            { type: "item", name: "Normal Logs", level: 1, category: "Resource" },
            { type: "item", name: "Oak Logs", level: 15, category: "Resource" },
            { type: "item", name: "Willow Logs", level: 30, category: "Resource" },
            { type: "item", name: "Maple Logs", level: 45, category: "Resource" },
            { type: "item", name: "Yew Logs", level: 60, category: "Resource" },
            { type: "item", name: "Magic Logs", level: 75, category: "Resource" },
            { type: "item", name: "Redwood Logs", level: 90, category: "Resource" },
            { type: "activity", name: "Woodcutting Guild", level: 60, category: "Guild Access" }
        ],
        "Fletching": [
            { type: "item", name: "Arrow Shafts", level: 1, category: "Ammunition" },
            { type: "item", name: "Bronze Arrows", level: 1, category: "Ammunition" },
            { type: "item", name: "Iron Arrows", level: 15, category: "Ammunition" },
            { type: "item", name: "Steel Arrows", level: 30, category: "Ammunition" },
            { type: "item", name: "Mithril Arrows", level: 45, category: "Ammunition" },
            { type: "item", name: "Adamant Arrows", level: 60, category: "Ammunition" },
            { type: "item", name: "Rune Arrows", level: 75, category: "Ammunition" },
            { type: "item", name: "Dragon Arrows", level: 90, category: "Ammunition" },
            { type: "item", name: "Magic Shortbow (u)", level: 50, category: "Weapon" }
        ],
        "Fishing": [
            { type: "item", name: "Raw Shrimp", level: 1, category: "Resource" },
            { type: "item", name: "Raw Trout", level: 20, category: "Resource" },
            { type: "item", name: "Raw Salmon", level: 30, category: "Resource" },
            { type: "item", name: "Raw Tuna", level: 35, category: "Resource" },
            { type: "item", name: "Raw Lobster", level: 40, category: "Resource" },
            { type: "item", name: "Raw Swordfish", level: 50, category: "Resource" },
            { type: "item", name: "Raw Shark", level: 76, category: "Resource" },
            { type: "item", name: "Raw Anglerfish", level: 82, category: "Resource" },
            { type: "activity", name: "Fishing Trawler", level: 15, category: "Minigame" }
        ],
        "Firemaking": [
            { type: "activity", name: "Light Normal Logs", level: 1, category: "Training" },
            { type: "activity", name: "Light Oak Logs", level: 15, category: "Training" },
            { type: "activity", name: "Light Willow Logs", level: 30, category: "Training" },
            { type: "activity", name: "Light Maple Logs", level: 45, category: "Training" },
            { type: "activity", name: "Light Yew Logs", level: 60, category: "Training" },
            { type: "activity", name: "Light Magic Logs", level: 75, category: "Training" },
            { type: "activity", name: "Light Redwood Logs", level: 90, category: "Training" },
            { type: "minigame", name: "Wintertodt", level: 50, category: "Minigame" }
        ],
        "Crafting": [
            { type: "item", name: "Leather Gloves", level: 1, category: "Armor" },
            { type: "item", name: "Leather Boots", level: 7, category: "Armor" },
            { type: "item", name: "Leather Cowl", level: 9, category: "Armor" },
            { type: "item", name: "Hard Leather Body", level: 28, category: "Armor" },
            { type: "item", name: "Snakeskin Boots", level: 45, category: "Armor" },
            { type: "item", name: "Dragonhide Body", level: 75, category: "Armor" },
            { type: "quest", name: "Crafting Guild", level: 40, category: "Guild Access" }
        ],
        "Smithing": [
            // Bars
            { type: "item", name: "Bronze Bar", level: 1, category: "Material" },
            { type: "item", name: "Iron Bar", level: 15, category: "Material" },
            { type: "item", name: "Steel Bar", level: 30, category: "Material" },
            { type: "item", name: "Mithril Bar", level: 50, category: "Material" },
            { type: "item", name: "Adamant Bar", level: 70, category: "Material" },
            { type: "item", name: "Rune Bar", level: 85, category: "Material" },
            // Platebodies
            { type: "item", name: "Bronze Platebody", level: 1, category: "Armor" },
            { type: "item", name: "Iron Platebody", level: 1, category: "Armor" },
            { type: "item", name: "Steel Platebody", level: 5, category: "Armor" },
            { type: "item", name: "Mithril Platebody", level: 20, category: "Armor" },
            { type: "item", name: "Adamant Platebody", level: 30, category: "Armor" },
            { type: "item", name: "Rune Platebody", level: 40, category: "Armor" },
            { type: "item", name: "Dragon Platebody", level: 60, category: "Armor" },
            // Platelegs
            { type: "item", name: "Bronze Platelegs", level: 1, category: "Armor" },
            { type: "item", name: "Iron Platelegs", level: 1, category: "Armor" },
            { type: "item", name: "Steel Platelegs", level: 5, category: "Armor" },
            { type: "item", name: "Mithril Platelegs", level: 20, category: "Armor" },
            { type: "item", name: "Adamant Platelegs", level: 30, category: "Armor" },
            { type: "item", name: "Rune Platelegs", level: 40, category: "Armor" },
            { type: "item", name: "Dragon Platelegs", level: 60, category: "Armor" },
            // Full Helms
            { type: "item", name: "Bronze Full Helm", level: 1, category: "Armor" },
            { type: "item", name: "Iron Full Helm", level: 1, category: "Armor" },
            { type: "item", name: "Steel Full Helm", level: 5, category: "Armor" },
            { type: "item", name: "Mithril Full Helm", level: 20, category: "Armor" },
            { type: "item", name: "Adamant Full Helm", level: 30, category: "Armor" },
            { type: "item", name: "Rune Full Helm", level: 40, category: "Armor" },
            { type: "item", name: "Dragon Full Helm", level: 60, category: "Armor" },
            // Weapons
            { type: "item", name: "Bronze Scimitar", level: 1, category: "Weapon" },
            { type: "item", name: "Iron Scimitar", level: 1, category: "Weapon" },
            { type: "item", name: "Steel Scimitar", level: 5, category: "Weapon" },
            { type: "item", name: "Mithril Scimitar", level: 20, category: "Weapon" },
            { type: "item", name: "Adamant Scimitar", level: 30, category: "Weapon" },
            { type: "item", name: "Rune Scimitar", level: 40, category: "Weapon" },
            { type: "item", name: "Dragon Scimitar", level: 60, category: "Weapon" },
            // Special Items
            { type: "item", name: "Cannonball", level: 35, category: "Ammunition" },
            { type: "item", name: "Dart Tips", level: 10, category: "Ammunition" },
            { type: "item", name: "Arrowtips", level: 15, category: "Ammunition" },
            { type: "item", name: "Bolts", level: 9, category: "Ammunition" },
            { type: "activity", name: "Smithing Guild", level: 60, category: "Guild Access" }
        ],
        "Mining": [
            { type: "item", name: "Copper Ore", level: 1, category: "Resource" },
            { type: "item", name: "Tin Ore", level: 1, category: "Resource" },
            { type: "item", name: "Iron Ore", level: 15, category: "Resource" },
            { type: "item", name: "Coal", level: 30, category: "Resource" },
            { type: "item", name: "Mithril Ore", level: 55, category: "Resource" },
            { type: "item", name: "Adamantite Ore", level: 70, category: "Resource" },
            { type: "item", name: "Runite Ore", level: 85, category: "Resource" },
            { type: "activity", name: "Mining Guild", level: 60, category: "Guild Access" }
        ],
        "Herblore": [
            { type: "item", name: "Attack Potion", level: 3, category: "Potion" },
            { type: "item", name: "Strength Potion", level: 12, category: "Potion" },
            { type: "item", name: "Defence Potion", level: 30, category: "Potion" },
            { type: "item", name: "Prayer Potion", level: 38, category: "Potion" },
            { type: "item", name: "Super Attack", level: 45, category: "Potion" },
            { type: "item", name: "Super Strength", level: 55, category: "Potion" },
            { type: "item", name: "Super Defence", level: 66, category: "Potion" },
            { type: "item", name: "Saradomin Brew", level: 81, category: "Potion" },
            { type: "item", name: "Super Combat Potion", level: 90, category: "Potion" }
        ],
        "Agility": [
            { type: "course", name: "Gnome Stronghold", level: 1, category: "Course" },
            { type: "course", name: "Draynor Village", level: 10, category: "Course" },
            { type: "course", name: "Al Kharid", level: 20, category: "Course" },
            { type: "course", name: "Varrock", level: 30, category: "Course" },
            { type: "course", name: "Canifis", level: 40, category: "Course" },
            { type: "course", name: "Falador", level: 50, category: "Course" },
            { type: "course", name: "Seers' Village", level: 60, category: "Course" },
            { type: "course", name: "Pollnivneach", level: 70, category: "Course" },
            { type: "course", name: "Rellekka", level: 80, category: "Course" },
            { type: "course", name: "Ardougne", level: 90, category: "Course" },
            { type: "shortcut", name: "Yanille Agility Shortcut", level: 40, category: "Shortcut" }
        ],
        "Thieving": [
            { type: "npc", name: "Man/Woman", level: 1, category: "Pickpocket" },
            { type: "npc", name: "Farmer", level: 10, category: "Pickpocket" },
            { type: "npc", name: "Master Farmer", level: 38, category: "Pickpocket" },
            { type: "npc", name: "Guard", level: 40, category: "Pickpocket" },
            { type: "npc", name: "Knight", level: 55, category: "Pickpocket" },
            { type: "npc", name: "Paladin", level: 70, category: "Pickpocket" },
            { type: "npc", name: "Hero", level: 80, category: "Pickpocket" },
            { type: "chest", name: "Nature Rune Chest", level: 28, category: "Chest" },
            { type: "chest", name: "Paladin Chest", level: 72, category: "Chest" }
        ],
        "Slayer": [
            { type: "task", name: "Cave Slimes", level: 17, category: "Slayer Task" },
            { type: "task", name: "Cave Crawlers", level: 10, category: "Slayer Task" },
            { type: "task", name: "Banshees", level: 15, category: "Slayer Task" },
            { type: "task", name: "Cave Horrors", level: 58, category: "Slayer Task" },
            { type: "task", name: "Aberrant Spectres", level: 60, category: "Slayer Task" },
            { type: "task", name: "Gargoyles", level: 75, category: "Slayer Task" },
            { type: "task", name: "Nechryaels", level: 80, category: "Slayer Task" },
            { type: "task", name: "Abyssal Demons", level: 85, category: "Slayer Task" },
            { type: "task", name: "Dark Beasts", level: 90, category: "Slayer Task" },
            { type: "master", name: "Duradel", level: 50, category: "Slayer Master" }
        ],
        "Farming": [
            { type: "patch", name: "Allotment Patches", level: 1, category: "Patch" },
            { type: "patch", name: "Herb Patches", level: 9, category: "Patch" },
            { type: "patch", name: "Tree Patches", level: 15, category: "Patch" },
            { type: "patch", name: "Fruit Tree Patches", level: 27, category: "Patch" },
            { type: "patch", name: "Special Patches", level: 35, category: "Patch" },
            { type: "seed", name: "Guam Seed", level: 1, category: "Seed" },
            { type: "seed", name: "Ranarr Seed", level: 32, category: "Seed" },
            { type: "seed", name: "Snapdragon Seed", level: 62, category: "Seed" },
            { type: "seed", name: "Torstol Seed", level: 85, category: "Seed" }
        ],
        "Runecraft": [
            { type: "rune", name: "Air Rune", level: 1, category: "Rune" },
            { type: "rune", name: "Mind Rune", level: 2, category: "Rune" },
            { type: "rune", name: "Water Rune", level: 5, category: "Rune" },
            { type: "rune", name: "Earth Rune", level: 9, category: "Rune" },
            { type: "rune", name: "Fire Rune", level: 14, category: "Rune" },
            { type: "rune", name: "Body Rune", level: 20, category: "Rune" },
            { type: "rune", name: "Nature Rune", level: 44, category: "Rune" },
            { type: "rune", name: "Law Rune", level: 54, category: "Rune" },
            { type: "rune", name: "Death Rune", level: 65, category: "Rune" },
            { type: "rune", name: "Blood Rune", level: 77, category: "Rune" },
            { type: "rune", name: "Soul Rune", level: 90, category: "Rune" }
        ],
        "Hunter": [
            { type: "trap", name: "Bird Snare", level: 1, category: "Trap" },
            { type: "trap", name: "Box Trap", level: 23, category: "Trap" },
            { type: "creature", name: "Crimson Swift", level: 1, category: "Creature" },
            { type: "creature", name: "Tropical Wagtail", level: 19, category: "Creature" },
            { type: "creature", name: "Chinchompa", level: 53, category: "Creature" },
            { type: "creature", name: "Red Chinchompa", level: 63, category: "Creature" },
            { type: "creature", name: "Black Chinchompa", level: 73, category: "Creature" },
            { type: "creature", name: "Herbiboar", level: 80, category: "Creature" }
        ],
        "Construction": [
            { type: "room", name: "Garden", level: 1, category: "Room" },
            { type: "room", name: "Parlour", level: 1, category: "Room" },
            { type: "furniture", name: "Oak Larder", level: 33, category: "Furniture" },
            { type: "furniture", name: "Oak Altar", level: 45, category: "Furniture" },
            { type: "furniture", name: "Oak Lectern", level: 40, category: "Furniture" },
            { type: "furniture", name: "Gilded Altar", level: 75, category: "Furniture" },
            { type: "furniture", name: "Spirit Tree", level: 83, category: "Furniture" },
            { type: "teleport", name: "Portal Chamber", level: 50, category: "Teleport" }
        ]
    };

    // ===================================
    // --- SKILL DETAILS FUNCTION ---
    // ===================================
    function showSkillDetails(skillName, skillData) {
        const detailsPanel = document.getElementById('skill-details-panel');
        if (!detailsPanel) return;

        const currentLevel = skillData.level || 0;
        const currentXp = skillData.xp || 0;
        const unlocks = skillUnlocks[skillName] || [];
        
        // Sort unlocks by level (null levels go to end)
        const sortedUnlocks = unlocks.sort((a, b) => {
            if (a.level === null && b.level === null) return 0;
            if (a.level === null) return 1;
            if (b.level === null) return -1;
            return a.level - b.level;
        });
        
        // Group unlocks by category
        const unlocksByCategory = {};
        sortedUnlocks.forEach(unlock => {
            if (!unlocksByCategory[unlock.category]) {
                unlocksByCategory[unlock.category] = [];
            }
            unlocksByCategory[unlock.category].push(unlock);
        });

        let html = `
            <div class="skill-details-header">
                <h3>${skillName} Details</h3>
                <button class="close-details" onclick="document.getElementById('skill-details-panel').classList.remove('active')">×</button>
            </div>
            <div class="skill-stats">
                <div class="stat-item">
                    <strong>Current Level:</strong> ${currentLevel}
                </div>
                <div class="stat-item">
                    <strong>Current XP:</strong> ${currentXp.toLocaleString()}
                </div>
                <div class="stat-item">
                    <strong>XP to Next Level:</strong> ${currentLevel < 99 ? (getXpForLevel(currentLevel + 1) - currentXp).toLocaleString() : 'Maxed!'}
                </div>
            </div>
            <div class="unlocks-section">
                <h4>Unlocks & Requirements</h4>
        `;

        // Display unlocks by category
        if (Object.keys(unlocksByCategory).length === 0) {
            html += `<p style="color: #888; text-align: center; padding: 20px;">No unlock data available for this skill.</p>`;
        } else {
            Object.keys(unlocksByCategory).sort().forEach(category => {
                html += `<div class="unlock-category">
                    <h5>${category} (${unlocksByCategory[category].length})</h5>
                    <ul class="unlock-list">`;
                
                unlocksByCategory[category].forEach(unlock => {
                    const isUnlocked = unlock.level === null ? false : currentLevel >= unlock.level;
                    const unlockClass = isUnlocked ? 'unlocked' : 'locked';
                    const levelDisplay = unlock.level !== null ? `Lvl ${unlock.level}` : 'N/A';
                    html += `
                        <li class="unlock-item ${unlockClass}" 
                            data-skill="${skillName}" 
                            data-level="${unlock.level || 0}" 
                            data-unlock-name="${unlock.name}"
                            data-unlock-type="${unlock.type}">
                            <span class="unlock-level">${levelDisplay}</span>
                            <span class="unlock-name">${unlock.name}</span>
                            <span class="unlock-status">${isUnlocked ? '✓ Unlocked' : '🔒 Locked'}</span>
                        </li>
                    `;
                });
                
                html += `</ul></div>`;
            });
        }

        html += `</div>`;

        detailsPanel.innerHTML = html;
        detailsPanel.classList.add('active');

        // Add right-click context menu to unlock items
        const unlockItems = detailsPanel.querySelectorAll('.unlock-item');
        unlockItems.forEach(item => {
            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                showUnlockContextMenu(e, item);
            });
        });
    }

    // ===================================
    // --- UNLOCK CONTEXT MENU ---
    // ===================================
    function showUnlockContextMenu(event, unlockElement) {
        const contextMenu = document.getElementById('custom-context-menu');
        if (!contextMenu) return;

        const skillName = unlockElement.getAttribute('data-skill');
        const level = unlockElement.getAttribute('data-level');
        const unlockName = unlockElement.getAttribute('data-unlock-name');
        const unlockType = unlockElement.getAttribute('data-unlock-type');

        // Position context menu
        contextMenu.style.display = 'block';
        contextMenu.style.left = event.pageX + 'px';
        contextMenu.style.top = event.pageY + 'px';

        // Update context menu actions
        const setGoalAction = contextMenu.querySelector('[data-action="set-goal"]');
        if (setGoalAction) {
            setGoalAction.onclick = () => {
                // Create goal for this unlock
                goals.push({
                    type: 'skill',
                    name: skillName,
                    target: parseInt(level),
                    unlockName: unlockName,
                    unlockType: unlockType
                });
                saveGoals();
                renderGoals();
                contextMenu.style.display = 'none';
                
                // Show notification
                alert(`Goal set: Reach Level ${level} ${skillName} for ${unlockName}`);
            };
        }

        const viewWikiAction = contextMenu.querySelector('[data-action="view-wiki"]');
        if (viewWikiAction) {
            viewWikiAction.onclick = () => {
                const wikiUrl = `https://oldschool.runescape.wiki/w/${encodeURIComponent(unlockName)}`;
                window.open(wikiUrl, '_blank');
                contextMenu.style.display = 'none';
            };
        }

        // Close menu when clicking elsewhere
        const closeMenu = (e) => {
            if (!contextMenu.contains(e.target) && e.target !== unlockElement) {
                contextMenu.style.display = 'none';
                document.removeEventListener('click', closeMenu);
            }
        };
        setTimeout(() => document.addEventListener('click', closeMenu), 100);
    }

    // ===================================
    // --- BOSS UNLOCKS & DROPS DATA ---
    // ===================================
    const bossUnlocksAndDrops = {
        "Zulrah": {
            unlocks: [
                { type: "item", name: "Tanzanite Fang", level: null, category: "Unique Drop" },
                { type: "item", name: "Magic Fang", level: null, category: "Unique Drop" },
                { type: "item", name: "Serpentine Visage", level: null, category: "Unique Drop" },
                { type: "item", name: "Uncharged Toxic Trident", level: null, category: "Unique Drop" },
                { type: "quest", name: "Regicide", level: null, category: "Quest Requirement" }
            ],
            uniqueDrops: [
                { name: "Tanzanite Fang", rate: "1/512", rarity: "Very Rare" },
                { name: "Magic Fang", rate: "1/512", rarity: "Very Rare" },
                { name: "Serpentine Visage", rate: "1/512", rarity: "Very Rare" },
                { name: "Uncharged Toxic Trident", rate: "1/512", rarity: "Very Rare" },
                { name: "Tanzanite Mutagen", rate: "1/13,168", rarity: "Extremely Rare" },
                { name: "Magma Mutagen", rate: "1/13,168", rarity: "Extremely Rare" }
            ]
        },
        "Vorkath": {
            unlocks: [
                { type: "quest", name: "Dragon Slayer II", level: null, category: "Quest Requirement" },
                { type: "item", name: "Dragonbone Necklace", level: null, category: "Unique Drop" }
            ],
            uniqueDrops: [
                { name: "Dragonbone Necklace", rate: "1/128", rarity: "Rare" },
                { name: "Skeletal Visage", rate: "1/5,000", rarity: "Extremely Rare" },
                { name: "Draconic Visage", rate: "1/5,000", rarity: "Extremely Rare" },
                { name: "Jar of Decay", rate: "1/3,000", rarity: "Very Rare" }
            ]
        },
        "Chambers of Xeric": {
            unlocks: [
                { type: "quest", name: "Dragon Slayer II", level: null, category: "Quest Requirement" },
                { type: "item", name: "Twisted Bow", level: null, category: "Unique Drop" },
                { type: "item", name: "Kodai Wand", level: null, category: "Unique Drop" }
            ],
            uniqueDrops: [
                { name: "Twisted Bow", rate: "1/23", rarity: "Rare" },
                { name: "Kodai Wand", rate: "1/23", rarity: "Rare" },
                { name: "Elder Maul", rate: "1/23", rarity: "Rare" },
                { name: "Dragon Claws", rate: "1/23", rarity: "Rare" },
                { name: "Dexterous Prayer Scroll", rate: "1/25.6", rarity: "Rare" },
                { name: "Arcane Prayer Scroll", rate: "1/25.6", rarity: "Rare" }
            ]
        },
        "Theatre of Blood": {
            unlocks: [
                { type: "quest", name: "A Taste of Hope", level: null, category: "Quest Requirement" },
                { type: "item", name: "Scythe of Vitur", level: null, category: "Unique Drop" }
            ],
            uniqueDrops: [
                { name: "Scythe of Vitur", rate: "1/86", rarity: "Very Rare" },
                { name: "Sanguinesti Staff", rate: "1/86", rarity: "Very Rare" },
                { name: "Justiciar Faceguard", rate: "1/86", rarity: "Very Rare" },
                { name: "Justiciar Chestguard", rate: "1/86", rarity: "Very Rare" },
                { name: "Justiciar Legguards", rate: "1/86", rarity: "Very Rare" },
                { name: "Avernic Defender Hilt", rate: "1/100", rarity: "Very Rare" }
            ]
        },
        "Tombs of Amascut": {
            unlocks: [
                { type: "quest", name: "Beneath Cursed Sands", level: null, category: "Quest Requirement" },
                { type: "item", name: "Osmumten's Fang", level: null, category: "Unique Drop" }
            ],
            uniqueDrops: [
                { name: "Osmumten's Fang", rate: "1/24", rarity: "Rare" },
                { name: "Lightbearer", rate: "1/24", rarity: "Rare" },
                { name: "Elidinis' Ward", rate: "1/24", rarity: "Rare" },
                { name: "Masori Mask", rate: "1/24", rarity: "Rare" },
                { name: "Masori Body", rate: "1/24", rarity: "Rare" },
                { name: "Masori Chaps", rate: "1/24", rarity: "Rare" },
                { name: "Tumeken's Shadow", rate: "1/24", rarity: "Rare" }
            ]
        },
        "Abyssal Sire": {
            unlocks: [
                { type: "slayer", name: "Abyssal Demon Task", level: 85, category: "Requirement" }
            ],
            uniqueDrops: [
                { name: "Unsired", rate: "1/100", rarity: "Rare" },
                { name: "Abyssal Whip", rate: "1/512 (from Unsired)", rarity: "Very Rare" },
                { name: "Abyssal Dagger", rate: "1/512 (from Unsired)", rarity: "Very Rare" },
                { name: "Abyssal Head", rate: "1/512 (from Unsired)", rarity: "Very Rare" },
                { name: "Abyssal Bludgeon (piece)", rate: "1/512 (from Unsired)", rarity: "Very Rare" },
                { name: "Abyssal Orphan", rate: "1/2,500", rarity: "Extremely Rare" },
                { name: "Jar of Miasma", rate: "1/2,500", rarity: "Extremely Rare" }
            ]
        },
        "Cerberus": {
            unlocks: [
                { type: "slayer", name: "Hellhound Task", level: 91, category: "Requirement" }
            ],
            uniqueDrops: [
                { name: "Primordial Crystal", rate: "1/512", rarity: "Very Rare" },
                { name: "Pegasian Crystal", rate: "1/512", rarity: "Very Rare" },
                { name: "Eternal Crystal", rate: "1/512", rarity: "Very Rare" },
                { name: "Smouldering Stone", rate: "1/512", rarity: "Very Rare" },
                { name: "Jar of Souls", rate: "1/2,000", rarity: "Extremely Rare" },
                { name: "Hellpuppy", rate: "1/3,000", rarity: "Extremely Rare" }
            ]
        },
        "Kalphite Queen": {
            unlocks: [],
            uniqueDrops: [
                { name: "Dragon Chainbody", rate: "1/128", rarity: "Rare" },
                { name: "KQ Head", rate: "1/128", rarity: "Rare" },
                { name: "Dragon 2h Sword", rate: "1/256", rarity: "Rare" },
                { name: "Dragon Pickaxe", rate: "1/400", rarity: "Very Rare" },
                { name: "Jar of Sand", rate: "1/2,000", rarity: "Extremely Rare" },
                { name: "Kalphite Princess", rate: "1/3,000", rarity: "Extremely Rare" }
            ]
        },
        "General Graardor": {
            unlocks: [],
            uniqueDrops: [
                { name: "Bandos Chestplate", rate: "1/381", rarity: "Very Rare" },
                { name: "Bandos Tassets", rate: "1/381", rarity: "Very Rare" },
                { name: "Bandos Boots", rate: "1/381", rarity: "Very Rare" },
                { name: "Bandos Hilt", rate: "1/508", rarity: "Very Rare" },
                { name: "Godsword Shard 1", rate: "1/762", rarity: "Rare" },
                { name: "Godsword Shard 2", rate: "1/762", rarity: "Rare" },
                { name: "Godsword Shard 3", rate: "1/762", rarity: "Rare" },
                { name: "Pet General Graardor", rate: "1/5,000", rarity: "Extremely Rare" }
            ]
        },
        "Commander Zilyana": {
            unlocks: [
                { type: "item", name: "Armadyl Crossbow", level: null, category: "Unique Drop" },
                { type: "item", name: "Armadyl Helmet", level: null, category: "Unique Drop" }
            ],
            uniqueDrops: [
                { name: "Armadyl Crossbow", rate: "1/381", rarity: "Very Rare" },
                { name: "Armadyl Helmet", rate: "1/381", rarity: "Very Rare" },
                { name: "Armadyl Chestplate", rate: "1/381", rarity: "Very Rare" },
                { name: "Armadyl Chainskirt", rate: "1/381", rarity: "Very Rare" },
                { name: "Armadyl Hilt", rate: "1/508", rarity: "Very Rare" }
            ]
        },
        "K'ril Tsutsaroth": {
            unlocks: [
                { type: "item", name: "Zamorakian Spear", level: null, category: "Unique Drop" },
                { type: "item", name: "Staff of the Dead", level: null, category: "Unique Drop" }
            ],
            uniqueDrops: [
                { name: "Zamorakian Spear", rate: "1/381", rarity: "Very Rare" },
                { name: "Staff of the Dead", rate: "1/381", rarity: "Very Rare" },
                { name: "Zamorak Hilt", rate: "1/508", rarity: "Very Rare" }
            ]
        },
        "Kree'Arra": {
            unlocks: [
                { type: "item", name: "Armadyl Helmet", level: null, category: "Unique Drop" },
                { type: "item", name: "Armadyl Crossbow", level: null, category: "Unique Drop" }
            ],
            uniqueDrops: [
                { name: "Armadyl Helmet", rate: "1/381", rarity: "Very Rare" },
                { name: "Armadyl Crossbow", rate: "1/381", rarity: "Very Rare" },
                { name: "Armadyl Chestplate", rate: "1/381", rarity: "Very Rare" },
                { name: "Armadyl Chainskirt", rate: "1/381", rarity: "Very Rare" },
                { name: "Armadyl Hilt", rate: "1/508", rarity: "Very Rare" }
            ]
        },
        "Alchemical Hydra": {
            unlocks: [
                { type: "slayer", name: "Hydra Slayer Task", level: 95, category: "Requirement" },
                { type: "item", name: "Hydra Leather", level: null, category: "Unique Drop" }
            ],
            uniqueDrops: [
                { name: "Hydra Leather", rate: "1/512", rarity: "Very Rare" },
                { name: "Hydra's Eye", rate: "1/1,000", rarity: "Extremely Rare" },
                { name: "Hydra's Fang", rate: "1/1,000", rarity: "Extremely Rare" },
                { name: "Hydra's Heart", rate: "1/1,000", rarity: "Extremely Rare" },
                { name: "Hydra Tail", rate: "1/1,000", rarity: "Extremely Rare" },
                { name: "Jar of Chemicals", rate: "1/3,000", rarity: "Extremely Rare" }
            ]
        },
        "Corporeal Beast": {
            unlocks: [
                { type: "quest", name: "Summer's End", level: null, category: "Quest Requirement" }
            ],
            uniqueDrops: [
                { name: "Elysian Sigil", rate: "1/4,095", rarity: "Extremely Rare" },
                { name: "Spectral Sigil", rate: "1/4,095", rarity: "Extremely Rare" },
                { name: "Arcane Sigil", rate: "1/4,095", rarity: "Extremely Rare" },
                { name: "Spirit Shield", rate: "1/1,365", rarity: "Very Rare" }
            ]
        },
        "Dagannoth Prime": {
            uniqueDrops: [
                { name: "Seers Ring", rate: "1/128", rarity: "Rare" },
                { name: "Archers Ring", rate: "1/128", rarity: "Rare" }
            ]
        },
        "Dagannoth Rex": {
            uniqueDrops: [
                { name: "Warrior Ring", rate: "1/128", rarity: "Rare" },
                { name: "Berserker Ring", rate: "1/128", rarity: "Rare" }
            ]
        },
        "Dagannoth Supreme": {
            uniqueDrops: [
                { name: "Seers Ring", rate: "1/128", rarity: "Rare" },
                { name: "Archers Ring", rate: "1/128", rarity: "Rare" }
            ]
        },
        "Giant Mole": {
            uniqueDrops: [
                { name: "Mole Skin", rate: "1/1,000", rarity: "Very Rare" },
                { name: "Mole Claw", rate: "1/1,000", rarity: "Very Rare" },
                { name: "Baby Mole", rate: "1/3,000", rarity: "Extremely Rare" }
            ]
        },
        "King Black Dragon": {
            uniqueDrops: [
                { name: "Dragon Pickaxe", rate: "1/1,000", rarity: "Very Rare" },
                { name: "Dragon Kiteshield", rate: "1/1,000", rarity: "Very Rare" },
                { name: "Draconic Visage", rate: "1/5,000", rarity: "Extremely Rare" }
            ]
        },
        "Kraken": {
            unlocks: [
                { type: "slayer", name: "Kraken Slayer Task", level: 87, category: "Requirement" }
            ],
            uniqueDrops: [
                { name: "Kraken Tentacle", rate: "1/400", rarity: "Rare" },
                { name: "Trident of the Seas", rate: "1/512", rarity: "Very Rare" },
                { name: "Jar of Dirt", rate: "1/3,000", rarity: "Extremely Rare" }
            ]
        },
        "Nex": {
            unlocks: [
                { type: "quest", name: "The Frozen Door", level: null, category: "Quest Requirement" }
            ],
            uniqueDrops: [
                { name: "Nihil Horn", rate: "1/86", rarity: "Very Rare" },
                { name: "Zaryte Vambraces", rate: "1/86", rarity: "Very Rare" },
                { name: "Zaryte Crossbow", rate: "1/86", rarity: "Very Rare" },
                { name: "Torva Full Helm", rate: "1/86", rarity: "Very Rare" },
                { name: "Torva Platebody", rate: "1/86", rarity: "Very Rare" },
                { name: "Torva Platelegs", rate: "1/86", rarity: "Very Rare" }
            ]
        },
        "Nightmare": {
            uniqueDrops: [
                { name: "Inquisitor's Mace", rate: "1/400", rarity: "Very Rare" },
                { name: "Inquisitor's Great Helm", rate: "1/400", rarity: "Very Rare" },
                { name: "Inquisitor's Hauberk", rate: "1/400", rarity: "Very Rare" },
                { name: "Inquisitor's Plateskirt", rate: "1/400", rarity: "Very Rare" },
                { name: "Eldritch Orb", rate: "1/1,000", rarity: "Extremely Rare" },
                { name: "Harmonised Orb", rate: "1/1,000", rarity: "Extremely Rare" },
                { name: "Volatile Orb", rate: "1/1,000", rarity: "Extremely Rare" }
            ]
        },
        "Phantom Muspah": {
            unlocks: [
                { type: "quest", name: "Secrets of the North", level: null, category: "Quest Requirement" }
            ],
            uniqueDrops: [
                { name: "Ancient Icon", rate: "1/300", rarity: "Rare" },
                { name: "Ancient Sceptre", rate: "1/300", rarity: "Rare" },
                { name: "Venator Shard", rate: "1/300", rarity: "Rare" }
            ]
        },
        "Sarachnis": {
            uniqueDrops: [
                { name: "Sarachnis Cudgel", rate: "1/384", rarity: "Very Rare" },
                { name: "Jar of Eyes", rate: "1/3,000", rarity: "Extremely Rare" }
            ]
        },
        "Skotizo": {
            unlocks: [
                { type: "item", name: "Dark Totem", level: null, category: "Requirement" }
            ],
            uniqueDrops: [
                { name: "Jar of Darkness", rate: "1/2,000", rarity: "Extremely Rare" },
                { name: "Skotizo Pet", rate: "1/65", rarity: "Rare" }
            ]
        },
        "TzTok-Jad": {
            unlocks: [
                { type: "quest", name: "TzHaar Fight Cave", level: null, category: "Requirement" }
            ],
            uniqueDrops: [
                { name: "Tzrek-Jad", rate: "1/200", rarity: "Rare" },
                { name: "Fire Cape", rate: "1/1", rarity: "Guaranteed" }
            ]
        },
        "TzKal-Zuk": {
            unlocks: [
                { type: "quest", name: "Inferno", level: null, category: "Requirement" }
            ],
            uniqueDrops: [
                { name: "Jal-Nib-Rek", rate: "1/100", rarity: "Rare" },
                { name: "Infernal Cape", rate: "1/1", rarity: "Guaranteed" }
            ]
        },
        "Vardorvis": {
            unlocks: [
                { type: "quest", name: "Desert Treasure II", level: null, category: "Quest Requirement" }
            ],
            uniqueDrops: [
                { name: "Ultor Vestige", rate: "1/2,048", rarity: "Extremely Rare" },
                { name: "Ultor Ring", rate: "1/2,048", rarity: "Extremely Rare" },
                { name: "Executioner's Axe", rate: "1/512", rarity: "Very Rare" }
            ]
        },
        "The Leviathan": {
            unlocks: [
                { type: "quest", name: "Desert Treasure II", level: null, category: "Quest Requirement" }
            ],
            uniqueDrops: [
                { name: "Venator Vestige", rate: "1/2,048", rarity: "Extremely Rare" },
                { name: "Venator Ring", rate: "1/2,048", rarity: "Extremely Rare" },
                { name: "Osmumten's Fang", rate: "1/512", rarity: "Very Rare" }
            ]
        },
        "The Whisperer": {
            unlocks: [
                { type: "quest", name: "Desert Treasure II", level: null, category: "Quest Requirement" }
            ],
            uniqueDrops: [
                { name: "Magus Vestige", rate: "1/2,048", rarity: "Extremely Rare" },
                { name: "Magus Ring", rate: "1/2,048", rarity: "Extremely Rare" },
                { name: "Virtus Mask", rate: "1/512", rarity: "Very Rare" },
                { name: "Virtus Robe Top", rate: "1/512", rarity: "Very Rare" },
                { name: "Virtus Robe Bottom", rate: "1/512", rarity: "Very Rare" }
            ]
        },
        "Duke Sucellus": {
            unlocks: [
                { type: "quest", name: "Desert Treasure II", level: null, category: "Quest Requirement" }
            ],
            uniqueDrops: [
                { name: "Bellator Vestige", rate: "1/2,048", rarity: "Extremely Rare" },
                { name: "Bellator Ring", rate: "1/2,048", rarity: "Extremely Rare" },
                { name: "Chromium Ingot", rate: "1/512", rarity: "Very Rare" }
            ]
        },
        "Barrows Chests": {
            uniqueDrops: [
                { name: "Ahrim's Hood", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Ahrim's Robetop", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Ahrim's Robeskirt", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Ahrim's Staff", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Dharok's Helm", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Dharok's Platebody", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Dharok's Platelegs", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Dharok's Greataxe", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Guthan's Helm", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Guthan's Platebody", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Guthan's Chainskirt", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Guthan's Warspear", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Karil's Coif", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Karil's Leathertop", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Karil's Leatherskirt", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Karil's Crossbow", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Torag's Helm", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Torag's Platebody", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Torag's Platelegs", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Torag's Hammers", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Verac's Helm", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Verac's Brassard", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Verac's Plateskirt", rate: "1/1,024", rarity: "Very Rare" },
                { name: "Verac's Flail", rate: "1/1,024", rarity: "Very Rare" }
            ]
        }
    };

    // ===================================
    // --- BOSS DETAILS FUNCTION ---
    // ===================================
    function showBossDetails(bossName, bossData) {
        const detailsPanel = document.getElementById('boss-details-panel');
        if (!detailsPanel) return;

        const currentKc = bossData.kc || 0;
        const bossInfo = bossUnlocksAndDrops[bossName] || { unlocks: [], uniqueDrops: [] };

        let html = `
            <div class="boss-details-header">
                <h3>${bossName} Details</h3>
                <button class="close-details" onclick="document.getElementById('boss-details-panel').classList.remove('active')">×</button>
            </div>
            <div class="boss-stats">
                <div class="stat-item">
                    <strong>Kill Count:</strong> ${currentKc.toLocaleString()}
                </div>
                <div class="stat-item">
                    <strong>Rank:</strong> ${bossData.rank > 0 ? bossData.rank.toLocaleString() : 'Unranked'}
                </div>
            </div>
        `;

        // Show unlocks
        if (bossInfo.unlocks && bossInfo.unlocks.length > 0) {
            html += `
                <div class="unlocks-section">
                    <h4>Unlocks & Requirements</h4>
                    <ul class="unlock-list">
            `;
            bossInfo.unlocks.forEach(unlock => {
                html += `
                    <li class="unlock-item">
                        <span class="unlock-name">${unlock.name}</span>
                        <span class="unlock-category">${unlock.category}</span>
                    </li>
                `;
            });
            html += `</ul></div>`;
        }

        // Show unique drops
        if (bossInfo.uniqueDrops && bossInfo.uniqueDrops.length > 0) {
            html += `
                <div class="drops-section">
                    <h4>Unique Drops</h4>
                    <table class="drops-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Drop Rate</th>
                                <th>Rarity</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            bossInfo.uniqueDrops.forEach(drop => {
                html += `
                    <tr>
                        <td>
                            <span class="drop-item-icon-placeholder">📦</span>
                            <strong>${drop.name}</strong>
                        </td>
                        <td>${drop.rate}</td>
                        <td><span class="rarity-${drop.rarity.toLowerCase().replace(/\s+/g, '-')}">${drop.rarity}</span></td>
                    </tr>
                `;
            });
            html += `</tbody></table></div>`;
        } else {
            html += `
                <div class="drops-section">
                    <h4>Unique Drops</h4>
                    <p style="color: #888; padding: 15px; text-align: center;">
                        Drop table data not yet available for this boss. Check back soon!
                    </p>
                </div>
            `;
        }

        html += `</div>`;

        detailsPanel.innerHTML = html;
        detailsPanel.classList.add('active');
    }

    // ===================================
    // --- Populate Dropdowns Function ---
    // ===================================
    function populateDropdowns() {
        goalNameSkillSelect.innerHTML = '';
        goalNameBossSelect.innerHTML = '';

        skillDropdownNames.forEach(skillName => {
            const option = document.createElement("option");
            option.value = skillName;
            option.textContent = skillName;
            goalNameSkillSelect.appendChild(option);
        });

        bossActivityNames.forEach(bossName => {
            const option = document.createElement("option");
            option.value = bossName;
            option.textContent = bossName;
            goalNameBossSelect.appendChild(option);
        });
    }

    // ===================================
    // --- Event Listener for Goal Type Change ---
    // ===================================
    goalTypeInput.addEventListener("change", () => {
        if (goalTypeInput.value === "skill") {
            goalNameSkillContainer.classList.remove("hidden-dropdown");
            goalNameBossContainer.classList.add("hidden-dropdown");
        } else if (goalTypeInput.value === "boss") {
            goalNameSkillContainer.classList.add("hidden-dropdown");
            goalNameBossContainer.classList.remove("hidden-dropdown");
        } else if (goalTypeInput.value === "xp") {
            goalNameSkillContainer.classList.remove("hidden-dropdown");
            goalNameBossContainer.classList.add("hidden-dropdown");
        }
    });

    // ===================================
    // --- GOAL FUNCTIONS ---
    // ===================================

    function loadGoals() {
        const savedGoals = localStorage.getItem("osrsGoals");
        if (savedGoals) {
            try { goals = JSON.parse(savedGoals) || []; }
            catch (e) { console.error("Error parsing goals:", e); goals = []; }
        } else { goals = []; }
        renderGoals();
    }

    function saveGoals() {
        try { localStorage.setItem("osrsGoals", JSON.stringify(goals)); }
        catch (e) { console.error("Error saving goals:", e); }
    }

    function renderGoals() {
        goalsListContainer.innerHTML = "";

        if (!Array.isArray(goals) || goals.length === 0) {
            goalsListContainer.innerHTML = "<p>No active goals. Add one above!</p>";
            return;
        }

        goals.forEach((goal, index) => {
            if (!goal || typeof goal !== 'object' || !goal.name || !goal.type || typeof goal.target !== 'number') {
                console.warn(`Skipping invalid goal structure at index ${index}:`, goal); return;
            }

            let currentLevel = 0, currentXp = 0, startXp = 0, targetXp = 0;
            let goalNameStandard = goal.name.toLowerCase().trim().replace(/\s+/g, ' ');

            try {
                if (goal.type === "skill") {
                    let skillFound = false;
                    if (hiscoresData.skills) {
                        for (const skillKey in hiscoresData.skills) {
                            if (skillKey.toLowerCase().trim().replace(/\s+/g, ' ') === goalNameStandard) {
                                currentLevel = hiscoresData.skills[skillKey]?.level ?? 0;
                                currentXp = hiscoresData.skills[skillKey]?.xp ?? 0;
                                skillFound = true; break;
                            }
                        }
                    }
                    targetXp = getXpForLevel(goal.target);
                    startXp = getXpForLevel(goal.target - 1);
                } else if (goal.type === "boss") {
                    if (hiscoresData.bosses) {
                        for (const bossKey in hiscoresData.bosses) {
                            if (bossKey.toLowerCase().trim().replace(/\s+/g, ' ') === goalNameStandard) {
                                currentLevel = hiscoresData.bosses[bossKey]?.kc ?? 0; break;
                            }
                        }
                    }
                    currentXp = currentLevel; startXp = 0; targetXp = goal.target;
                }
            } catch (e) { console.error("Error processing goal data:", e, "Goal:", goal); return; }

            let progressPercent = 0;
            const range = targetXp - startXp;
            const currentVal = (goal.type === 'skill') ? currentXp : currentLevel;
            const targetVal = goal.target;

            if (typeof currentVal === 'number' && typeof targetVal === 'number' && typeof startXp === 'number' && typeof targetXp === 'number') {
                if (range > 0) {
                    const currentProgressInRange = Math.max(0, currentXp - startXp);
                    progressPercent = (currentProgressInRange / range) * 100;
                    progressPercent = Math.max(0, Math.min(100, progressPercent));
                } else if ((goal.type === 'skill' && currentLevel >= targetVal) || (goal.type === 'boss' && currentLevel >= targetVal)) {
                    progressPercent = 100;
                }
                if (isNaN(progressPercent)) progressPercent = 0;
            } else { progressPercent = 0; }

            const goalElement = document.createElement("div");
            goalElement.className = "goal";
            const isCompleted = (goal.type === 'skill' && currentLevel >= goal.target) || (goal.type === 'boss' && currentLevel >= goal.target);
            if (isCompleted) {
                goalElement.classList.add("completed");
                progressPercent = 100;
            }

            const goalText = document.createElement("span");
            if (goal.type === 'skill') {
                const xpString = (typeof currentXp === 'number' && currentXp >= 0) ? currentXp.toLocaleString() : 'N/A';
                goalText.innerHTML = `<strong>${goal.name}</strong> Lvl: ${currentLevel} / ${goal.target} <em>(XP: ${xpString})</em>`;
            } else {
                goalText.innerHTML = `<strong>${goal.name}</strong> KC: ${currentLevel.toLocaleString()} / ${goal.target.toLocaleString()}`;
            }

            const progressBarContainer = document.createElement("div");
            progressBarContainer.className = "progress-bar-container";
            const progressBarFill = document.createElement("div");
            progressBarFill.className = "progress-bar-fill";
            progressBarFill.style.width = `${Math.max(0, Math.min(100, progressPercent || 0))}%`;
            progressBarContainer.appendChild(progressBarFill);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.setAttribute("data-index", index);

            const infoAndBar = document.createElement('div');
            infoAndBar.style.flexGrow = '1';
            infoAndBar.appendChild(goalText);
            infoAndBar.appendChild(progressBarContainer);

            goalElement.appendChild(infoAndBar);
            goalElement.appendChild(deleteButton);
            goalsListContainer.appendChild(goalElement);
        });
    }

    addGoalButton.addEventListener("click", () => {
        const type = goalTypeInput.value;
        let name = "";
        const target = parseInt(goalTargetInput.value);

        if (type === "skill") { 
            name = goalNameSkillSelect.value;
            if (!name || !target || target <= 0 || target > 99) {
                alert("Please select a skill and enter a valid target (1-99).");
                return;
            }
        } else if (type === "boss") { 
            name = goalNameBossSelect.value;
            if (!name || !target || target <= 0) {
                alert("Please select a boss and enter a valid target (greater than 0).");
                return;
            }
        } else if (type === "xp") {
            name = goalNameSkillSelect.value;
            if (!name || !target || target <= 0) {
                alert("Please select a skill and enter a valid XP target.");
                return;
            }
        } else {
            alert("Please select a goal type.");
            return;
        }

        goals.push({ type: type, name: name, target: target });

        goalTargetInput.value = "";
        saveGoals();
        renderGoals();
    });

    goalsListContainer.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") {
            const goalIndex = parseInt(event.target.getAttribute("data-index"));
             if (!isNaN(goalIndex) && goalIndex >= 0 && goalIndex < goals.length) {
                goals.splice(goalIndex, 1);
                saveGoals();
                renderGoals();
            } else { console.error("Invalid index for goal deletion:", event.target.getAttribute("data-index")); }
        }
    });

    // ===================================
    // --- HISCORES LOAD FUNCTION (RuneLite Panel Layout) ---
    // ===================================
    loadButton.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        const formattedUsername = username.replace(/ /g, "+");
        const accountType = accountTypeSelect.value;

        if (!username) { alert("Please enter a character name."); return; }

        // Use the specific grid container IDs
        const skillsGridContainer = document.getElementById("skills-grid-container");
        const activitiesGridContainer = document.getElementById("activities-grid-container");

        hiscoresData = { skills: {}, bosses: {} }; // Reset data
        skillsGridContainer.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">Loading skills...</p>`;
        activitiesGridContainer.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">Loading activities...</p>`;
        renderGoals(); // Render goals initially (will show 0 progress)

        let hiscoreBoard = "";
        switch (accountType) {
            case "ironman": hiscoreBoard = "hiscore_oldschool_ironman"; break;
            case "hardcore_ironman": hiscoreBoard = "hiscore_oldschool_hardcore_ironman"; break;
            case "ultimate_ironman": hiscoreBoard = "hiscore_oldschool_ultimate_ironman"; break;
            case "normal": default: hiscoreBoard = "hiscore_oldschool"; break;
        }

        const jagexApiUrl = `https://secure.runescape.com/m=${hiscoreBoard}/index_lite.json?player=${formattedUsername}`;
        
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(jagexApiUrl)}`;
        fetch(proxyUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {

                if (!data || (Object.keys(data).length === 0 && data.constructor === Object)) { throw new Error(`Error: Received empty data for "${username}" on ${accountType} hiscores.`); }
                if (data.error) { throw new Error(`Error from OSRS Hiscores: ${data.error}`); }

                hiscoresData = { skills: {}, bosses: {} }; // Reset before populating

                // --- 1. Process Skills (RuneLite Grid Layout) ---
                skillsGridContainer.innerHTML = ""; // Clear loading message
                let overallData = null;

                const skillOrder = [ // RuneLite Hiscores Panel Order
                    "Attack", "Hitpoints", "Mining",
                    "Strength", "Agility", "Smithing",
                    "Defence", "Herblore", "Fishing",
                    "Ranged", "Thieving", "Cooking",
                    "Prayer", "Crafting", "Firemaking",
                    "Magic", "Fletching", "Woodcutting",
                    "Runecraft", "Slayer", "Farming",
                    "Construction", "Hunter"
                ];

                if (data.skills && Array.isArray(data.skills)) {
                     data.skills.forEach(skill => {
                         if (skill && skill.name && typeof skill.level !== 'undefined' && skill.level >= 0) {
                              hiscoresData.skills[skill.name] = { rank: skill.rank, level: skill.level, xp: skill.xp >= 0 ? skill.xp : 0 };
                              if(skill.name === "Overall") { overallData = hiscoresData.skills[skill.name]; }
                         }
                     });

                     if (overallData) {
                         // Overall Item
                         const overallGridItem = document.createElement("div");
                         overallGridItem.className = "grid-item overall-item";
                         overallGridItem.title = "Overall";
                         overallGridItem.innerHTML = `
                             <img src="${skillIconUrls['Overall'] || ''}" alt="Overall" class="grid-item-icon" loading="lazy">
                             <span class="grid-item-value">${overallData.level}</span>`;
                         skillsGridContainer.appendChild(overallGridItem);

                         // Total XP Item
                         const xpGridItem = document.createElement("div");
                         xpGridItem.className = "grid-item total-xp-item";
                         xpGridItem.title = "Total XP";
                         xpGridItem.innerHTML = `
                             <img src="${skillIconUrls['Overall'] || ''}" alt="Total XP" class="grid-item-icon" style="opacity: 0.6;" loading="lazy">
                             <span class="grid-item-value">${(overallData.xp >= 0 ? overallData.xp.toLocaleString() : 'N/A')}</span>`;
                         skillsGridContainer.appendChild(xpGridItem);
                     } else {
                          skillsGridContainer.appendChild(document.createElement('div')); // Placeholder 1
                          skillsGridContainer.appendChild(document.createElement('div')); // Placeholder 2
                     }
                      // Add empty div for the 3rd column of the first row if needed
                     skillsGridContainer.appendChild(document.createElement('div'));


                     skillOrder.forEach(skillName => {
                         const skill = hiscoresData.skills[skillName];
                         if (skill) {
                            const gridItem = document.createElement("div");
                            gridItem.className = "grid-item clickable-skill";
                            gridItem.title = `${skillName} - XP: ${skill.xp.toLocaleString()}`;
                            gridItem.setAttribute('data-skill-name', skillName);
                            gridItem.style.cursor = 'pointer';

                            const iconUrl = skillIconUrls[skillName];
                            const iconImg = document.createElement('img');
                            iconImg.src = iconUrl || '';
                            iconImg.alt = skillName;
                            iconImg.className = 'grid-item-icon';
                            iconImg.loading = 'lazy';

                            const valueSpan = document.createElement('span');
                            valueSpan.className = 'grid-item-value';
                            valueSpan.textContent = skill.level;

                            gridItem.appendChild(iconImg);
                            gridItem.appendChild(valueSpan);
                            
                            // Add click handler for skill details
                            gridItem.addEventListener('click', () => {
                                showSkillDetails(skillName, skill);
                            });
                            
                            skillsGridContainer.appendChild(gridItem);
                         } else {
                             skillsGridContainer.appendChild(document.createElement('div')); // Placeholder if skill missing
                         }
                     });

                } else {
                    skillsGridContainer.innerHTML = "<p style='color: red; grid-column: 1 / -1;'>No skill data found.</p>";
                }


                // --- 2. Process Boss Kills & Activities (RuneLite Grid Layout) ---
                activitiesGridContainer.innerHTML = ""; // Clear loading message
                let foundActivityData = false;
                const activityMap = new Map();
                if (data.activities && Array.isArray(data.activities)) {
                    data.activities.forEach(act => { if (act && act.name) activityMap.set(act.name, act); });
                    foundActivityData = true;
                }

                // Iterate through known bosses first
                bossActivityNames.forEach(bossName => {
                    const activity = activityMap.get(bossName);
                    let score = -1, rank = -1;
                    let scoreDisplay = "--";

                    if (activity && typeof activity.score !== 'undefined') {
                        score = activity.score; rank = activity.rank;
                        if (score >= 0) { scoreDisplay = score.toLocaleString(); }
                    }

                    hiscoresData.bosses[bossName] = { rank: rank, kc: Math.max(0, score) };

                    const gridItem = document.createElement("div");
                    gridItem.className = "grid-item clickable-boss";
                    gridItem.title = bossName;
                    gridItem.setAttribute('data-boss-name', bossName);
                    gridItem.style.cursor = 'pointer';

        const iconUrl = bossIconUrls[bossName];
        const iconImg = document.createElement('img');
        // Try multiple fallback URLs
        const fallbackUrls = [
            iconUrl,
            `https://oldschool.runescape.wiki/images/thumb/${bossName.replace(/'/g, '%27').replace(/\s+/g, '_')}.png/130px-${bossName.replace(/'/g, '%27').replace(/\s+/g, '_')}.png`,
            `https://oldschool.runescape.wiki/images/${bossName.replace(/'/g, '%27').replace(/\s+/g, '_')}_icon.png`,
            'https://oldschool.runescape.wiki/images/thumb/Combat_achievements.png/130px-Combat_achievements.png'
        ];
        iconImg.src = iconUrl || fallbackUrls[1];
        iconImg.alt = bossName;
        iconImg.className = 'grid-item-icon';
        iconImg.loading = 'lazy';
        let fallbackIndex = 1;
        iconImg.onerror = function() {
            if (fallbackIndex < fallbackUrls.length) {
                this.src = fallbackUrls[fallbackIndex++];
            } else {
                this.src = 'https://oldschool.runescape.wiki/images/thumb/Combat_achievements.png/130px-Combat_achievements.png';
            }
        };

                    const nameSpan = document.createElement('span');
                    nameSpan.className = 'grid-item-name';
                    nameSpan.textContent = bossName;

                    const valueSpan = document.createElement('span');
                    valueSpan.className = 'grid-item-value';
                    valueSpan.textContent = scoreDisplay;
                    if(scoreDisplay === "--") { valueSpan.classList.add('unranked'); }

                    gridItem.appendChild(iconImg);
                    gridItem.appendChild(nameSpan);
                    gridItem.appendChild(valueSpan);
                    
                    // Add click handler for boss details
                    gridItem.addEventListener('click', () => {
                        showBossDetails(bossName, hiscoresData.bosses[bossName]);
                    });
                    
                    activitiesGridContainer.appendChild(gridItem); // Append to activities grid
                });

                 // Add placeholders if needed to fill the grid
                 const bossCount = bossActivityNames.length;
                 const placeholdersNeeded = (3 - (bossCount % 3)) % 3;
                 for(let i = 0; i < placeholdersNeeded; i++) {
                     activitiesGridContainer.appendChild(document.createElement('div'));
                 }

                if (!foundActivityData) { activitiesGridContainer.innerHTML = "<p style='color: red; grid-column: 1 / -1;'>Could not load activity/boss data.</p>"; }

                // Update Goals
                renderGoals();
                
                // Update Statistics and Overview
                updateStatistics();
                updateSkillProgression();
                updateQuestsAndAchievements();
            })
            .catch(error => {
                console.error("Fetch Error:", error);
                // Display error in the appropriate grid containers
                skillsGridContainer.innerHTML = `<p style="color: red; grid-column: 1 / -1;">${error.message}</p>`;
                activitiesGridContainer.innerHTML = `<p style="color: red; grid-column: 1 / -1;">${error.message}</p>`;
                renderGoals();
            });
    // --- End of loadButton listener ---

    // ===================================
    // --- MANUAL QUEST TRACKING ---
    // ===================================
    const questListInput = document.getElementById('quest-list-input');
    const saveQuestsButton = document.getElementById('save-quests-button');
    const questListOutput = document.getElementById('quest-list-output');

    function loadQuests() {
        const savedQuests = localStorage.getItem('osrsQuests');
        if (savedQuests) {
            questListInput.value = savedQuests;
            updateQuestOutput(savedQuests);
        }
    }

    function saveQuests() {
        const quests = questListInput.value;
        localStorage.setItem('osrsQuests', quests);
        updateQuestOutput(quests);
        alert('Quest list saved!');
    }

    function updateQuestOutput(quests) {
        questListOutput.innerHTML = '';
        const questArray = quests.split('\n').filter(q => q.trim() !== '');
        questArray.forEach(quest => {
            const li = document.createElement('li');
            li.textContent = quest;
            questListOutput.appendChild(li);
        });
    }

    saveQuestsButton.addEventListener('click', saveQuests);

    loadQuests();
});

    // ===================================
    // --- TAB NAVIGATION ---
    // ===================================
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
            
            // Initialize map if map tab is opened
            if (targetTab === 'map' && !osrsMap) {
                initializeMap();
            }
        });
    });

    // ===================================
    // --- INTERACTIVE MAP ---
    // ===================================
    let osrsMap = null;
    let mapMarkers = {
        bosses: [],
        slayerMasters: [],
        npcs: [],
        quests: []
    };

    // OSRS Map Locations (approximate coordinates for Gielinor)
    const mapLocations = {
        bosses: [
            { name: "Abyssal Sire", coords: [3100, 2600], type: "boss" },
            { name: "Alchemical Hydra", coords: [1360, 10260], type: "boss" },
            { name: "Artio", coords: [1730, 10000], type: "boss" },
            { name: "Barrows", coords: [3565, 3315], type: "boss" },
            { name: "Callisto", coords: [3320, 3840], type: "boss" },
            { name: "Cerberus", coords: [1310, 1250], type: "boss" },
            { name: "Chambers of Xeric", coords: [1230, 3570], type: "raid" },
            { name: "Chaos Elemental", coords: [3280, 3920], type: "boss" },
            { name: "Commander Zilyana", coords: [2910, 5300], type: "boss" },
            { name: "Corporeal Beast", coords: [2965, 4380], type: "boss" },
            { name: "Dagannoth Kings", coords: [2540, 10150], type: "boss" },
            { name: "Duke Sucellus", coords: [3740, 10220], type: "boss" },
            { name: "General Graardor", coords: [2860, 5360], type: "boss" },
            { name: "Giant Mole", coords: [1760, 5180], type: "boss" },
            { name: "Grotesque Guardians", coords: [3430, 3540], type: "boss" },
            { name: "Kalphite Queen", coords: [3480, 9510], type: "boss" },
            { name: "King Black Dragon", coords: [2270, 4700], type: "boss" },
            { name: "Kraken", coords: [2280, 10020], type: "boss" },
            { name: "Kree'Arra", coords: [2540, 2870], type: "boss" },
            { name: "K'ril Tsutsaroth", coords: [2920, 5330], type: "boss" },
            { name: "Nex", coords: [2900, 5200], type: "boss" },
            { name: "Nightmare", coords: [3800, 9760], type: "boss" },
            { name: "Phantom Muspah", coords: [2540, 10150], type: "boss" },
            { name: "Sarachnis", coords: [1840, 4630], type: "boss" },
            { name: "Scorpia", coords: [3230, 3940], type: "boss" },
            { name: "Scurrius", coords: [3230, 10280], type: "boss" },
            { name: "Skotizo", coords: [3400, 3550], type: "boss" },
            { name: "Tempoross", coords: [1780, 3600], type: "minigame" },
            { name: "The Gauntlet", coords: [1230, 3570], type: "raid" },
            { name: "The Leviathan", coords: [3740, 10220], type: "boss" },
            { name: "The Whisperer", coords: [3740, 10220], type: "boss" },
            { name: "Theatre of Blood", coords: [3670, 3210], type: "raid" },
            { name: "Thermonuclear Smoke Devil", coords: [2400, 9440], type: "boss" },
            { name: "Tombs of Amascut", coords: [3350, 9120], type: "raid" },
            { name: "TzKal-Zuk", coords: [2440, 5170], type: "boss" },
            { name: "TzTok-Jad", coords: [2440, 5170], type: "boss" },
            { name: "Vardorvis", coords: [3740, 10220], type: "boss" },
            { name: "Venenatis", coords: [3300, 3750], type: "boss" },
            { name: "Vet'ion", coords: [3220, 3780], type: "boss" },
            { name: "Vorkath", coords: [2270, 4050], type: "boss" },
            { name: "Wintertodt", coords: [1630, 3940], type: "minigame" },
            { name: "Zalcano", coords: [1230, 3570], type: "boss" },
            { name: "Zulrah", coords: [2200, 3050], type: "boss" }
        ],
        slayerMasters: [
            { name: "Turael", coords: [2930, 3530], type: "slayer" },
            { name: "Spria", coords: [2930, 3530], type: "slayer" },
            { name: "Krystilia", coords: [3090, 3500], type: "slayer" },
            { name: "Mazchna", coords: [3510, 3500], type: "slayer" },
            { name: "Vannaka", coords: [3140, 9910], type: "slayer" },
            { name: "Chaeldar", coords: [2440, 4430], type: "slayer" },
            { name: "Nieve", coords: [2430, 3420], type: "slayer" },
            { name: "Steve", coords: [2430, 3420], type: "slayer" },
            { name: "Duradel", coords: [2870, 2980], type: "slayer" },
            { name: "Konar", coords: [1310, 3790], type: "slayer" }
        ],
        npcs: [
            { name: "Wise Old Man", coords: [3088, 3250], type: "npc" },
            { name: "Hans", coords: [3210, 3210], type: "npc" },
            { name: "Banker", coords: [3090, 3240], type: "npc" }
        ]
    };

    // OSRS Coordinate Conversion Functions
    // OSRS uses X (east), Y (north), Z (plane) coordinate system
    // Leaflet uses [lat, lng] where lat is Y and lng is X
    function osrsToLeaflet(x, y, z = 0) {
        // OSRS coordinates: X (0-6400 east), Y (0-6400 north), Z (0-3 plane)
        // Convert to Leaflet [lat, lng] format
        // For OSRS, we'll use a simple linear mapping
        // Center of OSRS map is approximately (3200, 3200)
        const lat = y; // Y becomes latitude (north-south)
        const lng = x; // X becomes longitude (east-west)
        return [lat, lng];
    }

    function initializeMap() {
        if (osrsMap) return; // Already initialized
        
        // Check if Leaflet is loaded
        if (typeof L === 'undefined') {
            console.error('Leaflet library not loaded');
            return;
        }
        
        // OSRS map bounds: approximately 0-6400 in both X and Y
        // Center view at Lumbridge area (3200, 3200)
        const centerCoords = osrsToLeaflet(3200, 3200);
        osrsMap = L.map('osrs-map', {
            crs: L.CRS.Simple, // Use simple CRS for custom coordinate system
            minZoom: 0,
            maxZoom: 4
        }).setView(centerCoords, 1);
        
        // Create custom coordinate bounds for OSRS map
        const southWest = osrsToLeaflet(0, 0);
        const northEast = osrsToLeaflet(6400, 6400);
        osrsMap.setMaxBounds([southWest, northEast]);
        
        // Add OSRS world map tile layer
        L.tileLayer('https://maps.runescape.wiki/osrs/2020-02-10/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; Jagex',
            noWrap: true,
            bounds: mapBounds
        }).addTo(osrsMap);
        
        // Add region labels for better orientation
        const regions = [
            { name: 'Lumbridge', coords: osrsToLeaflet(3200, 3200) },
            { name: 'Varrock', coords: osrsToLeaflet(3200, 3400) },
            { name: 'Falador', coords: osrsToLeaflet(3000, 3300) },
            { name: 'Edgeville', coords: osrsToLeaflet(3100, 3500) }
        ];
        
        regions.forEach(region => {
            L.marker(region.coords, {
                icon: L.divIcon({
                    className: 'region-label',
                    html: `<div style="color: #f59e0b; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">${region.name}</div>`,
                    iconSize: [100, 20]
                })
            }).addTo(osrsMap);
        });
        
        // Add markers for different location types
        addMapMarkers();
        updateMapLegend();
        
        // Add filter event listeners
        document.getElementById('show-bosses').addEventListener('change', toggleMapMarkers);
        document.getElementById('show-slayer-masters').addEventListener('change', toggleMapMarkers);
        document.getElementById('show-npcs').addEventListener('change', toggleMapMarkers);
        document.getElementById('show-quests').addEventListener('change', toggleMapMarkers);
        document.getElementById('reset-map-view').addEventListener('click', () => {
            osrsMap.setView(centerCoords, 1);
        });
    }

    function addMapMarkers() {
        // Add boss markers with correct coordinate conversion
        mapLocations.bosses.forEach(loc => {
            const [x, y, z = 0] = loc.coords;
            const leafletCoords = osrsToLeaflet(x, y, z);
            const marker = L.marker(leafletCoords, {
                icon: L.divIcon({
                    className: 'boss-marker',
                    html: '<div style="background-color: #ef4444; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(239, 68, 68, 0.8);"></div>',
                    iconSize: [14, 14],
                    iconAnchor: [7, 7]
                })
            }).addTo(osrsMap);
            marker.bindPopup(`<b>${loc.name}</b><br>Type: ${loc.type}<br>Coordinates: ${x}, ${y}${z > 0 ? `, Plane ${z}` : ''}`);
            mapMarkers.bosses.push(marker);
        });

        // Add slayer master markers
        mapLocations.slayerMasters.forEach(loc => {
            const [x, y, z = 0] = loc.coords;
            const leafletCoords = osrsToLeaflet(x, y, z);
            const marker = L.marker(leafletCoords, {
                icon: L.divIcon({
                    className: 'slayer-master-icon',
                    html: '<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(59, 130, 246, 0.8);"></div>',
                    iconSize: [12, 12],
                    iconAnchor: [6, 6]
                })
            }).addTo(osrsMap);
            marker.bindPopup(`<b>${loc.name}</b><br>Slayer Master<br>Coordinates: ${x}, ${y}${z > 0 ? `, Plane ${z}` : ''}`);
            mapMarkers.slayerMasters.push(marker);
        });

        // Add NPC markers
        mapLocations.npcs.forEach(loc => {
            const [x, y, z = 0] = loc.coords;
            const leafletCoords = osrsToLeaflet(x, y, z);
            const marker = L.marker(leafletCoords, {
                icon: L.divIcon({
                    className: 'npc-icon',
                    html: '<div style="background-color: #22c55e; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(34, 197, 94, 0.8);"></div>',
                    iconSize: [10, 10],
                    iconAnchor: [5, 5]
                })
            }).addTo(osrsMap);
            marker.bindPopup(`<b>${loc.name}</b><br>NPC<br>Coordinates: ${x}, ${y}${z > 0 ? `, Plane ${z}` : ''}`);
            mapMarkers.npcs.push(marker);
        });
    }

    function toggleMapMarkers() {
        const showBosses = document.getElementById('show-bosses').checked;
        const showSlayer = document.getElementById('show-slayer-masters').checked;
        const showNpcs = document.getElementById('show-npcs').checked;
        const showQuests = document.getElementById('show-quests').checked;

        mapMarkers.bosses.forEach(m => showBosses ? m.addTo(osrsMap) : osrsMap.removeLayer(m));
        mapMarkers.slayerMasters.forEach(m => showSlayer ? m.addTo(osrsMap) : osrsMap.removeLayer(m));
        mapMarkers.npcs.forEach(m => showNpcs ? m.addTo(osrsMap) : osrsMap.removeLayer(m));
    }

    function updateMapLegend() {
        const legend = document.getElementById('map-legend');
        legend.innerHTML = `
            <div class="legend-item">
                <div class="legend-color" style="background-color: #ef4444;"></div>
                <span>Bosses</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background-color: #3b82f6;"></div>
                <span>Slayer Masters</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background-color: #22c55e;"></div>
                <span>NPCs</span>
            </div>
        `;
    }

    // Map will be initialized when needed

    // ===================================
    // --- STATISTICS & CHARTS ---
    // ===================================
    let xpChart = null;
    let levelChart = null;

    function updateStatistics() {
        if (!hiscoresData || !hiscoresData.skills) return;

        updateOverviewStats();
        updateTopSkills();
        updateTopBosses();
        updateXpToLevel();
        updateAccountSummary();
        createCharts();
    }

    function updateOverviewStats() {
        let totalLevel = 0;
        let totalXp = 0;
        let maxedSkills = 0;
        const combatSkills = ['Attack', 'Strength', 'Defence', 'Hitpoints', 'Ranged', 'Prayer', 'Magic'];

        Object.values(hiscoresData.skills).forEach(skill => {
            if (skill.name !== 'Overall') {
                totalLevel += skill.level || 0;
                totalXp += skill.xp || 0;
                if (skill.level >= 99) maxedSkills++;
            }
        });

        const overall = hiscoresData.skills['Overall'];
        if (overall) {
            totalLevel = overall.level;
            totalXp = overall.xp;
        }

        document.getElementById('total-level').textContent = totalLevel.toLocaleString();
        document.getElementById('total-xp').textContent = totalXp.toLocaleString();
        document.getElementById('maxed-skills').textContent = `${maxedSkills}/23`;

        // Calculate combat level
        const attack = hiscoresData.skills['Attack']?.level || 1;
        const strength = hiscoresData.skills['Strength']?.level || 1;
        const defence = hiscoresData.skills['Defence']?.level || 1;
        const hitpoints = hiscoresData.skills['Hitpoints']?.level || 10;
        const ranged = hiscoresData.skills['Ranged']?.level || 1;
        const prayer = hiscoresData.skills['Prayer']?.level || 1;
        const magic = hiscoresData.skills['Magic']?.level || 1;

        const base = 0.25 * (defence + hitpoints + Math.floor(prayer / 2));
        const melee = 0.325 * (attack + strength);
        const range = 0.325 * (Math.floor(ranged / 2) + ranged);
        const mage = 0.325 * (Math.floor(magic / 2) + magic);
        const combatLevel = Math.floor(base + Math.max(melee, range, mage));

        document.getElementById('combat-level').textContent = combatLevel;
    }

    function updateTopSkills() {
        const skills = Object.entries(hiscoresData.skills)
            .filter(([name]) => name !== 'Overall')
            .map(([name, data]) => ({ name, xp: data.xp || 0, level: data.level || 0 }))
            .sort((a, b) => b.xp - a.xp)
            .slice(0, 10);

        const list = document.getElementById('top-skills-list');
        list.innerHTML = '';
        skills.forEach(skill => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span><strong>${skill.name}</strong> - Lvl ${skill.level}</span>
                <span>${skill.xp.toLocaleString()} XP</span>
            `;
            list.appendChild(li);
        });
    }

    function updateTopBosses() {
        const bosses = Object.entries(hiscoresData.bosses || {})
            .map(([name, data]) => ({ name, kc: data.kc || 0 }))
            .sort((a, b) => b.kc - a.kc)
            .slice(0, 10);

        const list = document.getElementById('top-bosses-list');
        list.innerHTML = '';
        bosses.forEach(boss => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span><strong>${boss.name}</strong></span>
                <span>${boss.kc.toLocaleString()} KC</span>
            `;
            list.appendChild(li);
        });
    }

    function updateXpToLevel() {
        const skills = Object.entries(hiscoresData.skills)
            .filter(([name]) => name !== 'Overall')
            .map(([name, data]) => {
                const currentLevel = data.level || 1;
                const currentXp = data.xp || 0;
                const nextLevel = Math.min(currentLevel + 1, 99);
                const xpForNext = getXpForLevel(nextLevel);
                const xpNeeded = Math.max(0, xpForNext - currentXp);
                return { name, currentLevel, xpNeeded, nextLevel };
            })
            .filter(s => s.xpNeeded > 0 && s.currentLevel < 99)
            .sort((a, b) => a.xpNeeded - b.xpNeeded)
            .slice(0, 10);

        const list = document.getElementById('xp-to-level-list');
        list.innerHTML = '';
        if (skills.length === 0) {
            list.innerHTML = '<li>All skills are maxed!</li>';
            return;
        }
        skills.forEach(skill => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span><strong>${skill.name}</strong> (${skill.currentLevel} → ${skill.nextLevel})</span>
                <span>${skill.xpNeeded.toLocaleString()} XP</span>
            `;
            list.appendChild(li);
        });
    }

    function updateAccountSummary() {
        const skills = hiscoresData.skills;
        const summary = document.getElementById('account-summary');
        
        const total99s = Object.values(skills).filter(s => s.name !== 'Overall' && s.level >= 99).length;
        const totalBossKc = Object.values(hiscoresData.bosses || {}).reduce((sum, b) => sum + (b.kc || 0), 0);
        const avgLevel = Object.values(skills)
            .filter(s => s.name !== 'Overall')
            .reduce((sum, s) => sum + (s.level || 0), 0) / 23;

        summary.innerHTML = `
            <div><strong>Total 99s</strong>${total99s}/23</div>
            <div><strong>Average Level</strong>${Math.floor(avgLevel)}</div>
            <div><strong>Total Boss KC</strong>${totalBossKc.toLocaleString()}</div>
            <div><strong>Skills at 90+</strong>${Object.values(skills).filter(s => s.name !== 'Overall' && s.level >= 90).length}</div>
        `;
    }

    function createCharts() {
        // XP Distribution Chart
        const xpCtx = document.getElementById('xp-chart');
        if (xpChart) xpChart.destroy();
        
        const skillNames = Object.keys(hiscoresData.skills).filter(n => n !== 'Overall');
        const xpData = skillNames.map(name => hiscoresData.skills[name]?.xp || 0);
        
        xpChart = new Chart(xpCtx, {
            type: 'bar',
            data: {
                labels: skillNames,
                datasets: [{
                    label: 'XP',
                    data: xpData,
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y.toLocaleString() + ' XP';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#e0e0e0' },
                        grid: { color: '#383838' }
                    },
                    x: {
                        ticks: { color: '#e0e0e0', maxRotation: 45, minRotation: 45 },
                        grid: { color: '#383838' }
                    }
                }
            }
        });

        // Level Distribution Chart
        const levelCtx = document.getElementById('level-chart');
        if (levelChart) levelChart.destroy();
        
        const levelData = skillNames.map(name => hiscoresData.skills[name]?.level || 0);
        
        levelChart = new Chart(levelCtx, {
            type: 'line',
            data: {
                labels: skillNames,
                datasets: [{
                    label: 'Level',
                    data: levelData,
                    borderColor: 'rgba(245, 158, 11, 1)',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Level ' + context.parsed.y;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 99,
                        ticks: { color: '#e0e0e0' },
                        grid: { color: '#383838' }
                    },
                    x: {
                        ticks: { color: '#e0e0e0', maxRotation: 45, minRotation: 45 },
                        grid: { color: '#383838' }
                    }
                }
            }
        });
    }

    // ===================================
    // --- SEARCH & FILTER ---
    // ===================================
    const skillSearch = document.getElementById('skill-search');
    const skillFilter = document.getElementById('skill-filter');
    const bossSearch = document.getElementById('boss-search');
    const bossFilter = document.getElementById('boss-filter');

    const skillCategories = {
        combat: ['Attack', 'Strength', 'Defence', 'Hitpoints', 'Ranged', 'Prayer', 'Magic'],
        gathering: ['Mining', 'Fishing', 'Woodcutting', 'Hunter', 'Farming'],
        artisan: ['Smithing', 'Crafting', 'Cooking', 'Fletching', 'Runecraft', 'Construction', 'Herblore'],
        support: ['Agility', 'Thieving', 'Slayer']
    };

    function filterSkills() {
        const searchTerm = skillSearch.value.toLowerCase();
        const category = skillFilter.value;
        const gridItems = document.querySelectorAll('#skills-grid-container .grid-item');
        
        gridItems.forEach(item => {
            const skillName = item.title?.toLowerCase() || '';
            const matchesSearch = !searchTerm || skillName.includes(searchTerm);
            const matchesCategory = category === 'all' || 
                (category === 'combat' && skillCategories.combat.some(s => skillName.includes(s.toLowerCase()))) ||
                (category === 'gathering' && skillCategories.gathering.some(s => skillName.includes(s.toLowerCase()))) ||
                (category === 'artisan' && skillCategories.artisan.some(s => skillName.includes(s.toLowerCase()))) ||
                (category === 'support' && skillCategories.support.some(s => skillName.includes(s.toLowerCase())));
            
            item.style.display = (matchesSearch && matchesCategory) ? '' : 'none';
        });
    }

    function filterBosses() {
        const searchTerm = bossSearch.value.toLowerCase();
        const filter = bossFilter.value;
        const gridItems = document.querySelectorAll('#activities-grid-container .grid-item');
        
        gridItems.forEach(item => {
            const bossName = item.title?.toLowerCase() || '';
            const matchesSearch = !searchTerm || bossName.includes(searchTerm);
            let matchesFilter = true;
            
            if (filter === 'boss') {
                matchesFilter = !bossName.includes('tempoross') && !bossName.includes('wintertodt') && 
                               !bossName.includes('chambers') && !bossName.includes('theatre') && 
                               !bossName.includes('tombs') && !bossName.includes('gauntlet');
            } else if (filter === 'minigame') {
                matchesFilter = bossName.includes('tempoross') || bossName.includes('wintertodt');
            } else if (filter === 'raid') {
                matchesFilter = bossName.includes('chambers') || bossName.includes('theatre') || 
                               bossName.includes('tombs') || bossName.includes('gauntlet');
            }
            
            item.style.display = (matchesSearch && matchesFilter) ? '' : 'none';
        });
    }

    if (skillSearch) skillSearch.addEventListener('input', filterSkills);
    if (skillFilter) skillFilter.addEventListener('change', filterSkills);
    if (bossSearch) bossSearch.addEventListener('input', filterBosses);
    if (bossFilter) bossFilter.addEventListener('change', filterBosses);

    // ===================================
    // --- QUESTS & ACHIEVEMENTS DATA ---
    // ===================================
    const achievementDiaries = {
        "Lumbridge & Draynor": {
            easy: { description: "Complete easy tasks in Lumbridge & Draynor area" },
            medium: { description: "Complete medium tasks in Lumbridge & Draynor area" },
            hard: { description: "Complete hard tasks in Lumbridge & Draynor area" },
            elite: { description: "Complete elite tasks in Lumbridge & Draynor area" }
        },
        "Varrock": {
            easy: { description: "Complete easy tasks in Varrock area" },
            medium: { description: "Complete medium tasks in Varrock area" },
            hard: { description: "Complete hard tasks in Varrock area" },
            elite: { description: "Complete elite tasks in Varrock area" }
        },
        "Falador": {
            easy: { description: "Complete easy tasks in Falador area" },
            medium: { description: "Complete medium tasks in Falador area" },
            hard: { description: "Complete hard tasks in Falador area" },
            elite: { description: "Complete elite tasks in Falador area" }
        },
        "Kandarin": {
            easy: { description: "Complete easy tasks in Kandarin area" },
            medium: { description: "Complete medium tasks in Kandarin area" },
            hard: { description: "Complete hard tasks in Kandarin area" },
            elite: { description: "Complete elite tasks in Kandarin area" }
        },
        "Desert": {
            easy: { description: "Complete easy tasks in Desert area" },
            medium: { description: "Complete medium tasks in Desert area" },
            hard: { description: "Complete hard tasks in Desert area" },
            elite: { description: "Complete elite tasks in Desert area" }
        },
        "Morytania": {
            easy: { description: "Complete easy tasks in Morytania area" },
            medium: { description: "Complete medium tasks in Morytania area" },
            hard: { description: "Complete hard tasks in Morytania area" },
            elite: { description: "Complete elite tasks in Morytania area" }
        },
        "Karamja": {
            easy: { description: "Complete easy tasks in Karamja area" },
            medium: { description: "Complete medium tasks in Karamja area" },
            hard: { description: "Complete hard tasks in Karamja area" },
            elite: { description: "Complete elite tasks in Karamja area" }
        },
        "Ardougne": {
            easy: { description: "Complete easy tasks in Ardougne area" },
            medium: { description: "Complete medium tasks in Ardougne area" },
            hard: { description: "Complete hard tasks in Ardougne area" },
            elite: { description: "Complete elite tasks in Ardougne area" }
        },
        "Western Provinces": {
            easy: { description: "Complete easy tasks in Western Provinces area" },
            medium: { description: "Complete medium tasks in Western Provinces area" },
            hard: { description: "Complete hard tasks in Western Provinces area" },
            elite: { description: "Complete elite tasks in Western Provinces area" }
        },
        "Fremennik": {
            easy: { description: "Complete easy tasks in Fremennik area" },
            medium: { description: "Complete medium tasks in Fremennik area" },
            hard: { description: "Complete hard tasks in Fremennik area" },
            elite: { description: "Complete elite tasks in Fremennik area" }
        },
        "Kourend & Kebos": {
            easy: { description: "Complete easy tasks in Kourend & Kebos area" },
            medium: { description: "Complete medium tasks in Kourend & Kebos area" },
            hard: { description: "Complete hard tasks in Kourend & Kebos area" },
            elite: { description: "Complete elite tasks in Kourend & Kebos area" }
        },
        "Wilderness": {
            easy: { description: "Complete easy tasks in Wilderness area" },
            medium: { description: "Complete medium tasks in Wilderness area" },
            hard: { description: "Complete hard tasks in Wilderness area" },
            elite: { description: "Complete elite tasks in Wilderness area" }
        }
    };

    const combatAchievements = {
        "Easy": { description: "Complete easy combat achievement tasks" },
        "Medium": { description: "Complete medium combat achievement tasks" },
        "Hard": { description: "Complete hard combat achievement tasks" },
        "Elite": { description: "Complete elite combat achievement tasks" },
        "Master": { description: "Complete master combat achievement tasks" },
        "Grandmaster": { description: "Complete grandmaster combat achievement tasks" }
    };

    function updateQuestsAndAchievements() {
        const diariesList = document.getElementById('achievement-diaries-list');
        const combatList = document.getElementById('combat-achievements-list');
        
        if (diariesList) {
            diariesList.innerHTML = '';
            Object.keys(achievementDiaries).forEach(diaryName => {
                const diary = achievementDiaries[diaryName];
                const diaryCard = document.createElement('div');
                diaryCard.className = 'achievement-diary-card';
                diaryCard.innerHTML = `
                    <h4>${diaryName}</h4>
                    <div class="diary-tiers">
                        <div class="diary-tier">
                            <span class="tier-name">Easy</span>
                            <span class="tier-status">Not Available</span>
                        </div>
                        <div class="diary-tier">
                            <span class="tier-name">Medium</span>
                            <span class="tier-status">Not Available</span>
                        </div>
                        <div class="diary-tier">
                            <span class="tier-name">Hard</span>
                            <span class="tier-status">Not Available</span>
                        </div>
                        <div class="diary-tier">
                            <span class="tier-name">Elite</span>
                            <span class="tier-status">Not Available</span>
                        </div>
                    </div>
                    <p class="diary-description">${diary.easy.description}</p>
                `;
                diariesList.appendChild(diaryCard);
            });
        }
        
        if (combatList) {
            combatList.innerHTML = '';
            Object.keys(combatAchievements).forEach(tier => {
                const achievement = combatAchievements[tier];
                const achievementCard = document.createElement('div');
                achievementCard.className = 'combat-achievement-card';
                achievementCard.innerHTML = `
                    <h4>${tier} Tier</h4>
                    <p>${achievement.description}</p>
                    <span class="achievement-status">Not Available</span>
                `;
                combatList.appendChild(achievementCard);
            });
        }
    }

    // ===================================
    // --- OVERVIEW PREVIEW ---
    // ===================================
    function updateSkillProgression() {
        const progressionContainer = document.getElementById('skills-progression-grid');
        if (!progressionContainer || !hiscoresData.skills) return;
        
        progressionContainer.innerHTML = '';
        const skillOrder = skillDropdownNames.sort();
        
        skillOrder.forEach(skillName => {
            const skill = hiscoresData.skills[skillName];
            if (!skill) return;
            
            const currentLevel = skill.level || 1;
            const currentXp = skill.xp || 0;
            const nextLevel = Math.min(currentLevel + 1, 99);
            const xpForCurrent = getXpForLevel(currentLevel);
            const xpForNext = getXpForLevel(nextLevel);
            const xpNeeded = xpForNext - currentXp;
            const xpInLevel = currentXp - xpForCurrent;
            const xpForLevel = xpForNext - xpForCurrent;
            const progressPercent = currentLevel >= 99 ? 100 : (xpInLevel / xpForLevel) * 100;
            
            const progressionItem = document.createElement('div');
            progressionItem.className = 'skill-progression-tile';
            
            const iconUrl = skillIconUrls[skillName];
            const iconHtml = iconUrl ? `<img src="${iconUrl}" alt="${skillName}" class="skill-progression-icon">` : '';
            
            progressionItem.innerHTML = `
                <div class="skill-progression-tile-header">
                    ${iconHtml}
                    <div class="skill-progression-tile-info">
                        <span class="skill-progression-tile-name">${skillName}</span>
                        <span class="skill-progression-tile-level">Lvl ${currentLevel}</span>
                    </div>
                </div>
                <div class="skill-progression-tile-bar-container">
                    <div class="skill-progression-tile-bar-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div class="skill-progression-tile-xp">${currentLevel < 99 ? `${xpNeeded.toLocaleString()} XP` : 'Maxed'}</div>
            `;
            
            progressionContainer.appendChild(progressionItem);
        });
    }



    // Store original renderGoals and enhance it
    const originalRenderGoalsFunction = renderGoals;
    const enhancedRenderGoals = function() {
        goalsListContainer.innerHTML = "";

        if (!Array.isArray(goals) || goals.length === 0) {
            goalsListContainer.innerHTML = "<p>No active goals. Add one above!</p>";
            return;
        }

        goals.forEach((goal, index) => {
            if (!goal || typeof goal !== 'object' || !goal.name || !goal.type || typeof goal.target !== 'number') {
                console.warn(`Skipping invalid goal structure at index ${index}:`, goal);
                return;
            }

            let currentLevel = 0, currentXp = 0, startXp = 0, targetXp = 0;
            let goalNameStandard = goal.name.toLowerCase().trim().replace(/\s+/g, ' ');

            try {
                if (goal.type === "skill") {
                    let skillFound = false;
                    if (hiscoresData.skills) {
                        for (const skillKey in hiscoresData.skills) {
                            if (skillKey.toLowerCase().trim().replace(/\s+/g, ' ') === goalNameStandard) {
                                currentLevel = hiscoresData.skills[skillKey]?.level ?? 0;
                                currentXp = hiscoresData.skills[skillKey]?.xp ?? 0;
                                skillFound = true;
                                break;
                            }
                        }
                    }
                    targetXp = getXpForLevel(goal.target);
                    startXp = getXpForLevel(goal.target - 1);
                } else if (goal.type === "xp") {
                    if (hiscoresData.skills) {
                        for (const skillKey in hiscoresData.skills) {
                            if (skillKey.toLowerCase().trim().replace(/\s+/g, ' ') === goalNameStandard) {
                                currentXp = hiscoresData.skills[skillKey]?.xp ?? 0;
                                break;
                            }
                        }
                    }
                    startXp = currentXp;
                    targetXp = goal.target;
                } else if (goal.type === "boss") {
                    if (hiscoresData.bosses) {
                        for (const bossKey in hiscoresData.bosses) {
                            if (bossKey.toLowerCase().trim().replace(/\s+/g, ' ') === goalNameStandard) {
                                currentLevel = hiscoresData.bosses[bossKey]?.kc ?? 0;
                                break;
                            }
                        }
                    }
                    currentXp = currentLevel;
                    startXp = 0;
                    targetXp = goal.target;
                }
            } catch (e) {
                console.error("Error processing goal data:", e, "Goal:", goal);
                return;
            }

            let progressPercent = 0;
            const range = targetXp - startXp;
            const currentVal = (goal.type === 'skill') ? currentXp : (goal.type === 'xp') ? currentXp : currentLevel;
            const targetVal = goal.target;

            if (typeof currentVal === 'number' && typeof targetVal === 'number' && typeof startXp === 'number' && typeof targetXp === 'number') {
                if (range > 0) {
                    const currentProgressInRange = Math.max(0, currentXp - startXp);
                    progressPercent = (currentProgressInRange / range) * 100;
                    progressPercent = Math.max(0, Math.min(100, progressPercent));
                } else if ((goal.type === 'skill' && currentLevel >= targetVal) || 
                           (goal.type === 'boss' && currentLevel >= targetVal) ||
                           (goal.type === 'xp' && currentXp >= targetVal)) {
                    progressPercent = 100;
                }
                if (isNaN(progressPercent)) progressPercent = 0;
            } else {
                progressPercent = 0;
            }

            const goalElement = document.createElement("div");
            goalElement.className = "goal";
            const isCompleted = (goal.type === 'skill' && currentLevel >= goal.target) || 
                               (goal.type === 'boss' && currentLevel >= goal.target) ||
                               (goal.type === 'xp' && currentXp >= goal.target);
            if (isCompleted) {
                goalElement.classList.add("completed");
                progressPercent = 100;
            }

            const goalText = document.createElement("span");
            if (goal.type === 'skill') {
                const xpString = (typeof currentXp === 'number' && currentXp >= 0) ? currentXp.toLocaleString() : 'N/A';
                goalText.innerHTML = `<strong>${goal.name}</strong> Lvl: ${currentLevel} / ${goal.target} <em>(XP: ${xpString})</em>`;
            } else if (goal.type === 'xp') {
                goalText.innerHTML = `<strong>${goal.name}</strong> XP: ${currentXp.toLocaleString()} / ${goal.target.toLocaleString()}`;
            } else {
                goalText.innerHTML = `<strong>${goal.name}</strong> KC: ${currentLevel.toLocaleString()} / ${goal.target.toLocaleString()}`;
            }

            const progressBarContainer = document.createElement("div");
            progressBarContainer.className = "progress-bar-container";
            const progressBarFill = document.createElement("div");
            progressBarFill.className = "progress-bar-fill";
            progressBarFill.style.width = `${Math.max(0, Math.min(100, progressPercent || 0))}%`;
            progressBarContainer.appendChild(progressBarFill);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.setAttribute("data-index", index);

            const infoAndBar = document.createElement('div');
            infoAndBar.style.flexGrow = '1';
            infoAndBar.appendChild(goalText);
            infoAndBar.appendChild(progressBarContainer);

            goalElement.appendChild(infoAndBar);
            goalElement.appendChild(deleteButton);
            goalsListContainer.appendChild(goalElement);
        });
    };
    
    // Replace renderGoals with enhanced version
    renderGoals = enhancedRenderGoals;

    // ===================================
    // --- INITIAL PAGE LOAD ---
    // ===================================
    populateDropdowns();
    loadGoals();
    goalTypeInput.dispatchEvent(new Event('change'));

}); // End of DOMContentLoaded