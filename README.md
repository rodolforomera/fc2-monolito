# Monolito

Exemplo simples de um monolitico utilizando *Typescript, SQLite3 e Express* conforme o curso **Full Cycle**

Estrutura criada seguindo os conceitos de Clean Architecture e DDD. Realizando comunicação entre modulos atraves de Facades.
Uma vez que o foco é a comunicação as entidades estão anemicas e sem validações para manter a simplicidade.

## Tests

```
npm test
```

## SQLite e migrations (Sequelize e Umzug)

Rodar esses comandos para criar o banco
```
install sqlite3
node migrate up
```

## Express

```
npm run dev
````
