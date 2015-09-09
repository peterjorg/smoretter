FROM node:latest

# Create the /src folder inside of the container
RUN mkdir /src

# Install nodemon. 
RUN npm install -g nodemon 

# Set the working (current) directory to /src
WORKDIR /src/DemoApp

# Expose the port 3000 (this is where our NodeJS server runs.)
EXPOSE 3000

# Run nodemon to monitor for app changes. 
CMD nodemon app.js 