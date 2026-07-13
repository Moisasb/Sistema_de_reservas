create database if not exists sistema_reservas;

use sistema_reservas;

create table if not exists usuarios (
  id int auto_increment primary key,
  nome varchar(150) not null,
  email varchar(150) not null unique,
  senha varchar(255) not null,
  telefone varchar(20) not null,
  cep varchar(9) not null,
  rua varchar(150) not null,
  bairro varchar(100) not null,
  cidade varchar(100) not null,
  estado varchar(2) not null,
  profissao varchar(100) not null,
  data_nascimento date not null,
  criado_em timestamp default current_timestamp,
  atualizado_em timestamp default current_timestamp on update current_timestamp
);

create index idx_usuarios_email on usuarios (email);
