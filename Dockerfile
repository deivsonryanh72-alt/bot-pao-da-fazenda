FROM node:18-slim

WORKDIR /usr/src/app

COPY package*.json ./
# Ignora dependencias opcionais para nao tentar compilar C++ no Render
RUN npm install --production --no-optional

COPY . .

EXPOSE 10000

CMD ["node", "--max-old-space-size=256", "bot.js"]