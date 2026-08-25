FROM ghcr.io/puppeteer/puppeteer:21

USER root

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 10000

CMD ["node", "bot.js"]