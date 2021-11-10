FROM node:16.13.0-slim
WORKDIR /code
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
