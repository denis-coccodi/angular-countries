# Take-Home Assignment


## Code Review
- Afghanistan's flag image is bugged BE side: it comes in as:
        "flags": {
            "png": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_the_Taliban.svg/320px-Flag_of_the_Taliban.svg.png",
            "svg": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Taliban.svg",
            "alt": "The flag of the Islamic Emirate of Afghanistan has a white field with Arabic inscriptions — the Shahada — in black across its center."
        }, 
        from https://restcountries.com/v3.1/all?fields=name,capital,region,population,area,currencies,languages,borders,flags,cca3
- applyFilters is altering a global element directly in the country list component, rather than passing it as a parameter.
Passing this.countries as parameter and then using the spread operator inside the function allows you to understand at a glance what kind of state data you'll be editing in the function. 
- countries: any[] = [];
  filteredCountries: any[] = [];
  Any as a type outside of unit tests should hardly ever exist to make navigating the code and understanding it easier, other than reduce potential bugs because of a lack of knowledge about included object properties.



## What I did
- Added an Interceptor to fix the Afghanistan flag since I don't have access to the BE side.


## What I'd do with more time

## Tradeoffs
- I added the interceptor to fix the Afghanistan flag, which is a hacky solution. However, given that I don't have access to the backend and the flag image is currently broken, this was the most practical way to ensure the application functions correctly without leaving a broken image in place.

## How to run

- No new Steps