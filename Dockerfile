FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 10000

CMD ["node", "--max-old-space-size=256", "bot.js"]