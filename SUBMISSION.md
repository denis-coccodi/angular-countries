# Take-Home Assignment


## Code Review
- Afghanistan's flag image is bugged BE side: it comes in as:
        "flags": {
            "png": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_the_Taliban.svg/320px-Flag_of_the_Taliban.svg.png",
            "svg": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Taliban.svg",
            "alt": "The flag of the Islamic Emirate of Afghanistan has a white field with Arabic inscriptions — the Shahada — in black across its center."
        }, 
        from https://restcountries.com/v3.1/all?fields=name,capital,region,population,area,currencies,languages,borders,flags,cca3
- Height of country cards is uneven. 
- Regions select is populated with an array of empties.       
- CSS is all global
- countries: any[] = [];
  filteredCountries: any[] = [];
  Any as a type outside of unit tests should hardly ever exist to make navigating the code and understanding it easier, other than reduce potential bugs because of a lack of knowledge about included object properties.
- Cannot tab through countries or select them with enter even if a function with a console.log exists.
- Regions dropdown was bugged and showed Empty on all lines



## What I did
- Added an Interceptor to fix the Afghanistan flag since I don't have access to the BE side.
- Fixed the height of country cards to all have the same height of the highest in the row: height: 100%;
- Introduced tabbing and enter key function on country cards.
- Added Country type.
- Moved the country card component to a shared UI folder.
- Added a wrapper for the primeng multiselect component for consistency.
- Created a new compare countries route and page.
- Fixed Regions dropdown.
- Added some Accessibility improvements.
- Moved most scss away from the styles.scss and into components.
- Replaced Karma with Jest.
- Let Claude AI generate unit tests for components and services.

## What I'd do with more time
- I considered virtual scrolling, but it ended up requiring a lot of code just to keep track of how many lines were present at one time (depending on screen width), and hardcoding card height wasn't ideal either.
Since it is very fast loading in the current state, I decided against it.

## Tradeoffs
- I added the interceptor to fix the Afghanistan flag, which is a hacky solution. However, given that I don't have access to the backend and the flag image is currently broken, this was the most practical way to ensure the application functions correctly without leaving a broken image in place.
- When implementing focus styles for tabbing, I ran into a problem with primeNG. The outline would be shown both when selecting an input or multiselect with mouse and tabbing. To prevent the outline from appearing on focus through clicking too, extra code was necessary in the app component and styles.scss.

## How to run
- Run `npm install` to install dependencies.
- Run `npm start` to start the development server.
- Run `npm test` to execute unit tests.