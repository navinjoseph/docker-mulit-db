FROM node:10-alpine

WORKDIR /app

RUN npm install -g nodemon

COPY package.json /app/package.json
RUN npm install && npm ls
RUN mv /app/node_modules /node_modules

COPY . /app

CMD ["npm", "start"]