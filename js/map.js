// A simple, dependency-free pan and zoom map implementation.

osrsMap = null; // Use the global variable

function initializeMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || osrsMap) return; // Already initialized

    mapContainer.innerHTML = '<div id="map-content"></div>';
    const mapContent = document.getElementById('map-content');

    // --- Map State ---
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    // --- Create Map Tiles ---
    // Using a simple 4x4 grid from zoom level 2 for a basic map
    const TILE_URL_TEMPLATE = 'https://raw.githubusercontent.com/explv/osrs_map_tiles/master/2/{x}/{y}.png';
    const GRID_SIZE = 4;
    const TILE_SIZE = 256;

    for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
            const tile = new Image();
            tile.crossOrigin = "anonymous"; // Help prevent CORS issues
            tile.src = TILE_URL_TEMPLATE.replace('{x}', x).replace('{y}', y);
            tile.className = 'map-tile';
            tile.style.position = 'absolute';
            tile.style.left = `${x * TILE_SIZE}px`;
            tile.style.top = `${y * TILE_SIZE}px`;
            mapContent.appendChild(tile);
        }
    }
    mapContent.style.width = `${GRID_SIZE * TILE_SIZE}px`;
    mapContent.style.height = `${GRID_SIZE * TILE_SIZE}px`;

    function updateTransform() {
        mapContent.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    // --- Event Listeners ---
    mapContainer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        mapContainer.style.cursor = 'grabbing';
    });

    mapContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        translateX += dx;
        translateY += dy;
        lastX = e.clientX;
        lastY = e.clientY;
        updateTransform();
    });

    mapContainer.addEventListener('mouseup', () => {
        isDragging = false;
        mapContainer.style.cursor = 'grab';
    });

    mapContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        mapContainer.style.cursor = 'grab';
    });

    mapContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const scaleAmount = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = scale * scaleAmount;

        // Clamp scale
        if (newScale < 0.5 || newScale > 5) {
            return;
        }

        const rect = mapContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Adjust translate to zoom towards the mouse pointer
        translateX = mouseX - (mouseX - translateX) * scaleAmount;
        translateY = mouseY - (mouseY - translateY) * scaleAmount;
        scale = newScale;

        updateTransform();
    });
    
    // Set initial state
    mapContainer.style.cursor = 'grab';
    updateTransform();

    // Expose a minimal API via the global osrsMap object
    osrsMap = {
        container: mapContainer,
        content: mapContent,
        addMarkers: addMapMarkers
    };

    osrsMap.addMarkers();
}

function addMapMarkers() {
    if (!osrsMap || !osrsMap.content) return;
    const mapContent = osrsMap.content;

    // Simple conversion from game coords to map pixels for this tile set
    // This is a rough approximation and may need refinement.
    // Based on the wiki map, total map size is ~8192x10496 at zoom level 4.
    // Our map is 1024x1024 at zoom level 2. So we need to scale down.
    const GAME_X_MIN = 1152;
    const GAME_X_MAX = 3903;
    const GAME_Y_MIN = 2496;
    const GAME_Y_MAX = 4735;
    const MAP_PIXEL_WIDTH = 1024;
    const MAP_PIXEL_HEIGHT = 1024;

    const mapLocations = {
        bosses: [
            { name: "Lumbridge", coords: [3222, 3218], type: "city" },
            { name: "Varrock", coords: [3210, 3424], type: "city" },
            { name: "Falador", coords: [2964, 3378], type: "city" },
            { name: "Grand Exchange", coords: [3165, 3478], type: "poi" },
            { name: "Wintertodt", coords: [1630, 3962], type: "minigame" },
            { name: "Barrows", coords: [3565, 3315], type: "boss" },
        ],
    };

    for (const type in mapLocations) {
        mapLocations[type].forEach(loc => {
            // This coordinate conversion is a placeholder and likely incorrect.
            // A proper implementation would need a more accurate projection.
            const percentX = (loc.coords[0] - GAME_X_MIN) / (GAME_X_MAX - GAME_X_MIN);
            const percentY = (loc.coords[1] - GAME_Y_MIN) / (GAME_Y_MAX - GAME_Y_MIN);
            
            const x = percentX * MAP_PIXEL_WIDTH;
            const y = (1 - percentY) * MAP_PIXEL_HEIGHT; // Y is often inverted

            if (x > 0 && x < MAP_PIXEL_WIDTH && y > 0 && y < MAP_PIXEL_HEIGHT) {
                const marker = document.createElement('div');
                marker.className = `map-marker ${loc.type}`;
                marker.style.left = `${x}px`;
                marker.style.top = `${y}px`;
                marker.title = loc.name;
                mapContent.appendChild(marker);
            }
        });
    }
}