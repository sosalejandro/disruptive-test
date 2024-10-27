# Use the official Node.js image
FROM node:18-alpine

# Set the UV_THREADPOOL_SIZE environment variable
ENV UV_THREADPOOL_SIZE=8

# Install bash and curl
RUN apk add --no-cache bash curl

# Install Yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# Clean up
RUN apk del curl

# Set environment variable for Yarn
ENV PATH /root/.yarn/bin:$PATH

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies (development mode)
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the Nest.js default port
EXPOSE 3000

# Start the application in development mode
CMD ["yarn", "start:dev"]
