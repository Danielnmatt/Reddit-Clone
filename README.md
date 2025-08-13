# Phreddit - A Reddit Clone

## Project Overview

Phreddit is a Reddit-like web application built with the MERN stack (MongoDB, Express.js, React, Node.js). It allows users to create communities, make posts, comment on posts, and interact with other users in a familiar social media format.

## Features

-   User authentication (register, login)
-   Create and join communities
-   Create posts with link flairs
-   Comment on posts with nested comment support
-   Vote on posts
-   View user profiles
-   Admin functionality for content moderation
-   Responsive design
-   Real-time online/offline status detection

## Prerequisites

Before setting up the project, ensure you have the following installed:

-   [Node.js](https://nodejs.org/en/download) (v16 or higher)
-   [MongoDB Community Edition](https://www.mongodb.com/docs/manual/administration/install-community/) (v6.0 or higher)
-   npm (comes with Node.js)

## Installation and Setup

### 1. Install Dependencies

Run all commands in terminal:

1. Root directory dependencies:

```bash
npm install
```

2. Client dependencies:

```bash
cd client
npm install
```

3. Server dependencies:

```bash
cd server
npm install
```

### 2. Database Setup

1. Start MongoDB:

```bash
mongod
```

2. Initialize the database:

```bash
cd server
npm run initDB
```

This will create:

-   An admin user (email: admin@admin.com, username: ADMIN, password: password123)
-   Sample communities, posts, and comments

Alternative admin setup:

```bash
node init.js mongodb://127.0.0.1:27017/phreddit <admin_email> <admin_displayName> <admin_password>
```

### 3. Running the Application

1. Start the server (from server directory):

```bash
npm run start
```

2. Start the client (from client directory):

```bash
npm start
```

The application will be available at:

-   Frontend: http://localhost:3000
-   Backend: http://localhost:8000

### 4. Testing

Run tests from the root directory:

```bash
npm test
```

## Project Structure

```
root
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/               # React source files
│       ├── components/    # React components
│       ├── stylesheets/   # CSS styles
│       └── images/        # Image assets
├── server/                # Backend Express application
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   └── routes/           # API routes
├── images/               # UML and design documentation
```

## Technologies Used

-   **Frontend**
    -   React.js
    -   React Router DOM
    -   Axios
    -   CSS3
-   **Backend**
    -   Node.js
    -   Express.js
    -   MongoDB with Mongoose
    -   JWT for authentication
    -   bcrypt for password hashing
-   **Testing**
    -   Jest
    -   React Testing Library
    -   Supertest

In the sections below, list and describe each contribution briefly.

## Team Member 1 Contribution

Luca Capuano

-   Welcome, Login, Register pages
-   Handled User and Admin authentication
-   Voting
-   Community and Post listings of joined Communities
-   Profile Page View
-   Deleting Users/Posts/Comments/Communities

## Team Member 2 Contribution

Daniel Nguyen

-   UserContext and handling login logic
-   Logging out and Guest User
-   Created routes and controllers
-   UML Diagrams
-   Editing Posts/Comments/Communities
-   Joining/Leaving communities
-   jest tests
