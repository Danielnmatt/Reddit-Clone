[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/2tEDYwzN)
# Term Project

Add design docs in *images/*

## Instructions to setup and run project
Clearly explain the steps required to install and configure necessary packages,
for both the server and the client, and the sequence of steps required to get
your application running.

## Running Instructions
- Run all **`$ ...`** in terminal
- In a terminal window, in the root directory, run **`$ npm i`**.
- In a new terminal window, navigate to the client directory (**`$ cd client`**), then run **`$ npm i`**. Finally, run **`$ npm start`**
- In a new terminal window, navigate to the server directory (**`$ cd server`**), then run **`$ npm i`**. Run **`$ npm run start`** to start the server. In a new terminal in the server directory, run **`$ npm run initDB`** to initialize the database with some initial data, including the administrator account with email: admin@admin.com, displayName: ADMIN, password: password123. Alternatively, to define your own admin account you can run **`$ node init.js mongodb://127.0.0.1:27017/phreddit <admin_email> <admin_displayName> <admin_password>`**. Both will initialize the database with default data, as seen in prior assignments.

In the sections below, list and describe each contribution briefly.

## Team Member 1 Contribution
Luca Capuano
- Welcome, Login, Register pages
- Handled User and Admin authentication
- Voting
- Community and Post listings of joined Communities
- Profile Page View
- Deleting Users/Posts/Comments/Communities

## Team Member 2 Contribution
Daniel Nguyen
- UserContext and handling login logic
- Logging out and Guest User
- Created routes and controllers
- UML Diagrams
- Editing Posts/Comments/Communities
- Joining/Leaving communities
- express.test.js