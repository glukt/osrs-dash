function loadWikiSyncData(username) {
    const url = `https://sync.runescape.wiki/runelite/player/${username}/STANDARD`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            updateQuests(data.quests);
        })
        .catch(error => {
            console.error("Error fetching WikiSync data:", error);
        });
}
