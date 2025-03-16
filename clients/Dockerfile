# Use Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /clients

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all files
COPY . .

# Expose port 3000
EXPOSE 3000

ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true

# Start the frontend app
CMD npm start
