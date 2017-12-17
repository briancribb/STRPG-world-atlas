# STRPG-world-atlas
A canvas/Bootstrap/AngularJS app using starmap data from the old Star Trek Role-playing Game, published by FASA in the 1980's. The idea was to build my first **AngularJS** app, using subject matter that would be fun for me. The result is an AngularJS application which, althoug imperfect, has taught me a great deal. I'm down to tweaks and improvements now, so the learning is mostly done. I'm done with development aside from occasional tinkering.

The subject matter was written for a table-top role-playing game before the Internet came along, so all of the locations have two-dimensional coordinates from a paper map. I'm fully aware of the fact that space coordinates should be three-dimensional, but they're not that way in the original content and I don't want to reinvent the whole map. For now, This map exists in a 2D universe.

## Stuff I Used
The data was originally entered into a *Google Spreadsheet* but the data won't change very often so I pulled the responses into local JSON files. Once pulled in, the data is transformed so it isn't in Google's yucky format. Promises are used so we don't load the data more than once, and Twitter's Typeahead is used for autocomplete.

UnderscoreJS is included for throttling and for managing arrays. I included jQuery in case I needed it, but I avoided it where possible to practice doing things "the Angular way".

## What It Does
FASA published a game suppliment many moons ago called "The Triangle", which was about a part of space between the UFP, Klingon Empire and the Romulan Star Empire. This app animates that map and allows the user to look up information on the various planets and systems in the area. It could be expanded in the future to include other stars and planets from other suppliments.

There are four ways to look up stuff about the planets and systems listed. First is the starmap. This allows you to search for a system or planet by name in the Typeahead input, or you can just click on the map. Origin and Destination can be set this way, resulting in an animated line between them. You can also zoom in or out with buttons and clear the map of any markers.

The other three ways to get information are accessed by clicking on that left-pointing chevron in the upper-right corner.
- **Course**: A small distance app which allows you to see how far apart two systems are and how long it would take to travel between them at different speeds.
- **Details**: A collection of data about a specific planet and it's parent system. Pretty much everything from its entry in the old books.
- **Sort**: Sorts all systems by their distance from a given location, according to the category selected. For example, you can search by climate and see a list of all desert worlds, sorted from nearest to farthest.

## Stuff I might do in the future
There are some tweaks to the canvas animation, *especially* with the way the arrows move on the destination line. I could also debug some things and add a few new features. But mostly I think I'll just add more planets. The original intent was to provide background for anyone playing in the old FASA Star Trek setting while teaching myself some new skills. I might rewrite the planet descriptions to date them back to the original series, and give the user a choice between the stuff I've written and the stuff in the old books.

Either way, I've learned what I meant to learn. Good stuff.   :-)