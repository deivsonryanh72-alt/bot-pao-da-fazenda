const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

// Gera o QR Code no terminal/logs
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('\n[AgiBots] Escaneie o QR Code acima com o WhatsApp do teste!\n');
});

client.on('ready', () => {
    console.log('\n✅ AgiBots ativado! Robô da Pão da Fazenda pronto e rodando 24/7 na nuvem.\n');
});

// Respostas automáticas
client.on('message', async msg => {
    const texto = msg.body.trim().toLowerCase();

    // Menu Principal (oi, olá, boa tarde, menu ou 0)
    if (texto.includes('oi') || texto.includes('ola') || texto.includes('boa') || texto.includes('menu') || texto === '0') {
        const menu = 
`🥖 *Pão da Fazenda - Panificação Artesanal*
_Atendimento Rápido e Automático_

Olá! Seja muito bem-vindo(a) à Pão da Fazenda. Como podemos te ajudar hoje?

Digite apenas o *NÚMERO* da opção desejada:

1️⃣ - 🥖 Cardápio de Pães & Focaccias
2️⃣ - 🎂 Encomendas de Bolos & Tortas
3️⃣ - 🌐 Ver Nosso Site Oficial
4️⃣ - 📍 Endereço & Localização (Google Maps)
5️⃣ - 👤 Falar com Atendente no Balcão`;

        await msg.reply(menu);
    } 
    
    // Opção 1: Pães e Focaccias
    else if (texto === '1') {
        await msg.reply(
`🥖 *Destaques de Hoje na Pão da Fazenda:*

• Focaccia de Peito de Peru & Azeitonas
• Pão Francês Tradicional e Pão Caseiro
• Mini Pão de Queijo Quentinho
• Pão de Fôrma de Manteiga da Fazenda

*(Responda com o nome do item para verificar disponibilidade)*

_Digite *0* para voltar ao Menu Principal._`
        );
    } 

    // Opção 2: Encomendas
    else if (texto === '2') {
        await msg.reply(
`🎂 *Encomendas Especiais:*

Aceitamos encomendas de bolos recheados, tortas salgadas para festas e fatias do dia.

Para solicitar o catálogo de sabores ou fazer um orçamento customizado, digite *5* para falar direto com o balcão.

_Digite *0* para voltar ao Menu Principal._`
        );
    } 

    // Opção 3: Link do Site
    else if (texto === '3') {
        await msg.reply(
`🌐 *Acesse nosso site completo:*

Confira fotos em alta qualidade, avaliações dos clientes e história da nossa panificação:
👉 https://deivsonryanh72-alt.github.io/pao-da-fazenda-site/

_Digite *0* para voltar ao Menu Principal._`
        );
    } 

    // Opção 4: Localização e Maps
    else if (texto === '4') {
        await msg.reply(
`📍 *Venha nos visitar:*

*Endereço:* R. Alzira Barnabé, 407 - Jardim Belo Horizonte, Indaiatuba - SP
*Horário:* Aberto até às 21:00h

🗺️ *Clique no link para abrir no seu GPS/Google Maps:*
https://maps.google.com/?q=Rua+Alzira+Barnab%C3%A9,+407+-+Jardim+Belo+Horizonte,+Indaiatuba+-+SP

_Digite *0* para voltar ao Menu Principal._`
        );
    } 

    // Opção 5: Atendimento Humano
    else if (texto === '5') {
        await msg.reply(
`👤 *Atendimento do Balcão:*

Um de nossos atendentes foi notificado e já vai te responder em instantes! Por favor, aguarde só um momento.`
        );
    }
});

client.initialize();