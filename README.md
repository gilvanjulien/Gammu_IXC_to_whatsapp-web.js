# Gammu_IXC_to_whatsapp-web.js
Esse código busca ajudar empresas que utilizam o software IXC Soft a enviar boletos ou cobranças por Whatsapp não oficial, visando ajudar seus clientes a receberem aviso sobre suas faturas.

Existem algumas serviços pagos que realizam este mesmo serviço, mas nossa empresa começou a sofrer com o suporte técnico um das empresas que prestava esse serviço de forma paga. 

Esse script busca ser uma alternativa para solucionar o problema de envio de mensagens do Gammu para o Whatsapp Bussines de forma não oficial da Meta.

Provavelmente outros provedores de internet podem estar passando pelo mesmo problema, por isso decidi compartilhar a solução aqui para tentar ajudar outras empresas a não passarem pelo mesmo problema.

Esse script não substitui números oficiais da Meta e sim tem o objetivo de complementar os atendimentos de clientes.

Como o programa funciona:

Com acesso SSH ao servidor escanei o QR Code com celular instalado o Whatsapp Business no servidor Ubuntu Server
Já no IXC Soft em Relatórios -> Relatórios financeiros -> Relatórios de Saída -> Emissão de boletos
Seleciona a carteira de cobrança desejada, o período desejado, utilize o botão "Enviar SMS".
O clientes começam receber as mensagens de cobrança pelo Whatsapp Business como se fosse uma pessoa entrando em contato.
O envio está programando para realizar entre 15 e 30 segundos para evitar que o número de Whatsapp seja banido.
OBS.: A sugestão é deixar algum colaborador a companhando a cobrança e respondendo os clientes que responderem.



Pré-requisitos

- Sistema operacional: Ubuntu Server 24.04.1 LTS
- Computador/Servidor: Com processador de 64 bits, 4GB de RAM e pelo menos 40GB de espaço em disco livre. Processador dual-core de, no mínimo, 2 GHz (Recomendável aplicar 4 cores caso seja virtualizado).
- Conexão com a internet:  Uma conexão com a internet ativa e uma faixa de IP que o servidor do IXC Soft consiga enxergar o servidor, podendo ser um IP Privado ou Público. OBS.: Caso utilize IP Público é necessário aplicar algumas configurações de segurança no servidor Linux.
- Celular com Whatsapp Bussiness instalado e um número de Whatsapp já configurado
- Ter aquecido o número de Whatsapp por pelo menos 1 semana


1º Passo - Instalar o Ubuntu Server 24.04LTS:
Instale o servidor Ubuntu Server 24.04 LTS e realize todas as atualizações.
Caso tenha alguma dúvida de como realizar a instalação, você pode consultar os vídeos abaixo:

https://www.youtube.com/watch?v=ehn8sgyH8mo
https://www.youtube.com/watch?v=n7aEcfDNULc
https://www.youtube.com/watch?v=r1DCX_VPnM0
https://www.youtube.com/watch?v=p4f6a_-yM_8
https://www.youtube.com/watch?v=WO3kgy7HwBY

2º Passo - Acessar o Ubuntu Server 24.04LTS via SSH

Você pode usar Putty para acessar o servidor, se estiver utilizando Windows 10 ou Windows 11 pode utilizar o próprio ssh nativo do Windows também.
Caso tenha alguma dúvida de como utilizar SSH segue o vídeo abaixo:

https://www.youtube.com/watch?v=lzmcO6W-t78
https://www.youtube.com/watch?v=Whh1LSr4zXg

3º Passo - Baixar e instalar o Node.JS

Mude privilégio de root:

sudo su

Baixe a versão LTS mais recente do Node.js

curl -o- <https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh> | bash

OBS.: consulte no site https://nodejs.org/ qual a versão LTS mais atualizada compatível com Linux usando nvm

Depois é necessário realizar alguns comandos para terminar de configurar a instalação.

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" 
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

source ~/.bashrc
nvm install 20

4º Passo - Criar a pasta onde o código irá funcionar e preparala para o ambiente Node

Ainda com o privilégio de root use o comando:

mkdir GammuIXC
cd GammuIXC
npm init -y


5º Passo - Instalar dependências do Ubuntu para que o código funcione normalmente:

sudo apt install -y libgbm-dev libasound2t64 libatk1.0-0t64 libc6 libcairo2 libcups2t64 libdbus-1-3 libexpat1 libfontconfig1 libgcc-s1 libgdk-pixbuf2.0-0 libglib2.0-0t64 libgtk-3-0t64 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libnss3 lsb-release xdg-utils wget

sudo apt-get install -y libatk1.0-0 libatk-bridge2.0-0 libcups2 libgbm1 libglib2.0-0

sudo apt install -y chromium-browser

