FROM node:16.13.0-slim
WORKDIR /code
COPY package*.json /code/
COPY . /code/
