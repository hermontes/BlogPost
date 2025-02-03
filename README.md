# BlogPost

A full-stack blogging application with a **Node.js + Express + MongoDB** backend and a **React.js** frontend.

## Getting Started

### Prerequisites  
Ensure you have the following installed on your machine:  
- **Node.js** (v16 or later)  
- **npm** (Node Package Manager)  
- **MongoDB Atlas** (or a local MongoDB instance)  

## API Endpoints
### Posts
Create a Post – POST /createContent

Get All Posts – GET /getContent
### Comments
Add a Comment – PUT /makeComment

Update Like Count – PUT /updateLike

Update Dislike Count – PUT /updateDislike

## Project Structure

```bash
BlogPost/
│── client/          # Frontend (React)
│── server/          # Backend (Node.js, Express, MongoDB)
│── models/          # Mongoose Schemas
│── package.json     # Project metadata
│── README.md        # Documentation
│── .gitignore       # Git ignored files

## Installation & Setup  

### 1. Clone the Repository  
```bash
git clone https://github.com/hermontes/BlogPost.git
cd BlogPost
```

### 2. Backend Setup (Server)
Navigate to the server/ directory and install dependencies:

```bash
cd server
npm install
```

Start the backend server:

```bash
npm run serverStart
```
The backend should now be running on http://localhost:3001.


### 3. Frontend Setup (Client)
Navigate to the client/ directory and install dependencies:

```bash
cd ../client
npm install
```

Start the frontend:

```bash
npm start
```


