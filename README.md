# API de Gerenciamento de Usuários

Projeto final da Unidade Curricular. API construída em NestJS para
gerenciamento completo de usuários, com autenticação JWT, guards, sessão,
banco de dados MySQL, integração com serviço externo de CEP (ViaCEP) e
documentação via Swagger.

## Tecnologias

- NestJS
- MySQL (mysql2/promise, queries SQL diretas, sem ORM)
- JWT (@nestjs/jwt)
- express-session
- bcrypt
- class-validator / class-transformer
- @nestjs/swagger
- @nestjs/axios (integração com ViaCEP)

## Estrutura

```
src/
├── app.module.ts
├── main.ts
├── auth/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.guard.ts
│   ├── decorators/public.decorator.ts
│   ├── dto/login.dto.ts
│   └── interface/session.d.ts
├── usuarios/
│   ├── usuarios.controller.ts
│   ├── usuarios.module.ts
│   ├── usuarios.service.ts
│   ├── dto/create-usuario.dto.ts
│   ├── dto/update-usuario.dto.ts
│   └── interface/usuario.interface.ts
├── endereco/
│   ├── endereco.controller.ts
│   ├── endereco.module.ts
│   └── endereco.service.ts
└── database/
    ├── database.module.ts
    └── database.service.ts
```

## Como executar

Pré-requisitos: Node.js 18+ e MySQL/MariaDB em execução.

```bash
npm install

cp .env.example .env
# edite o .env com as credenciais do seu banco

mysql -u root < sql/create_usuarios.sql

npm run start:dev
```

A aplicação sobe em `http://localhost:3000` por padrão.

## Documentação Swagger

```
http://localhost:3000/api/docs
```

## Endpoints

| Método | Rota             | Protegida | Descrição                              |
|--------|------------------|-----------|------------------------------------------|
| POST   | /usuarios        | Não       | Cadastro de usuário                     |
| POST   | /auth/login      | Não       | Login (retorna JWT e inicia a Session)  |
| GET    | /auth/session    | Sim       | Consulta dados da Session atual         |
| GET    | /usuarios        | Sim       | Lista todos os usuários                 |
| GET    | /usuarios/:id    | Sim       | Busca usuário por ID                    |
| PATCH  | /usuarios/:id    | Sim       | Atualiza usuário                        |
| DELETE | /usuarios/:id    | Sim       | Remove usuário                          |
| GET    | /endereco/:cep   | Não       | Consulta um endereço a partir do CEP    |

Rotas protegidas exigem o cabeçalho:

```
Authorization: Bearer <token_jwt>
```

## Fluxo de autenticação e Session

1. Cadastro em `POST /usuarios`.
2. Login em `POST /auth/login` com e-mail e senha.
3. A senha é comparada com o hash bcrypt armazenado; se válida, é gerado um
   token JWT e a Session é preenchida com nome, e-mail e data/hora do login.
4. O token deve ser enviado no header `Authorization: Bearer <token>` nas
   demais requisições.
5. `GET /auth/session` retorna os dados da Session atual.

Todas as rotas são protegidas por um `AuthGuard` global, exceto as marcadas
com o decorator `@Public()` (cadastro, login e consulta de CEP).

## Integração com ViaCEP

Ao cadastrar ou atualizar um usuário informando um CEP, a aplicação consulta
a API pública ViaCEP e preenche automaticamente rua, bairro, cidade e
estado. Cenários tratados:

- CEP em formato inválido: `400 Bad Request`
- CEP inexistente: `404 Not Found`
- Falha de comunicação com a API externa: `503 Service Unavailable`

## Banco de dados

Tabela `usuarios` (script completo em `sql/create_usuarios.sql`):

| Coluna          | Tipo         |
|-----------------|--------------|
| id              | INT (PK)     |
| nome            | VARCHAR(150) |
| email           | VARCHAR(150) unique |
| senha           | VARCHAR(255) hash bcrypt |
| telefone        | VARCHAR(20)  |
| cep             | VARCHAR(9)   |
| rua             | VARCHAR(150) |
| bairro          | VARCHAR(100) |
| cidade          | VARCHAR(100) |
| estado          | VARCHAR(2)   |
| profissao       | VARCHAR(100) |
| data_nascimento | DATE         |
| criado_em       | TIMESTAMP    |
| atualizado_em   | TIMESTAMP    |
