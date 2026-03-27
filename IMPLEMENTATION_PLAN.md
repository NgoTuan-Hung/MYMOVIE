- I've implemented an api for movies filter inside MovieController.java
- My site has a navigation bar with 2 button movies, tv-shows, i need to implement a page for those 2 button
- both will point to the same page with different param, let says movies -> /filter?type=movies, tv-shows -> /filter?type=series
and both use the same page with same layout - I will demonstrate the layout for you:

--- Navigation bar still appear on top
FILTER-PAGE
[Sort][Category][Country][Release Year][Type][b: Filter] --- in the top, several drop down [] will be used for filter, and a button [b] for reload the page with according filter request

A grid of movies show up here (10 only)

1 2 3 .. n -- This is for pagination

- The backend is mostly complete, i need you to handle front-end, write a detailed plan into several separate md files into a folder, note that only write the plan, don't execute any part of it.