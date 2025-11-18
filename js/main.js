// ===================================
// --- GLOBAL DATA & HELPERS ---
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
    "Overall": "https://oldschool.runescape.wiki/images/Stats_icon.png"
};

const skillDropdownNames = Object.keys(skillIconUrls).filter(name => name !== "Overall").sort();
const bossActivityNames = [
    "Abyssal Sire", "Alchemical Hydra", "Barrows Chests", "Bryophyta", "Callisto",
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


// ===================================
// --- DATA PROCESSING ---
// ===================================
function processAndRenderData(hiscoresData) {
    window.hiscoresData = hiscoresData;

    updateOverview(hiscoresData);
    renderSkillsGrid(hiscoresData.skills, 'skills-grid-container');
    renderSkillsGrid(hiscoresData.skills, 'skills-progression-grid');
    renderActivitiesGrid(hiscoresData.bosses, 'activities-grid-container');
    renderGoals();
    
    if (document.getElementById('statistics-tab').classList.contains('active')) {
        createCharts();
    }
}


// ===================================
// --- DOM INITIALIZATION ---
// ===================================
document.addEventListener("DOMContentLoaded", () => {

    const loadButton = document.getElementById("loadButton");
    const usernameInput = document.getElementById("username");
    const accountTypeSelect = document.getElementById("accountType");
    const addGoalButton = document.getElementById("addGoalButton");
    const goalTypeInput = document.getElementById("goalType");
    const goalTargetInput = document.getElementById("goalTarget");
    const goalsListContainer = document.getElementById("goals-list");
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    const questsTabButton = document.querySelector('[data-tab="quests"]');
    if (questsTabButton) {
        questsTabButton.style.display = 'none';
        // Or add a message
        // const questsPane = document.getElementById('quests-tab');
        // questsPane.innerHTML = `<p style="padding: 20px; text-align: center; color: #888;">Quest and Achievement Diary data is not available from the public Hiscores API.</p>`;
    }

    function loadGoals() {
        const savedGoals = localStorage.getItem("osrsGoals");
        window.goals = savedGoals ? JSON.parse(savedGoals) : [];
        renderGoals();
    }

    function saveGoals() {
        localStorage.setItem("osrsGoals", JSON.stringify(window.goals));
    }

    addGoalButton.addEventListener("click", () => {
        const type = goalTypeInput.value;
        let name = "";
        const target = parseInt(goalTargetInput.value);
        const goalNameSkillSelect = document.getElementById("goalNameSkill");
        const goalNameBossSelect = document.getElementById("goalNameBoss");

        if (type === "skill") { 
            name = goalNameSkillSelect.value;
            if (!name || !target || target <= 0 || target > 99) {
                alert("Please select a skill and enter a valid target level (1-99).");
                return;
            }
        } else if (type === "boss") {
            name = goalNameBossSelect.value;
             if (!name || !target || target <= 0) {
                alert("Please select a boss and enter a valid target kill count.");
                return;
            }
        }

        window.goals.push({ type: type, name: name, target: target });
        saveGoals();
        renderGoals();
    });

    goalsListContainer.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") {
            const goalIndex = parseInt(event.target.getAttribute("data-index"));
            window.goals.splice(goalIndex, 1);
            saveGoals();
            renderGoals();
        }
    });

    loadButton.addEventListener("click", async () => {
        const username = usernameInput.value.trim();
        const accountType = accountTypeSelect.value;
        if (!username) {
            alert("Please enter a username.");
            return;
        }

        loadButton.disabled = true;
        loadButton.textContent = "Loading...";

        try {
            const hiscoresData = await fetchHiscores(username, accountType);
            processAndRenderData(hiscoresData);
            document.getElementById('player-name-display').textContent = username;
        } catch (error) {
            alert(error.message);
        } finally {
            loadButton.disabled = false;
            loadButton.textContent = "Load Character";
        }
    });

    const savedTheme = localStorage.getItem('osrs-theme');
    body.classList.add(savedTheme || 'dark-mode');

    themeSwitcher.addEventListener('click', () => {
        const currentTheme = body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
        const newTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
        body.classList.replace(currentTheme, newTheme);
        localStorage.setItem('osrs-theme', newTheme);
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
            if (targetTab === 'map' && !window.osrsMap) {
                initializeMap();
            }
             if (targetTab === 'statistics' && window.hiscoresData) {
                createCharts();
            }
        });
    });

    loadGoals();
    populateDropdowns();
});