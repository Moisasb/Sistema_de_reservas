CREATE DATABASE IF NOT EXISTS sistema_reservas;

USE sistema_reservas;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  cep VARCHAR(9) NOT NULL,
  rua VARCHAR(150) NOT NULL,
  bairro VARCHAR(100) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  profissao VARCHAR(100) NOT NULL,
  data_nascimento DATE NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  quantidade_pessoas INT NOT NULL,
  status ENUM('PENDENTE', 'CONFIRMADA', 'CANCELADA', 'CONCLUIDA') NOT NULL DEFAULT 'PENDENTE',
  observacoes VARCHAR(500) NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reservas_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT chk_reservas_quantidade_pessoas
    CHECK (quantidade_pessoas >= 1),
  CONSTRAINT chk_reservas_periodo
    CHECK (data_fim > data_inicio),
  INDEX idx_reservas_usuario (usuario_id),
  INDEX idx_reservas_status (status),
  INDEX idx_reservas_periodo (data_inicio, data_fim)
);
