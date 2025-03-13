# syntax=docker/dockerfile:1

# Use a specific Node.js version
ARG NODE_VERSION=20.6.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Set the working directory
WORKDIR /app

# Set the environment to production
ENV NODE_ENV="production"

# Throw-away build stage for installing dependencies
FROM base as build

# Install required system packages for building native modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Copy dependency files first to leverage Docker's caching mechanism
COPY package-lock.json package.json ./

# Install dependencies
RUN npm ci

# Copy the application source code
COPY . .

# Final production image
FROM base

# Copy the built application from the build stage
COPY --from=build /app /app

# Expose the port the app listens on
EXPOSE 8080

# Start the application
CMD [ "npm", "run", "start" ]
