# OSRS Progress Dashboard

A comprehensive, single-page web application for tracking and visualizing your Old School RuneScape character's progress. Enter your character name, and the dashboard will fetch your latest stats from the official OSRS Hiscores to provide a detailed overview of your skills, boss kills, and more.

## Live Demo

**(Link to your live GitHub Pages site will go here after you deploy it.)**

## Features

*   **Character Lookup:** Fetch data for any OSRS character, with support for all account types (Normal, Ironman, HCIM, UIM).
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
*   **Interactive World Map:** Explore a Leaflet.js-powered map of Gielinor, with toggleable markers for bosses, slayer masters, and other points of interest.
*   **Quest & Achievement Tracking:** A dedicated section to manually track your quest and achievement diary progress (as this data is not available via the Hiscores API).
*   **Responsive Design:** A clean, dark-themed UI inspired by the RuneLite client that works on both desktop and mobile devices.

## Screenshots

*(You can add screenshots of your application here.)*

## Technologies Used

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript
*   **Libraries:**
    *   [Chart.js](https://www.chartjs.org/) for data visualization and statistics.
    *   [Leaflet.js](https://leafletjs.com/) for the interactive world map.
*   **API:** Fetches data from the official [OSRS Hiscores API](https://runescape.wiki/w/Application_programming_interface#Hiscores_Lite).

## How to Use

1.  Open the `osrs-profil.html` file in your web browser.
2.  Enter your OSRS character name in the "Character Name" input field.
3.  Select your account type from the dropdown menu.
4.  Click the "Load Character" button.
5.  Explore the different tabs to see your progress!

## Future Enhancements

*   **Runelite Integration:** Integrate with Runelite's local quest data file to automatically display quest completion status.
*   **Price Tracking:** Pull data from the OSRS Wiki API to show the Grand Exchange value of items in drop tables.
*   **More Detailed Goal Types:** Add goals for specific XP targets or clue scroll completions.

## Author

*   **glukt** - [https://github.com/glukt](https://github.com/glukt)

## License

This project is licensed under the MIT License.
