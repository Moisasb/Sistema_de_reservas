# Sistema de Reservas

API REST desenvolvida em NestJS para gerenciamento de usuários, autenticação, endereços, localização geográfica e reservas.

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
- Integração com ViaCEP
- Consulta de latitude e longitude por cidade usando Open-Meteo
- Criação e consulta de reservas
- Atualização de reservas
- Cancelamento de reservas
- Relacionamento entre usuários e reservas
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
│   ├── reservas/
│   │   ├── dto/
│   │   │   ├── create-reserva.dto.ts
│   │   │   └── update-reserva.dto.ts
│   │   ├── interface/
│   │   │   └── reserva.interface.ts
│   │   ├── reservas.controller.ts
│   │   ├── reservas.module.ts
│   │   └── reservas.service.ts
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

Crie o arquivo `.env` a partir do exemplo e configure as credenciais do MySQL.

```bash
cp .env.example .env
```

## Banco de dados

Execute:

```bash
mysql -u root -p < sql/create_usuarios.sql
```

O script cria o banco `sistema_reservas`, a tabela `usuarios`, a tabela `reservas` e o relacionamento entre elas.

### Relacionamento

```text
Usuario 1 -------- N Reserva

usuarios.id <---- reservas.usuario_id
```

Um usuário pode possuir várias reservas. Cada reserva pertence a exatamente um usuário.

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

```text
http://localhost:3000/api/docs
```

O Swagger permite testar os endpoints e enviar o JWT pelo botão **Authorize**.

## Autenticação

Primeiro faça o cadastro em `POST /usuarios` e depois o login em `POST /auth/login`.

Use o `access_token` retornado no cabeçalho:

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
| POST | `/reservas` | JWT | Criar reserva |
| GET | `/reservas` | JWT | Listar reservas do usuário |
| GET | `/reservas/:id` | JWT | Buscar uma reserva |
| PATCH | `/reservas/:id` | JWT | Atualizar reserva |
| DELETE | `/reservas/:id` | JWT | Cancelar reserva |

## Regras de reservas

1. Toda reserva pertence ao usuário autenticado.
2. A data de início deve ser anterior à data de fim.
3. A quantidade de pessoas deve ser maior ou igual a 1.
4. Uma reserva nova inicia com status `PENDENTE`.
5. Os status disponíveis são `PENDENTE`, `CONFIRMADA`, `CANCELADA` e `CONCLUIDA`.
6. Reservas canceladas não podem ser alteradas.
7. Reservas concluídas não podem ser alteradas ou canceladas.
8. Um usuário só pode consultar ou alterar as próprias reservas através dos endpoints públicos da API.
9. O relacionamento utiliza `reservas.usuario_id` como chave estrangeira para `usuarios.id`.
10. A exclusão de um usuário exclui suas reservas relacionadas por `ON DELETE CASCADE`.

## Regras de usuários e endereço

1. Todos os campos obrigatórios são validados.
2. O e-mail deve possuir formato válido e não pode ser duplicado.
3. A senha deve possuir pelo menos 6 caracteres no cadastro.
4. A senha é armazenada utilizando hash bcrypt e nunca é retornada nas consultas.
5. O CEP precisa conter 8 números, podendo ser informado com ou sem hífen.
6. O cadastro consulta o ViaCEP para obter o endereço.
7. CEP inexistente retorna `404`.
8. CEP inválido retorna `400`.
9. Falha no serviço externo de CEP retorna `503`.
10. Atualização de CEP consulta novamente o ViaCEP e atualiza os dados de endereço.
11. A consulta de coordenadas utiliza a cidade retornada pelo CEP e o serviço de geocodificação do Open-Meteo.

## Exemplo: criar reserva

```http
POST /reservas
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "data_inicio": "2026-10-10",
  "data_fim": "2026-10-15",
  "quantidade_pessoas": 2,
  "observacoes": "Reserva para viagem de férias."
}
```

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
