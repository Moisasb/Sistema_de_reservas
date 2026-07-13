# Sistema de Reservas

API construída em NestJS para o Sistema de Reservas, com autenticação JWT,
guards, sessão, banco de dados MySQL, integração com serviço externo de CEP
(ViaCEP) e documentação via Swagger.

## Objetivo

A aplicação permite o gerenciamento completo de usuários, incluindo cadastro,
consulta, atualização, remoção, login com JWT, proteção de rotas e consulta de
sessão.

## Tecnologias

- NestJS
- MySQL (mysql2/promise, queries SQL diretas, sem ORM)
- JWT (@nestjs/jwt)
- express-session
- bcrypt
- class-validator / class-transformer
- @nestjs/swagger
- @nestjs/axios (integração com ViaCEP)

## Estrutura do projeto

```text
src/
├── app.module.ts
├── app.controller.ts
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

A aplicação sobe em http://localhost:3000 por padrão.

## Variáveis de ambiente

Exemplo em `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=sistema_reservas
JWT_SECRET=senha_secreta
JWT_EXPIRES_IN=1d
SESSION_SECRET=senha_secreta
```

## Documentação Swagger

Acesse:

```text
http://localhost:3000/api/docs
```

## Endpoints principais

| Método | Rota | Protegida | Descrição |
|--------|------|-----------|-----------|
| POST | /usuarios | Não | Cadastro de usuário |
| POST | /auth/login | Não | Login e geração de JWT |
| GET | /auth/session | Sim | Consulta dados da sessão atual |
| GET | /usuarios | Sim | Lista todos os usuários |
| GET | /usuarios/:id | Sim | Busca usuário por ID |
| PATCH | /usuarios/:id | Sim | Atualiza usuário |
| DELETE | /usuarios/:id | Sim | Remove usuário |
| GET | /endereco/:cep | Sim | Consulta um endereço a partir do CEP |
| GET | / | Não | Status da API |

Rotas protegidas exigem o cabeçalho:

```http
Authorization: Bearer <token_jwt>
```

## Fluxo de uso

1. Cadastre um usuário em `POST /usuarios`.
2. Faça login em `POST /auth/login`.
3. Utilize o token retornado no header `Authorization: Bearer <token>`.
4. Consulte a sessão em `GET /auth/session`.

## Exemplo de uso

### 1. Cadastrar usuário

```http
POST /usuarios
Content-Type: application/json

{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "senha": "123456",
  "telefone": "11999999999",
  "cep": "01001-000",
  "profissao": "Desenvolvedora",
  "data_nascimento": "1998-04-29"
}
```

### 2. Fazer login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "maria@email.com",
  "senha": "123456"
}
```

### 3. Consultar sessão

```http
GET /auth/session
Authorization: Bearer <token_jwt>
```

## Regras de negócio

- Todos os campos obrigatórios são validados.
- O e-mail não pode ser duplicado.
- A senha é armazenada com hash bcrypt.
- O CEP é consultado na API ViaCEP para preencher automaticamente rua, bairro, cidade e estado.

## Integração com ViaCEP

Ao cadastrar ou atualizar um usuário informando um CEP, a aplicação consulta a API pública ViaCEP e preenche automaticamente os campos de endereço. Cenários tratados:

- CEP inválido: retorna erro 400
- CEP inexistente: retorna erro 404
- Falha de comunicação: retorna erro 503

## Banco de dados

Tabela `usuarios` (script completo em `sql/create_usuarios.sql`):

| Coluna | Tipo |
|--------|------|
| id | INT (PK) |
| nome | VARCHAR(150) |
| email | VARCHAR(150) unique |
| senha | VARCHAR(255) |
| telefone | VARCHAR(20) |
| cep | VARCHAR(9) |
| rua | VARCHAR(150) |
| bairro | VARCHAR(100) |
| cidade | VARCHAR(100) |
| estado | VARCHAR(2) |
| profissao | VARCHAR(100) |
| data_nascimento | DATE |
| criado_em | TIMESTAMP |
| atualizado_em | TIMESTAMP |
