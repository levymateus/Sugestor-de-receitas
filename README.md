# Instruções para teste local
    1. Primeiro faça o download do gerenciador de pacotes npm pelo link https://www.npmjs.com/get-npm e adicione o mesmo na variavel de ambiente do seu sistema operacional

    2. Com o npm instalado, abra um terminal e digite o seguinte comando: "npm install -g json-server". Para mais informações sobre o json-server acesso este link (https://www.npmjs.com/package/json-server)

    3. Com o pacote json-server instalado em sua máquina, vá até a pasta "/db" do projeto.

        - Dentro da pasta "db" fica o arquivo db.json. Este arquivo é a base de dados do projeto. Para rodar o servidor local com a base do projeto digite no terminal "json-server -d 3000 db.json".
    
    Após estes 3 passos o servidor json está criado. Para mais informações de como executar o json-server acesse o link: https://egghead.io/lessons/javascript-creating-demo-apis-with-json-server

    OBS: Caso seja necessario roda o servidor em outra porta abra o arquivo main.js e altere o valor da variável port. Após isso execute o comando json-server -d <porta> db.json na pasta "/db".
