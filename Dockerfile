FROM node:16.13.0-slim
WORKDIR /code
COPY package.json .
COPY package-lock.json .
COPY jsconfig.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
