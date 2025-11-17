let osrsMap = null;

function initializeMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    const app = new PIXI.Application({
        width: mapContainer.clientWidth,
        height: mapContainer.clientHeight,
        backgroundColor: 0x0c0c0c,
        resizeTo: mapContainer
    });
    mapContainer.appendChild(app.view);

    // Create a viewport
    const viewport = new Viewport.Viewport({
        screenWidth: app.view.width,
        screenHeight: app.view.height,
        worldWidth: 1048576,
        worldHeight: 1048576,

        interaction: app.renderer.events // the interaction module is important for wheel to work properly
    });

    // add the viewport to the stage
    app.stage.addChild(viewport);

    // activate plugins
    viewport
        .drag()
        .pinch()
        .wheel()
        .decelerate();

    // add the map tiles
    const TILE_SIZE = 256;
    const tilesContainer = new PIXI.Container();
    viewport.addChild(tilesContainer);

    for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
            const tile = new PIXI.Sprite(PIXI.Texture.from(`https://maps.runescape.wiki/osrs/2020-02-10/0/${x}/${y}.png`));
            tile.position.set(x * TILE_SIZE, y * TILE_SIZE);
            tilesContainer.addChild(tile);
        }
    }

    osrsMap = viewport;
    addMapMarkers();
}

function addMapMarkers() {
    const markerContainer = new PIXI.Container();
    osrsMap.addChild(markerContainer);

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

    for (const type in mapLocations) {
        mapLocations[type].forEach(loc => {
            const [x, y] = loc.coords;
            const marker = new PIXI.Graphics();
            marker.beginFill(0xff0000);
            marker.drawCircle(0, 0, 5);
            marker.endFill();
            marker.position.set(x, y);
            markerContainer.addChild(marker);
        });
    }
}
