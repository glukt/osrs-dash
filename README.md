# OSRS Progress Dashboard

A comprehensive, single-page web application for tracking and visualizing your Old School RuneScape character's progress. Enter your character name, and the dashboard will fetch your latest stats from the official OSRS Hiscores to provide a detailed overview of your skills, boss kills, and more.

## Live Demo

(https://glukt.github.io/osrs-dash/)

# MAP CURRENTLY UNDER DEV ##
Leaflet?
pixi-viewport?
Doogle maps?

https://mapgenie.io/old-school-runescape/maps/runescape-surface ?
https://oldschool.runescape.wiki/w/RuneScape:Map#mapFullscreen
https://maps.runescape.wiki/osrs/#1/0/0/3232/3232


## Features

*   **Character Lookup:** Fetch data for any OSRS character from the RuneLite WikiSync API.
*   **Overview Tab:** At-a-glance view of your Total Level, Total XP, Combat Level, and number of maxed skills.
*   **Detailed Skill Progression:** Each skill is displayed with its current level, XP, and progress to the next level.
*   **In-Depth Skill Unlocks:** Click on any skill to see a detailed panel showing all the items, activities, and quests you unlock at each level.
*   **Boss & Activity Tracking:** View your kill counts for all major OSRS bosses and activities.
*   **Boss Drop Tables:** Click on a boss to see its unique drop table, including item names and drop rates.
*   **Statistics Dashboard:**
    *   Visualize your XP and level distribution with dynamic charts.
    *   See leaderboards for your top skills by XP and top boss kill counts.
    *   Quickly identify the skills closest to leveling up.
*   **Goal Setting:** Set personal goals for skill levels or boss kill counts. Your progress is tracked automatically and saved in your browser's local storage.
*   **Interactive World Map:** Explore a PixiJS-powered map of Gielinor, with panning and zooming functionality.
*   **Quest & Achievement Tracking:** Automatically fetches and displays your completed quests from the WikiSync API.
*   **Responsive Design:** A clean, dark-themed UI inspired by the OSRS Wiki that works on both desktop and mobile devices.

## File Structure

```
osrs-dash/
├── index.html
├── README.md
├── css/
│   └── style.css
├── images/
│   └── bosses/
│       └── abyssal_sire.png
└── js/
    ├── api.js
    ├── main.js
    ├── map.js
    └── ui.js
```

## Technologies Used

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript
*   **Libraries:**
    *   [Chart.js](https://www.chartjs.org/) for data visualization and statistics.
    *   [PixiJS](https://pixijs.com/) for the interactive world map.
    *   [pixi-viewport](https://github.com/davidfig/pixi-viewport) for map panning and zooming.
*   **API:** Fetches data from the [RuneLite WikiSync API](https://sync.runescape.wiki/).

## How to Use

1.  Open the `index.html` file in your web browser.
2.  Enter your OSRS character name in the "Character Name" input field.
3.  Click the "Load Character" button.
4.  Explore the different tabs to see your progress!

## Future Enhancements

*   **Price Tracking:** Pull data from the OSRS Wiki API to show the Grand Exchange value of items in drop tables.
*   **More Detailed Goal Types:** Add goals for specific XP targets or clue scroll completions.
*   **More Map Markers:** Add more markers to the map for things like cities, dungeons, and other points of interest.

## Author

*   **glukt** - [https://github.com/glukt](https://github.com/glukt)

## License

This project is licensed under the MIT License.
