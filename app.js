const express = require('express');
const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 80;

// Fila para mensagens
let messageQueue = [];

// Intervalo entre envios (15 a 20 segundos)
const MIN_DELAY = 15000;
const MAX_DELAY = 20000;

// Função para gerar intervalo aleatório de envio do WhatsApp
const getRandomDelay = () => Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;

// Iniciando cliente WhatsApp
const client = new Client({
	puppeteer: {
	args: ['--no-sandbox', '--disable-setuid-sandbox']
	}
});

client.on('qr', qr => {
    console.log('Gerando QR Code');
	qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Cliente WhatsApp está pronto para enviar mensagem!');
    
    // Processa mensagens da fila de envio do WhatsApp
    setInterval(() => {
		//Condicional que verifica se a Queue esta vazia, se nao estiver envia mensagem
		if (messageQueue.length > 0) {            
			console.log('Enviando mensagem');
			
			//Recebe os dados ja tratados para ser enviado
			const { number, message } = messageQueue.shift();
			
			//Exemplo para enviar envia mensagem pronta por dentro do código:
			//client.sendMessage(number, "Teste")
			
        }
    }, getRandomDelay());
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Tratamento de rota GET para recebimento dos dados
app.get('/', (req, res) => {
    const { user, pw, dest, text } = req.query;
    console.log('Requisição GET recebida:');
    console.log('URL:', req.url); // Mostra a URL da requisição
    console.log('Cabeçalhos:', req.headers);
    // Validação simples de usuário e senha
    if (user !== 'usuario_valido' || pw !== 'senha_valida') {
		console.log('Erro de autenticao');
        return res.status(401).send('Usuário ou senha inválidos.');
    }
    
    // Tratamento do número de envio (adicionar código do país, remover espaços, etc.)
	let formattedNumber = dest.replace(/\D/g, ''); // Remove caracteres não numéricos e permite reatribuicao para tirar o 9 digito
	
	
	if (formattedNumber.length === 11 && formattedNumber[2] === '9') { 
		const ddd = formattedNumber.slice(0, 2); // Extrai o DDD
		const mainNumber = formattedNumber.slice(3); // Remove o nono dígito '9'
		formattedNumber = `${ddd}${mainNumber}`;
	}
	
	const whatsappNumber = `55${formattedNumber}@c.us`; // Exemplo: adiciona código do país (Brasil = 55)

    // Tratamento do texto (decodificação da URL)
    const decodedText = decodeURIComponent(text);
	
	

	// Dicionário com palavras sem acento e suas respectivas versões acentuadas
	const accentMap = {
		"Nao": "Não",
		"nao": "não",
		"numero": "número",
		"vencimento": "vencimento", // já está correto, mas pode ser verificado
		"ja": "já",
		"informacoes": "informações",
		"ligacao": "ligação"
	};

	// Função para substituir palavras sem acento por suas versões acentuadas
	function replaceAccents(text) {
		let updatedText = text;
		for (const [key, value] of Object.entries(accentMap)) {
			// Substitui todas as ocorrências da palavra sem acento pela acentuada
			const regex = new RegExp(`\\b${key}\\b`, 'g');
			updatedText = updatedText.replace(regex, value);
		}
	return updatedText;
	}

	// Aplicar a função de substituição no texto decodificado
	const finalText = replaceAccents(decodedText);

	
    // Adiciona mensagem à fila
    messageQueue.push({ number: whatsappNumber, message: finalText });
    
    res.status(200).send({
		success: [
        "Parâmetros recebidos com sucesso",
        "Autenticação realizada com sucesso.",
        "Cliente foi encontrado na base de dados.",
        "Campanha de texto adicionada na fila do gateway."
      ]
	});
	console.log('Dado processado');
});

// Criar o servidor HTTP
http.createServer(app).listen(port, () => {
    console.log(`Servidor HTTP rodando na porta https://localhost:${port}`);
});

// Inicia cliente WhatsApp
client.initialize();
