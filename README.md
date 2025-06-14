 
## Criação de uma API REST - Sem utilizar bibliotecas externas.

### Sobre

#### Este projeto está organizado em duas pastas:
* Primeira pasta: Reúne meus estudos realizados durante o curso.
* Segunda pasta: Contém um desafio proposto pelos instrutores. Este projeto é uma API RESTful desenvolvida com Node.js e Fastify, como parte de um desafio para consolidar os fundamentos do back-end. A aplicação permite o cadastro de usuários, criação e gerenciamento de refeições, além de gerar métricas alimentares com base no desempenho do usuário.

* Entre os principais aprendizados e práticas aplicadas, destacam-se:

    *  Estrutura modular de rotas, middlewares e banco de dados;
     *  Uso do Fastify para alto desempenho em APIs;
     *  Controle de sessão via cookies (sessionId);
     *  Persistência de dados com SQLite e Knex.js;
     *  Validação dos dados utilizando zod;
     *  Testes automatizados com Vitest e Supertest;
     *  Rotas para listagem, detalhamento, edição e métricas de refeições.


## Tecnologia usadas

- Node.js 22.14
- fastify 5.3.3
- @fastify/cookie 11.0.2
- typescript 5.8.3
- Knex 3.1.0
- zod 3.25.48
- sqlite3 5.1.7
- eslint 8.57.1
- tsx 4.19.4
- supertest 7.1.1
- vitest 3.2.2

## Execução do projeto

**Requer o NODE (npm) e o GIT instalado!**
~~~javascript
 1. git clone https://github.com/wwilliamsantana/nodejs-fundamentals-api.git
 2. cd .\nodejs-fundamentals-api\
 3. npm install
 4. npm run knex migrate:latest
 4. npm  run dev
~~~~

### ROTAS

## /users

#### GET - /users
> * Return USERS.
> * Retorno de todos os usuários.


#### POST - /users
> * RETURN - HTTP Status 201 <br>
> * Criação do usuário via json -> Name e Age.

## /users/meals

#### POST - /users/meals
> * RETURN - HTTP Status 201
> * Criação de uma alimentação via json -> Name, description e this_diet.
> * Precisa possuir um cookie válido do usuário.

#### GET - /users/meals
> * RETURN - HTTP Status 200
> * Retorno de todas as refeições.
> * Precisa possuir um cookie válido do usuário.

#### GET - /users/meals/:id
> * RETURN - HTTP Status 200
> * Retorno de uma refeição.
> * Precisa possuir um cookie válido do usuário.

#### PATCH - /users/meals/:id
> * RETURN HTTP Status 200
> * Faz update de alguns campos caso seja inserido, como name, description e this_diet.
> * Precisa possuir um cookie válido do usuário.

#### DELETE - /users/meals/:id
> * RETURN - HTTP Status 200
> * Deleta uma refeição
> * Precisa possuir um cookie válido do usuário.

## /metrics

#### GET - /users/metrics
> * RETURN - HTTP Status 200
> * Retorno de algumas métricas do usuário - Quantidade de refeição, quantidade de refeição que está dentro da dieta, quantidade que está fora da dieta e a melhor sequência dentro da dieta feita. <br>
> * Precisa possuir um cookie válido do usuário.



