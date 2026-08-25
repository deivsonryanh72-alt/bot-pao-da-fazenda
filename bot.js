const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const http = require('http');
const pino = require('pino');
const fs = require('fs');

// Servidor HTTP para satisfazer a porta do Render
const PORT = process.env.PORT || 10000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('AgiBots - Bot Pao da Fazenda On-line!\n');
}).listen(PORT, () => {
    console.log(`[AgiBots] Servidor HTTP rodando na porta ${PORT}`);
});

process.on('uncaughtException', (err) => {
    console.error('[AgiBots Aviso]:', err.message);
});

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        downloadHistory: false,
        syncFullHistory: false,
        markOnlineOnConnect: false,
        generateHighQualityLinkPreview: false,
        browser: ['AgiBots', 'Chrome', '1.0.0']
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('\n================ ESCANEIE O QR CODE ================');
            qrcode.generate(qr, { small: true });
            console.log('===================================================');
            console.log('STRING DO QR (se nao visualizar a imagem acima):');
            console.log(qr);
            console.log('===================================================\n');
        }

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            console.log(`[AgiBots] Conexão fechada (${statusCode}). Reconectando...`);
            
            // Se for erro de logoff ou sessão corrompida, limpa a pasta de auth
            if (statusCode === DisconnectReason.loggedOut) {
                if (fs.existsSync('auth_info_baileys')) {
                    fs.rmSync('auth_info_baileys', { recursive: true, force: true });
                }
            }
            startBot();
        } else if (connection === 'open') {
            console.log('\n✅ AgiBots ativado! Robô da Pão da Fazenda pronto e rodando 24/7 na nuvem.\n');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        for (const msg of messages) {
            if (!msg.message || msg.key.fromMe) continue;

            const from = msg.key.remoteJid;
            const text = (
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text ||
                ''
            ).trim().toLowerCase();

            console.log(`[Mensagem Recebida de ${from}]: ${text}`);

            // Menu Principal
            if (text.includes('oi') || text.includes('ola') || text.includes('boa') || text.includes('menu') || text === '0') {
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

                await sock.sendMessage(from, { text: menu });
            } 
            else if (text === '1') {
                await sock.sendMessage(from, { text: 
`🥖 *Destaques de Hoje na Pão da Fazenda:*

• Focaccia de Peito de Peru & Azeitonas
• Pão Francês Tradicional e Pão Caseiro
• Mini Pão de Queijo Quentinho
• Pão de Fôrma de Manteiga da Fazenda

*(Responda com o nome do item para verificar disponibilidade)*

_Digite *0* para voltar ao Menu Principal._` });
            } 
            else if (text === '2') {
                await sock.sendMessage(from, { text: 
`🎂 *Encomendas Especiais:*

Aceitamos encomendas de bolos recheados, tortas salgadas para festas e fatias do dia.

Para solicitar o catálogo de sabores ou fazer um orçamento customizado, digite *5* para falar direto com o balcão.

_Digite *0* para voltar ao Menu Principal._` });
            } 
            else if (text === '3') {
                await sock.sendMessage(from, { text: 
`🌐 *Acesse nosso site completo:*

Confira fotos em alta qualidade, avaliações dos clientes e história da nossa panificação:
👉 https://deivsonryanh72-alt.github.io/pao-da-fazenda-site/

_Digite *0* para voltar ao Menu Principal._` });
            } 
            else if (text === '4') {
                await sock.sendMessage(from, { text: 
`📍 *Venha nos visitar:*

*Endereço:* R. Alzira Barnabé, 407 - Jardim Belo Horizonte, Indaiatuba - SP
*Horário:* Aberto até às 21:00h

🗺️ *Clique no link para abrir no seu GPS/Google Maps:*
https://maps.google.com/?q=Rua+Alzira+Barnab%C3%A9,+407+-+Jardim+Belo+Horizonte,+Indaiatuba+-+SP

_Digite *0* para voltar ao Menu Principal._` });
            } 
            else if (text === '5') {
                await sock.sendMessage(from, { text: 
`👤 *Atendimento do Balcão:*

Um de nossos atendentes foi notificado e já vai te responder em instantes! Por favor, aguarde só um momento.` });
            }
        }
    });
}

startBot();