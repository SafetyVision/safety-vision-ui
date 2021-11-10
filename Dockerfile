FROM node:16.13.0-slim
WORKDIR /code
COPY . /code/
COPY package.json /code/
RUN npm install
RUN npm run build
