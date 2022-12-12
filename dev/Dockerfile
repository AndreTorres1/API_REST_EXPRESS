FROM node:18.12.1-slim

WORKDIR /usr/src/app

RUN npm install -g npm@9.2.0
RUN npm install -g nodemon
RUN npm install -g mocha

CMD [ "npm", "start" ]

EXPOSE 3000
EXPOSE 4000
