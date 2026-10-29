# Stage 1: Build React/Vite application node-18 for docker mostly used
FROM node:22 AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies 
RUN npm install

# Copy frontend source code
COPY . .

# Vite environment variable
ARG VITE_SERVER_BASE_URL
ENV VITE_SERVER_BASE_URL=$VITE_SERVER_BASE_URL

# here we have use build for production server 
RUN npm run build


# Stage 2: Serve using Nginx
FROM nginx:alpine

# Copy React app build files and put it into Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx port
EXPOSE 80

# Start Nginx and command to run 
CMD ["nginx", "-g", "daemon off;"] 