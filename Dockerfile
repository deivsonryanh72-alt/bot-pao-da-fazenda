FROM node:18-slim

# Instala dependências nativas para compilação do Baileys e C++
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 10000

CMD ["node", "--max-old-space-size=256", "bot.js"]