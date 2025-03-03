# BlogPost

A full-stack blogging application with a **Node.js + Express + MongoDB** backend and a **React.js** frontend.

## Getting Started

### Prerequisites  
Ensure you have the following installed on your machine:  
- **Node.js** (v16 or later)  
- **npm** (Node Package Manager)  
- **MongoDB Atlas** (or a local MongoDB instance)  

## Installation & Setup  

### 1. Clone the Repository  

git clone https://github.com/hermontes/BlogPost.git
```bash
cd BlogPost
```

### 2. Run Docker

```bash
cd server/
docker compose up --build
```

### 3. Run the app in the browser

The frontend will be up and running on http://localhost:3000/. Enjoy creating blogs/reviews!

Backend (API): http://localhost:3001

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
```