apt-get install -y libgtk2.0-0t64 libnotify-dev xauth xvfb


6º Passo - Instalar dependências do Node para o código funcionar

Ainda na pasta GammuIXC e com privilécio de root

npm install whatsapp-web.js

npm install qrcode-terminal

npm install puppeteer-core

npm install express

npm install puppeteer

npm install http

npm install fs

npm install body-parser

npm install pm2 -g


7º Passo - Copiar o código para dentro da pasta GammuIXC

Ainda dentro da pasta GammuIXC, com privilégio de root e acessando por ssh utilize o comando

vi app.js

Em seguida cole o código que está no repositório do Github


8ª Passo - Iniciar o programa em segundo plano.

É possível realizar testes com o código estando na pasta GammuIXC utilizando o comando:

node app.js

Mas se você fechar o acesso por SSH o programa será interrompido, outro problema é que o QR Code não gera corretamente se você acessar o servidor diretamente pelo terminal.

Então é necessário executar o programa em segundo plano com o comando:

Exemplo:
pm2 start /caminho/para/seu/arquivo/app.js
ou
pm2 start /home/provedor/GammuIXC/app.js

Note que o caminho depende de como você configurou seu servidor linux

No 2º exemplo a palavra "provedor" é o nome do usuário que se chama provedor, nesse caso se você criou o nome do usuário do Ubuntu server com outro nome você deve alterar para o nome do usuário do ubuntu.

9º Passo - Escanear o QRCode do Whatsapp via SSH

Após iniciar o código em segundo plano é necessário escaner o QR Code e para isso você pode usar comando 

pm2 logs 0

ou 

pm2 logs app.js

Esse comando irá mostrar o log do que está ocorrendo na execução do código.

Se tudo estiver certo a mensagem: "Cliente WhatsApp está pronto para enviar mensagem!" irá aparecer na tela

Após escanear corretamente o QR Code no aparelho celular defina um nome para o servidor

9º Passo - Configurar servidor no IXC

Durante a instalação do servidor provavelmente você configurou o IP do servidor.
O servidor do IXCSoft deve conseguir enxergar o IP desse servidor

Siga os primeiros passos que consta no próprio site da IXC Soft

https://wiki.ixcsoft.com.br/pt-br/Integracoes/gateway_SMS/Gammu

Configurações -> Integrações -> Gateway SMS -> Novo

Preencha o campo da seguinte forma:

Gateway = Gammu
Descrição = SERVIDOR IXC TO WHATSAPP WEB
Usuário =  <Por padrão o usuário no código é essa, mas você pode alterar no código e na configuração do IXC Soft>
Senha = <Por padrão a senha no código é essa, mas você pode alterar no código e na configuração do IXC Soft>
Url = <IP do servidor ubuntu 24.04LTS>
Adicionar mensagens à fila = Não
Utilizar shortcode = Deixar desmarcado
Quant. máxima de caracteres: 99999


Clique em salvar em salvar.

10º Passo - Enviar mensagem de Teste

Preencha os campos:

Número de celular do destinatário = Seu próprio número de celular
Mensagem de teste = Teste de envio

E em seguida, pressione o botão "Enviar teste"

11º Configurar "SMS para envios de boletos" no IXC Soft

Você deve configurar o parâmetro de envio de boletos no IXC Soft.

Você pode seguir essa documentação aqui:
https://wiki.ixcsoft.com.br/pt-br/Hotsite/Central/enviar_fatura_por_sms

Configurações -> Parâmetros -> Parâmetros financeiro -> Geral

Abra configuração no campo "SMS para envio de boletos"

Selecione no campo "Gateway SMS" a configuração do servidor.

Um exemplo para cobrança pode ser:
"Oi, cliente: Não identificamos o pagamento da sua fatura, número: #areceber_numero# com vencimento no dia #areceber_data_vencimento#. Se já pagou, desconsidere. Para mais informações, entre em contato por Whatsapp ou ligação para o número de contato. Obrigado!"

Clique em salvar.

PRONTO O CÓDIGO ESTÁ CONFIGURADO


Você pode enviar seus disparos de cobrança em 

Relatórios -> Relatórios financeiros -> Relatórios de Saída -> Emissão de boletos

Selecione a carteira

Preencha os campos "Data de vencimento inicial" e "Data de vencimento final" que indica a data que você deseja cobrar

Certifique-se que o campo "Status dos títulos" esteja selecionado apenas "Abertos".

Você pode ver a lista de clientes que será cobrando nessa mesma tela no botão Listar faturas -> Padrão

Se estiver tudo certo você pode selecionar o botão "Enviar por SMS"


PARA MAIORES DÚVIDAS ESTOU À DISPOSIÇÃO

Você pode saber mais sobre a documentação do WhatsappWeb.js aqui:
https://github.com/pedroslopez/whatsapp-web.js






