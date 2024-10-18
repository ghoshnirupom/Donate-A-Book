# Donate a Book Application

## Overview

The **Donate a Book** application is a web platform that allows users to donate books they no longer need and for others to browse and request these books. The goal of this application is to promote reading and sustainability by encouraging the sharing of books within the community.

## Features

- **Book Donation**: Users can enter details of the books they want to donate, including title, author, genre, year of publication, and ISBN.
- **View Available Books**: Users can browse through a list of donated books.
- **Delete Books**: Donors can remove their books from the list if they are no longer available.
- **Responsive Design**: The application is designed to work on various screen sizes.

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript (React or Vue.js for a dynamic interface)
- **Backend**: Node.js with Express
- **Database**: MongoDB

## Project Structure

/donate-a-book ├── /client # Frontend code ├── /server # Backend code ├── package.json └──


### Client Directory

The client directory contains the HTML, CSS, and JavaScript files responsible for the frontend of the application. It is designed to be user-friendly and responsive.

### Server Directory

The server directory includes the backend code that handles API requests, database interactions, and serves the frontend files.

## Getting Started

To get a copy of the project up and running on  local machine, follow these steps:

### Prerequisites

Make sure the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or use MongoDB Atlas)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/donate-a-book.git
   cd donate-a-book

2. **Install Backend Dependencies**:
Navigate to the server directory and install the required packages:

cd server
npm install

3. **Install Frontend Dependencies** :

Navigate to the client(public) directory and install the required packages:

cd ../public
npm install

4. **Set Up MongoDB** :

Open MongoDB Compass.
Create a database named booklibrary.
Create a collection named users.

1.***Running the Application** :
Start the Server:

Navigate back to the server directory and start the server:

cd server
node server.js

The server will run on http://localhost:3000.

2. **Start the Frontend** :

Navigate to the client directory and start the frontend:

cd ../public
npm start

The application will be accessible at http://localhost:3000 (or another port if specified).

**API Endpoints**
POST /api/users 
Description: Creates a new user with the Book Details..
Request Body:

{
    "name": "User Name",
    "phone": 1234567890,
    "email": "user@example.com",
    "books": [
        {
            "sno": 1,
            "booktitle": "Book Title",
            "author": "Author Name",
            "genre": "Genre",
            "yop": "YYYY-MM-DDTHH:mm:ss.sssZ",
            "isbn": "ISBN"
        }
    ]
}

Response: 
{
    "_id": "userId",
    "name": "User Name",
    "phone": 1234567890,
    "email": "user@example.com",
    "books": [...]
}

 PUT /users/:id 
 Description: Updates the specified user's details.

 Request Body:

{
    "name": "New User Name",
    "phone": 1234567890,
    "email": "newuser@example.com",
    "books": [...]
}

Response: 

{
    "_id": "userId",
    "name": "New User Name",
    "phone": 1234567890,
    "email": "newuser@example.com",
    "books": [...]
}

DELETE /users/:userId/books/:bookId 

Description: Deletes a specific book from a user's list.

Response: 

{
    "message": "Book deleted successfully",
    "user": {
        "_id": "userId",
        "name": "User Name",
        "phone": 1234567890,
        "email": "user@example.com",
        "books": [...]
    }
}

GET /state

Description: Retrieves the current state of all users and their books, with automatically assigned serial numbers.

Response:

[
    {
        "name": "User Name",
        "phone": 1234567890,
        "email": "user@example.com",
        "books": [
            {
                "sno": 1,
                "booktitle": "Book Title",
                "author": "Author Name",
                "genre": "Genre",
                "yop": "YYYY-MM-DDTHH:mm:ss.sssZ",
                "isbn": "ISBN"
            }
        ]
    }
]

Error Handling
In case of errors, the API will respond with a relevant status code and an error message 

{
    "error": "Error message describing what went wrong"
}

**Notes**
Ensure you have the required dependencies installed (dotenv, express, mongoose, body-parser, cors).
Set up your MongoDB URI in the .env file as MONGODB_URI.


