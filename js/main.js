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
        "Attack": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/attack.png",
        "Defence": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/defence.png",
        "Strength": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/strength.png",
        "Hitpoints": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/hitpoints.png",
        "Ranged": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/ranged.png",
        "Prayer": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/prayer.png",
        "Magic": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/magic.png",
        "Cooking": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/cooking.png",
        "Woodcutting": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/woodcutting.png",
        "Fletching": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/fletching.png",
        "Fishing": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/fishing.png",
        "Firemaking": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/firemaking.png",
        "Crafting": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/crafting.png",
        "Smithing": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/smithing.png",
        "Mining": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/mining.png",
        "Herblore": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/herblore.png",
        "Agility": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/agility.png",
        "Thieving": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/thieving.png",
        "Slayer": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/slayer.png",
        "Farming": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/farming.png",
        "Runecraft": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/runecraft.png",
        "Hunter": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/hunter.png",
        "Construction": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/construction.png",
        "Overall": "https://raw.githubusercontent.com/runelite/runelite/master/runelite-client/src/main/resources/skill_icons/overall.png"
    };

     const skillDropdownNames = Object.keys(skillIconUrls).filter(name => name !== "Overall").sort();

     const bossIconUrls = {
        "Abyssal Sire": "https://oldschool.runescape.wiki/images/Abyssal_Sire_icon.png",
        "Alchemical Hydra": "https://oldschool.runescape.wiki/images/Alchemical_Hydra_icon.png",
        "Artio": "https://oldschool.runescape.wiki/images/Artio_icon.png",
        "Barrows Chests": "https://oldschool.runescape.wiki/images/Barrows_Chests_icon.png",
        "Bryophyta": "https://oldschool.runescape.wiki/images/Bryophyta_icon.png",
        "Callisto": "https://oldschool.runescape.wiki/images/Callisto_icon.png",
        "Calvar'ion": "https://oldschool.runescape.wiki/images/Calvar%27ion_icon.png",
        "Cerberus": "https://oldschool.runescape.wiki/images/Cerberus_icon.png",
        "Chambers of Xeric": "https://oldschool.runescape.wiki/images/Chambers_of_Xeric_icon.png",
        "Chambers of Xeric: Challenge Mode": "https://oldschool.runescape.wiki/images/Chambers_of_Xeric_Challenge_Mode_icon.png",
        "Chaos Elemental": "https://oldschool.runescape.wiki/images/Chaos_Elemental_icon.png",
        "Chaos Fanatic": "https://oldschool.runescape.wiki/images/Chaos_Fanatic_icon.png",
        "Commander Zilyana": "https://oldschool.runescape.wiki/images/Commander_Zilyana_icon.png",
        "Corporeal Beast": "https://oldschool.runescape.wiki/images/Corporeal_Beast_icon.png",
        "Crazy Archaeologist": "https://oldschool.runescape.wiki/images/Crazy_archaeologist_icon.png",
        "Dagannoth Prime": "https://oldschool.runescape.wiki/images/Dagannoth_Prime_icon.png",
        "Dagannoth Rex": "https://oldschool.runescape.wiki/images/Dagannoth_Rex_icon.png",
        "Dagannoth Supreme": "https://oldschool.runescape.wiki/images/Dagannoth_Supreme_icon.png",
        "Deranged Archaeologist": "https://oldschool.runescape.wiki/images/Deranged_archaeologist_icon.png",
        "Duke Sucellus": "https://oldschool.runescape.wiki/images/Duke_Sucellus_icon.png",
        "General Graardor": "https://oldschool.runescape.wiki/images/General_Graardor_icon.png",
        "Giant Mole": "https://oldschool.runescape.wiki/images/Giant_Mole_icon.png",
        "Grotesque Guardians": "https://oldschool.runescape.wiki/images/Grotesque_Guardians_icon.png",
        "Hespori": "https://oldschool.runescape.wiki/images/Hespori_icon.png",
        "Kalphite Queen": "https://oldschool.runescape.wiki/images/Kalphite_Queen_icon.png",
        "King Black Dragon": "https://oldschool.runescape.wiki/images/King_Black_Dragon_icon.png",
        "Kraken": "https://oldschool.runescape.wiki/images/Kraken_icon.png",
        "Kree'Arra": "https://oldschool.runescape.wiki/images/Kree%27arra_icon.png",
        "K'ril Tsutsaroth": "https://oldschool.runescape.wiki/images/K%27ril_Tsutsaroth_icon.png",
        "Mimic": "https://oldschool.runescape.wiki/images/Mimic_icon.png",
        "Nex": "https://oldschool.runescape.wiki/images/Nex_icon.png",
        "Nightmare": "https://oldschool.runescape.wiki/images/The_Nightmare_icon.png",
        "Phosani's Nightmare": "https://oldschool.runescape.wiki/images/Phosani%27s_Nightmare_icon.png",
        "Obor": "https://oldschool.runescape.wiki/images/Obor_icon.png",
        "Phantom Muspah": "https://oldschool.runescape.wiki/images/Phantom_Muspah_icon.png",
        "Sarachnis": "https://oldschool.runescape.wiki/images/Sarachnis_icon.png",
        "Scorpia": "https://oldschool.runescape.wiki/images/Scorpia_icon.png",
        "Scurrius": "https://oldschool.runescape.wiki/images/Scurrius_icon.png",
        "Skotizo": "https://oldschool.runescape.wiki/images/Skotizo_icon.png",
        "Sol Heredit": "https://oldschool.runescape.wiki/images/Sol_Heredit_icon.png",
        "Spindel": "https://oldschool.runescape.wiki/images/Spindel_icon.png",
        "Tempoross": "https://oldschool.runescape.wiki/images/Tempoross_icon.png",
        "The Gauntlet": "https://oldschool.runescape.wiki/images/The_Gauntlet_icon.png",
        "The Corrupted Gauntlet": "https://oldschool.runescape.wiki/images/The_Corrupted_Gauntlet_icon.png",
        "The Leviathan": "https://oldschool.runescape.wiki/images/The_Leviathan_icon.png",
        "The Whisperer": "https://oldschool.runescape.wiki/images/The_Whisperer_icon.png",
        "Theatre of Blood": "https://oldschool.runescape.wiki/images/Theatre_of_Blood_icon.png",
        "Theatre of Blood: Hard Mode": "https://oldschool.runescape.wiki/images/Theatre_of_Blood_Hard_Mode_icon.png",
        "Thermonuclear Smoke Devil": "https://oldschool.runescape.wiki/images/Thermonuclear_smoke_devil_icon.png",
        "Tombs of Amascut": "https://oldschool.runescape.wiki/images/Tombs_of_Amascut_icon.png",
        "Tombs of Amascut: Expert Mode": "https://oldschool.runescape.wiki/images/Tombs_of_Amascut_Expert_Mode_icon.png",
        "TzKal-Zuk": "https://oldschool.runescape.wiki/images/TzKal-Zuk_icon.png",
        "TzTok-Jad": "https://oldschool.runescape.wiki/images/TzTok-Jad_icon.png",
        "Vardorvis": "https://oldschool.runescape.wiki/images/Vardorvis_icon.png",
        "Venenatis": "https://oldschool.runescape.wiki/images/Venenatis_icon.png",
        "Vet'ion": "https://oldschool.runescape.wiki/images/Vet%27ion_icon.png",
        "Vorkath": "https://oldschool.runescape.wiki/images/Vorkath_icon.png",
        "Wintertodt": "https://oldschool.runescape.wiki/images/Wintertodt_icon.png",
        "Zalcano": "https://oldschool.runescape.wiki/images/Zalcano_icon.png",
        "Zulrah": "https://oldschool.runescape.wiki/images/Zulrah_icon.png"
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
        if (!username) {
            alert("Please enter a character name.");
            return;
        }
        loadWikiSyncData(username);
    });

    // ===================================
    // --- THEME SWITCHER ---
    // ===================================
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    const savedTheme = localStorage.getItem('osrs-theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
    } else {
        body.classList.add('dark-mode'); // Default to dark mode
    }

    themeSwitcher.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('osrs-theme', 'light-mode');
        } else {
            body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('osrs-theme', 'dark-mode');
        }
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

    // Initial setup
    loadGoals();
    populateDropdowns();
});
