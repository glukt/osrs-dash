// ===================================
// --- UI RENDERING FUNCTIONS ---
// ===================================

function updateOverview(hiscoresData) {
    const skills = hiscoresData.skills || {};
    const totalLevel = skills.Overall?.level ?? 0;
    const totalXp = skills.Overall?.xp ?? 0;
    
    let combatLevel = 0;
    const combatSkills = ["Attack", "Strength", "Defence", "Hitpoints", "Prayer", "Ranged", "Magic"];
    const hasAllCombatSkills = combatSkills.every(s => skills[s]);

    if (hasAllCombatSkills) {
        const base = 0.25 * (skills.Defence.level + skills.Hitpoints.level + Math.floor(skills.Prayer.level / 2));
        const melee = 0.325 * (skills.Attack.level + skills.Strength.level);
        const range = 0.325 * (Math.floor(skills.Ranged.level / 2) + skills.Ranged.level);
        const mage = 0.325 * (Math.floor(skills.Magic.level / 2) + skills.Magic.level);
        combatLevel = Math.floor(base + Math.max(melee, range, mage));
    }

    const maxedSkills = Object.values(skills).filter(s => s.level === 99).length;

    document.getElementById('total-level').textContent = totalLevel > 0 ? totalLevel.toLocaleString() : "N/A";
    document.getElementById('total-xp').textContent = totalXp > 0 ? totalXp.toLocaleString() : "N/A";
    document.getElementById('combat-level').textContent = combatLevel > 0 ? combatLevel : "N/A";
    document.getElementById('maxed-skills').textContent = maxedSkills > 0 ? maxedSkills : "0";
}

