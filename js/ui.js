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

function renderGoals() {
    const goalsListContainer = document.getElementById("goals-list");
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

function updateQuests(quests) {
    const questListOutput = document.getElementById('quest-list-output');
    questListOutput.innerHTML = '';

    if (!quests) {
        questListOutput.innerHTML = '<li>No quest data found.</li>';
        return;
    }

    for (const questName in quests) {
        if (quests[questName].status === 'COMPLETED') {
            const li = document.createElement('li');
            li.textContent = questName;
            questListOutput.appendChild(li);
        }
    }
}

function populateDropdowns() {
    const goalNameSkillSelect = document.getElementById("goalNameSkill");
    const goalNameBossSelect = document.getElementById("goalNameBoss");
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

function createCharts() {
    const xpData = {
        labels: Object.keys(hiscoresData.skills).filter(name => name !== 'Overall'),
        datasets: [{
            label: 'XP Distribution',
            data: Object.values(hiscoresData.skills).filter(skill => skill.name !== 'Overall').map(skill => skill.xp),
            backgroundColor: 'rgba(245, 158, 11, 0.5)',
            borderColor: 'rgba(245, 158, 11, 1)',
            borderWidth: 1
        }]
    };

    const levelData = {
        labels: Object.keys(hiscoresData.skills).filter(name => name !== 'Overall'),
        datasets: [{
            label: 'Level Distribution',
            data: Object.values(hiscoresData.skills).filter(skill => skill.name !== 'Overall').map(skill => skill.level),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1
        }]
    };

    const xpChartCtx = document.getElementById('xp-chart').getContext('2d');
    if (xpChart) {
        xpChart.destroy();
    }
    xpChart = new Chart(xpChartCtx, {
        type: 'bar',
        data: xpData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const levelChartCtx = document.getElementById('level-chart').getContext('2d');
    if (levelChart) {
        levelChart.destroy();
    }
    levelChart = new Chart(levelChartCtx, {
        type: 'bar',
        data: levelData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}