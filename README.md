## myFlix-client

#Objective

Build a movie client-side app with React as Front-End and using a REST API as Back-End.

#The 5 W's

Who — The users of your movie application. They will be movie enthusiasts who enjoy reading information about different movies
What — A single-page, responsive application with routing, rich interactions, several interface views, and a polished user experience. The client-side development in this project supports the existing server-side code (REST API and database) by facilitating user requests and rendering the response from the server-side via several different interface views
When — Users will be able to use the Movie App whenever they want to read information about different movies or update their user data — for instance, their list of "Favorite Movies"
Where — The application is hosted online. The Movie application itself is responsive and can be used anywhere and on any device, giving all users the same experience
Why — Movie enthusiasts should be able to access information about different movies, directors, and genres, whenever they want to. Having the ability to save lists of favorite movies will ensure users always have access to the films they want to watch or recommend to their peers.

#Links

Deployed app:
Rest API:

#Built with

React
Redux
React Bootstrap

#Features

Return a list of ALL movies to the user
Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
Return data about a genre (description) by name/title (e.g., “Thriller”)
Return data about a director (bio, birth year, death year) by name
Allow new users to register
Allow users to update their user info (username, password, email, date of birth)
Allow users to add a movie to their list of favorites
Allow users to remove a movie from their list of favorites
Allow existing users to deregister
JWT token-based users authentication

#Views

- Main view

Returns a list of ALL movies to the user (each listed item with an image, title, and description)
Sorting and filtering
Ability to select a movie for more details

- Single movie view

Returns data (description, genre, director, image) about a single movie to the user
Allows users to add a movie to their list of favorites

- Login view

Allows users to log in with a username and password
Registration view
Allows new users to register (username, password, email, birthday)

- Genre view

Returns data about a genre, with a name and description
Displays example movies

- Director view

Returns data about a director (name, bio, birth year, death year)
Displays example movies

- Profile view

Allows users to update their user info (username, password, email, date of birth)
Allows existing users to deregister
Displays favorite movies
Allows users to remove a movie from their list of favorites
