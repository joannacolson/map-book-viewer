# u2-project-map-book-viewer
Unit 2 Project - A full-stack app that displays a user's contact info visually using the Google Maps API

# Technologies Used

1. Node.js Express application

2. Sequelize ORM (Object-Relational Model)

3. PostgreSQL database

4. Bcrypt, Passport and OAuth Facebook authentication

5. ejs, ejs-layouts for responsive HTML pages

6. Online public access using Heroku

7. HTML, CSS, JavaScript

8. Bootstrap CSS framework

# Approach Taken

I approached this project using a top-down, 'begin with the end in mind' process. I studied the project requirements and determined that I could implement a combination of technologies that we have studied to make an app that lets the user enter contact information about various subjects, then list and view them graphically on a Google map. I also want to display a street view for each contact when showing the contact's detailed information.

Then I wrote user stories to focus the requirements of the app. I designed wireframes to show the screens that the user would see as they navigate through the application.

My approach for development was to write the application from the top down, stubbing out various detailed functions as needed to focus on the initial, core functions first. I developed the user authentication functions first. I then wrote the RESTful functions to get the database management working. I then incorporated the Google Maps API functions to show the Subject's Contact information on a map with markers and to show a street view of for a specific Contact's address.

# Installation Instructions

Prerequisites: This project requires you to have PostgreSQL and nodemon installed on your system.

1. Fork this application if you wish to make your own GitHub version.

2. Use Git Clone to clone this app into a directory on your system.

3. Change directory into the 'u2-project-map-book-viewer' directory you just cloned.

4. Run 'npm initialize' to initialize the Node Package Manager modules this project uses.

5. Run 'createdb map_book_viewer_db' to create the app's database.

6. Run 'sequelize db:migrate' to create the app's tables in the database.

7. Run 'nodemon' to start the node application and restart the app as needed.

# User Stories

1. As a user, when going to the site, I will see a page that lets me sign up or login using a local auth or a FaceBook auth capability.

2. As a user, I can not use the site unless I am logged in. When logged in, I can only access my data on the site, not other user's data.

3. As a user, I can create, read, update and delete Subjects to the site, such as 'My Friends' or 'Mexican Restaurants'.

4. As a user, for each Subject, I can create, read, update and delete Contacts, such as the name and address of specific friends or restaurants.

5. As a user, for a specific Subject, I can view a map with markers for each Contact within that Subject, such as a 'Mexican Restaurant' map with markers for each restaurant.

6. As a user, when displaying information about a Contact, it displays a Street View for the Contact's address.

# Unsolved Problems

At the present, there are no unsolved problems with this application.