function renderSkillsGrid(skills, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    Object.keys(skillIconUrls).forEach(skillName => {
        const skill = skills[skillName];
        const skillEl = document.createElement('div');
        skillEl.className = 'skill-card';
        skillEl.dataset.skillName = skillName;
        
        const level = skill?.level ?? 'N/A';
        const xp = skill?.xp ?? -1;
        const rank = skill?.rank ?? -1;

        skillEl.innerHTML = `
            <div class="skill-icon"><img src="${skillIconUrls[skillName]}" alt="${skillName}"></div>
            <div class="skill-info">
                <div class="skill-name">${skillName}</div>
                <div class="skill-level">Level: ${level}</div>
                ${xp > -1 ? `<div class="skill-xp">XP: ${xp.toLocaleString()}</div>` : ''}
            </div>
            ${rank > -1 ? `<div class="skill-rank">#${rank.toLocaleString()}</div>` : ''}
        `;
        
        if (skill) {
            skillEl.addEventListener('click', () => showSkillDetails(skillName, skill));
        }
        container.appendChild(skillEl);
    });
}

function renderActivitiesGrid(bosses, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    if (Object.keys(bosses).length === 0) {
        container.innerHTML = `<p style="padding: 20px; text-align: center; color: #888;">No boss or activity data found for this player.</p>`;
        return;
    }

    Object.entries(bosses).forEach(([bossName, bossData]) => {
        const bossEl = document.createElement('div');
        bossEl.className = 'activity-card';
        
        const score = bossData.score ?? 'N/A';
        const rank = bossData.rank ?? -1;

        bossEl.innerHTML = `
            <div class="activity-info">
                <div class="activity-name">${bossName}</div>
                <div class="activity-score">Kills: ${score.toLocaleString()}</div>
            </div>
            ${rank > -1 ? `<div class="activity-rank">#${rank.toLocaleString()}</div>` : ''}
        `;
        container.appendChild(bossEl);
    });
}

function showSkillDetails(skillName, skillData) {
    const detailsPanel = document.getElementById('skill-details-panel');
    if (!detailsPanel) return;

    detailsPanel.innerHTML = `
        <div class="skill-details-header">
            <h3>${skillName} Details</h3>
            <button class="close-details" onclick="document.getElementById('skill-details-panel').style.display='none'">&times;</button>
        </div>
        <div class="skill-stats">
            <div class="stat-item"><strong>Level:</strong> ${skillData.level.toLocaleString()}</div>
            <div class="stat-item"><strong>XP:</strong> ${skillData.xp.toLocaleString()}</div>
            <div class="stat-item"><strong>Rank:</strong> ${skillData.rank > 0 ? skillData.rank.toLocaleString() : 'Unranked'}</div>
        </div>`;
    detailsPanel.style.display = 'block';
}

function renderGoals() {
    const goalsListContainer = document.getElementById("goals-list");
    if (!goalsListContainer) return;
    goalsListContainer.innerHTML = "";

    if (!Array.isArray(window.goals) || window.goals.length === 0) {
        goalsListContainer.innerHTML = "<p>No active goals. Add one above!</p>";
        return;
    }

    window.goals.forEach((goal, index) => {
        const goalElement = document.createElement("div");
        goalElement.className = "goal";
        let current = 0;
        let progressPercent = 0;

        if (goal.type === 'skill' && window.hiscoresData?.skills?.[goal.name]) {
            current = window.hiscoresData.skills[goal.name].level;
            progressPercent = (current / goal.target) * 100;
        } else if (goal.type === 'boss' && window.hiscoresData?.bosses?.[goal.name]) {
            current = window.hiscoresData.bosses[goal.name].score;
            progressPercent = (current / goal.target) * 100;
        }

        const isCompleted = current >= goal.target;
        if (isCompleted) goalElement.classList.add("completed");

        goalElement.innerHTML = `
            <div style="flex-grow: 1;">
                <span><strong>${goal.name}</strong> Target: ${goal.target.toLocaleString()} (Current: ${current.toLocaleString()})</span>
                <div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${Math.min(100, progressPercent)}%"></div></div>
            </div>
            <button data-index="${index}">Delete</button>`;
        goalsListContainer.appendChild(goalElement);
    });
}

function populateDropdowns() {
    const goalNameSkillSelect = document.getElementById("goalNameSkill");
    const goalNameBossSelect = document.getElementById("goalNameBoss");

    if (goalNameSkillSelect) {
        goalNameSkillSelect.innerHTML = '';
        skillDropdownNames.forEach(skillName => {
            const option = document.createElement("option");
            option.value = skillName;
            option.textContent = skillName;
            goalNameSkillSelect.appendChild(option);
        });
    }
    if (goalNameBossSelect) {
        goalNameBossSelect.innerHTML = '';
        bossActivityNames.forEach(bossName => {
            const option = document.createElement("option");
            option.value = bossName;
            option.textContent = bossName;
            goalNameBossSelect.appendChild(option);
        });
    }
}

function createCharts() {
    const skills = window.hiscoresData?.skills || {};
    const skillNames = Object.keys(skills).filter(name => name !== 'Overall' && skills[name] && skills[name].xp > 0);
    
    const levelChartCard = document.getElementById('level-chart')?.closest('.stat-card');
    const xpChartCard = document.getElementById('xp-chart')?.closest('.stat-card');

    if (skillNames.length === 0) {
        if (levelChartCard) levelChartCard.style.display = 'none';
        if (xpChartCard) xpChartCard.style.display = 'none';
        return;
    }

    const skillLevels = skillNames.map(name => skills[name].level);
    const skillXps = skillNames.map(name => skills[name].xp);

    const levelData = {
        labels: skillNames,
        datasets: [{ label: 'Skill Levels', data: skillLevels, backgroundColor: 'rgba(59, 130, 246, 0.5)' }]
    };
    const xpData = {
        labels: skillNames,
        datasets: [{ label: 'Skill XP', data: skillXps, backgroundColor: 'rgba(34, 197, 94, 0.5)' }]
    };

    if (levelChartCard) {
        levelChartCard.style.display = 'block';
        const ctx = levelChartCard.querySelector('canvas').getContext('2d');
        if (window.levelChart) window.levelChart.destroy();
        window.levelChart = new Chart(ctx, { type: 'bar', data: levelData, options: { scales: { y: { beginAtZero: true } } } });
    }
    if (xpChartCard) {
        xpChartCard.style.display = 'block';
        const ctx = xpChartCard.querySelector('canvas').getContext('2d');
        if (window.xpChart) window.xpChart.destroy();
        window.xpChart = new Chart(ctx, { type: 'bar', data: xpData, options: { scales: { y: { beginAtZero: true } } } });
    }
}
