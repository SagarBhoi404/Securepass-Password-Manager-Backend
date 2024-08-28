# SecurePass - Backend

Welcome to the backend of **SecurePass**, a robust password manager application that prioritizes your security. This backend is built using Node.js and Express, with MongoDB as the database. It provides the core functionality for managing user authentication, password encryption, and secure data storage.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)


## Features

- **User Authentication**: Secure login and registration system using JWT tokens.
- **AES-256 Encryption**: All passwords are encrypted using AES-256 before storage.
- **Individual Encryption Keys**: Each user has a unique AES encryption key that is never stored on the server.
- **Password Management**: APIs for creating, updating, deleting, and retrieving encrypted passwords.
- **MongoDB Integration**: Data persistence using MongoDB, with Mongoose for schema modeling.

## Tech Stack

- **Node.js**: JavaScript runtime for building the backend.
- **Express**: Web framework for Node.js, providing a robust set of features for web and mobile applications.
- **MongoDB**: NoSQL database for storing user and password data.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **JWT**: JSON Web Tokens for user authentication.
- **Crypto**: Node.js module for implementing AES encryption.

## Installation

### Prerequisites

- **Node.js**: Make sure you have Node.js installed. [Download Node.js](https://nodejs.org/)
- **MongoDB**: Install MongoDB and ensure it's running on your machine. [Install MongoDB](https://www.mongodb.com/try/download/community)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/SagarBhoi404/Securepass-Password-Manager-Backend.git
   cd Securepass-Password-Manager-Backend

1. **Install Dependencies**
```bash
  npm install
```



3. **Configure the Application**:
  - Set Up Environment Variables Create a .env file in the root directory and add the following variables:

  ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
  ```

  
4. **Start the Server**:

  ```
    npm run dev
  ```

## API Endpoints

**Authentication**
  - POST /api/auth/register : Register a new user.
  - POST /api/auth/login : Log in an existing user.
  - GET /api/auth/user : Get details of the authenticated user.
  - PUT /api/auth/update-password : Update the password of the authenticated user.
  - PUT /api/auth/update-aeskey : Update the AES key for the authenticated user.


**Password Management**
 - POST /api/passwords : Add a new encrypted password.
 - GET /api/passwords : Get all stored passwords for the authenticated user.
 - POST /api/decrypt : decrypt a password.
 - PUT /api/passwords/ : Update an existing password.
 - DELETE /api/passwords/ : Delete a password.