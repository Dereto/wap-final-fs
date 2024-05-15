# Use official Node.js image as base
FROM node:alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining application files to working directory
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["node", "server.js"]
