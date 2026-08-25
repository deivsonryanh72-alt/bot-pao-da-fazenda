FROM node:18-slim

# Instala o git para permitir o download das dependencias do Baileys
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev --omit=optional

COPY . .

EXPOSE 10000

CMD ["node", "--max-old-space-size=256", "bot.js"]