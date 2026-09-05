# Sistema de Reservas

API REST desenvolvida em NestJS para gerenciamento de usuários, autenticação, endereços e localização geográfica.

> O repositório está sendo usado como projeto principal de backend. O domínio de reservas propriamente dito ainda não possui uma implementação de negócio neste código-base; por isso, esta consolidação não cria módulos ou regras fictícias de reservas.

## Funcionalidades

- Cadastro de usuários
- Validação dos dados de entrada
- E-mail único
- Senha protegida com bcrypt
- Login com JWT
- Proteção global das rotas com Guard
- Sessão com `express-session`
- CRUD de usuários
- Consulta de endereço por CEP
- Preenchimento de endereço usando ViaCEP
- Consulta de latitude e longitude por cidade usando Open-Meteo
- Documentação da API com Swagger
- Banco MySQL usando `mysql2/promise` e SQL direto

## Tecnologias

- NestJS 11
- TypeScript
- MySQL
- mysql2
- JWT
- bcrypt
- express-session
- Axios / @nestjs/axios
- class-validator
- class-transformer
- Swagger

## Estrutura

```text
Sistema_de_reservas/
├── src/
│   ├── auth/
│   │   ├── decorators/
│   │   │   └── public.decorator.ts
│   │   ├── dto/
│   │   │   └── login.dto.ts
│   │   ├── interface/
│   │   │   └── session.d.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.guard.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── database/
│   │   ├── database.module.ts
│   │   └── database.service.ts
│   ├── endereco/
│   │   ├── endereco.controller.ts
│   │   ├── endereco.module.ts
│   │   └── endereco.service.ts
│   ├── usuarios/
│   │   ├── dto/
│   │   │   ├── create-usuario.dto.ts
│   │   │   └── update-usuario.dto.ts
│   │   ├── interface/
│   │   │   └── usuario.interface.ts
│   │   ├── usuarios.controller.ts
│   │   ├── usuarios.module.ts
│   │   └── usuarios.service.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   └── main.ts
├── sql/
│   └── create_usuarios.sql
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

## Instalação

```bash
npm install
```

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

No Windows, também é possível criar o arquivo manualmente copiando `.env.example` para `.env`.

Configure as credenciais do MySQL no `.env`.

## Banco de dados

Execute:

```bash
mysql -u root -p < sql/create_usuarios.sql
```

O script cria o banco `sistema_reservas` e a tabela `usuarios`.

## Executar

Desenvolvimento:

```bash
npm run start:dev
```

Produção:

```bash
npm run build
npm run start:prod
```

A API utiliza a porta `3000` por padrão.

## Swagger

Depois de iniciar a aplicação:

```text
http://localhost:3000/api/docs
```

O Swagger permite testar os endpoints e enviar o JWT pelo botão **Authorize**.

## Autenticação

Primeiro faça o cadastro:

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

Depois faça login:

```http
POST /auth/login
Content-Type: application/json

{
  "email": "maria@email.com",
  "senha": "123456"
}
```

Use o valor de `access_token` retornado:

```http
Authorization: Bearer <access_token>
```

## Endpoints

| Método | Rota | Proteção | Descrição |
|---|---|---|---|
| GET | `/` | Pública | Status da API |
| POST | `/usuarios` | Pública | Cadastrar usuário |
| GET | `/usuarios` | JWT | Listar usuários |
| GET | `/usuarios/:id` | JWT | Buscar usuário |
| PATCH | `/usuarios/:id` | JWT | Atualizar usuário |
| DELETE | `/usuarios/:id` | JWT | Remover usuário |
| POST | `/auth/login` | Pública | Autenticar usuário |
| GET | `/auth/session` | JWT | Consultar sessão |
| GET | `/endereco/:cep` | JWT | Consultar endereço |
| GET | `/endereco/:cep/coordenadas` | JWT | Consultar endereço e coordenadas |

## Regras de negócio

1. Todos os campos obrigatórios são validados.
2. O e-mail deve possuir formato válido.
3. O e-mail não pode ser duplicado.
4. A senha deve possuir pelo menos 6 caracteres no cadastro.
5. A senha nunca é retornada nas consultas de usuários.
6. A senha é armazenada utilizando hash bcrypt.
7. O CEP precisa conter 8 números, podendo ser informado com ou sem hífen.
8. O cadastro consulta o ViaCEP para obter o endereço.
9. CEP inexistente retorna `404`.
10. CEP inválido retorna `400`.
11. Falha no serviço externo de CEP retorna `503`.
12. As rotas privadas exigem JWT válido.
13. Atualização de CEP consulta novamente o ViaCEP e atualiza os dados de endereço.
14. A consulta de coordenadas utiliza a cidade retornada pelo CEP e o serviço de geocodificação do Open-Meteo.

## Variáveis de ambiente

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=sistema_reservas
JWT_SECRET=altere-esta-chave
JWT_EXPIRES_IN=1d
SESSION_SECRET=altere-este-segredo
```

Nunca publique o `.env` real no GitHub.

## Próxima evolução

O próximo passo natural é implementar o domínio real de reservas, com entidades como reserva, recurso/serviço e disponibilidade, relacionando essas tabelas ao usuário existente. Essa etapa deve ser feita somente quando as regras de negócio de reservas estiverem definidas.
