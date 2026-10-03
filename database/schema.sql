-- ====================================================================
-- ROYAL EXPRESS TRANSPORTES, LDA - DATABASE SCHEMA (MySQL 8.0+)
-- Interprovincial Bus Booking & Management System
-- ====================================================================

DROP DATABASE IF EXISTS royal_express_db;
CREATE DATABASE royal_express_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE royal_express_db;

-- --------------------------------------------------------------------
-- 1. USERS & AUTH (Administrators, Ticket Agents, Inspectors)
-- --------------------------------------------------------------------
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(30),
    role VARCHAR(30) NOT NULL DEFAULT 'OPERADOR', -- ADMIN, OPERADOR, FISCAL, FINANCEIRO
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 2. CLIENTES (Passageiros)
-- --------------------------------------------------------------------
CREATE TABLE clientes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome_completo VARCHAR(150) NOT NULL,
    telefone VARCHAR(30) NOT NULL,
    email VARCHAR(150) NULL,
    numero_bi VARCHAR(50) NULL,
    data_nascimento DATE NULL,
    provincia VARCHAR(100) NULL,
    municipio VARCHAR(100) NULL,
    endereco VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_clientes_telefone (telefone),
    INDEX idx_clientes_bi (numero_bi)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 3. MOTORISTAS
-- --------------------------------------------------------------------
CREATE TABLE motoristas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(30) NOT NULL,
    numero_carta VARCHAR(50) NOT NULL UNIQUE,
    categoria_carta VARCHAR(20) NOT NULL DEFAULT 'PESADOS_PASSAGEIROS',
    data_validade_carta DATE NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO', -- ACTIVO, FERIAS, SUSPENSO, INACTIVO
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_motoristas_estado (estado)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 4. VIATURAS (FROTA)
-- --------------------------------------------------------------------
CREATE TABLE viaturas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    matricula VARCHAR(30) NOT NULL UNIQUE,
    marca VARCHAR(50) NOT NULL DEFAULT 'Volvo',
    modelo VARCHAR(50) NOT NULL DEFAULT 'B11R Marcopolo G7',
    ano INT NOT NULL DEFAULT 2023,
    capacidade INT NOT NULL DEFAULT 50,
    ar_condicionado BOOLEAN NOT NULL DEFAULT TRUE,
    wifi BOOLEAN NOT NULL DEFAULT TRUE,
    tomadas_usb BOOLEAN NOT NULL DEFAULT TRUE,
    estado VARCHAR(30) NOT NULL DEFAULT 'DISPONIVEL', -- DISPONIVEL, EM_VIAGEM, MANUTENCAO, INACTIVO
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_viaturas_matricula (matricula)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 5. ROTAS INTERPROVINCIAIS
-- --------------------------------------------------------------------
CREATE TABLE rotas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    origem VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    distancia_km INT NOT NULL,
    duracao_estimada VARCHAR(50) NOT NULL, -- ex: '8h30'
    preco_base DECIMAL(12,2) NOT NULL,
    descricao TEXT NULL,
    imagem_url VARCHAR(255) NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVA', -- ACTIVA, INACTIVA, SUSPENSA
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_origem_destino (origem, destino),
    INDEX idx_rotas_busca (origem, destino, estado)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 6. VIAGENS PROGRAMADAS
-- --------------------------------------------------------------------
CREATE TABLE viagens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    rota_id BIGINT NOT NULL,
    viatura_id BIGINT NOT NULL,
    motorista_id BIGINT NOT NULL,
    data_viagem DATE NOT NULL,
    hora_partida TIME NOT NULL,
    hora_chegada_estimada TIME NOT NULL,
    preco DECIMAL(12,2) NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'AGENDADA', -- AGENDADA, EMBARQUE, EM_CURSO, CONCLUIDA, CANCELADA
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_viagens_rota FOREIGN KEY (rota_id) REFERENCES rotas(id),
    CONSTRAINT fk_viagens_viatura FOREIGN KEY (viatura_id) REFERENCES viaturas(id),
    CONSTRAINT fk_viagens_motorista FOREIGN KEY (motorista_id) REFERENCES motoristas(id),
    INDEX idx_viagens_data (data_viagem),
    INDEX idx_viagens_busca (rota_id, data_viagem, estado)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 7. LUGARES DA VIATURA (LAYOUT DO AUTOCARRO)
-- --------------------------------------------------------------------
CREATE TABLE lugares (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    viatura_id BIGINT NOT NULL,
    numero INT NOT NULL,
    fila INT NOT NULL,
    coluna VARCHAR(5) NOT NULL, -- 'A', 'B', 'C', 'D'
    tipo VARCHAR(30) NOT NULL DEFAULT 'NORMAL', -- NORMAL, PRIORITARIO, MOTORISTA, BLOQUEADO
    estado VARCHAR(30) NOT NULL DEFAULT 'DISPONIVEL', -- DISPONIVEL, MANUTENCAO, BLOQUEADO
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_lugares_viatura FOREIGN KEY (viatura_id) REFERENCES viaturas(id) ON DELETE CASCADE,
    UNIQUE KEY uk_viatura_lugar (viatura_id, numero),
    INDEX idx_lugares_viatura (viatura_id)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 8. RESERVAS (TRANSACIONAL COM BLOQUEIO TEMPORÁRIO DE 60 MINUTOS)
-- --------------------------------------------------------------------
CREATE TABLE reservas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    codigo_reserva VARCHAR(50) NOT NULL UNIQUE,
    cliente_id BIGINT NOT NULL,
    viagem_id BIGINT NOT NULL,
    lugar_id BIGINT NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDENTE_PAGAMENTO', -- PENDENTE_PAGAMENTO, CONFIRMADA, EXPIRADA, CANCELADA, UTILIZADA
    valor DECIMAL(12,2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    confirmed_at DATETIME NULL,
    cancelled_at DATETIME NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reservas_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    CONSTRAINT fk_reservas_viagem FOREIGN KEY (viagem_id) REFERENCES viagens(id),
    CONSTRAINT fk_reservas_lugar FOREIGN KEY (lugar_id) REFERENCES lugares(id),
    INDEX idx_reservas_codigo (codigo_reserva),
    INDEX idx_reservas_expiracao (estado, expires_at),
    INDEX idx_reservas_viagem_lugar (viagem_id, lugar_id, estado)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 9. PAGAMENTOS (PAGAMENTO POR REFERÊNCIA MULTICAIXA / EMIS / BANCOS)
-- --------------------------------------------------------------------
CREATE TABLE pagamentos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    reserva_id BIGINT NOT NULL,
    entidade VARCHAR(30) NOT NULL DEFAULT '00578',
    referencia VARCHAR(50) NOT NULL UNIQUE,
    valor DECIMAL(12,2) NOT NULL,
    moeda VARCHAR(10) NOT NULL DEFAULT 'AOA',
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDENTE', -- PENDENTE, PROCESSANDO, PAGO, FALHOU, EXPIRADO, CANCELADO
    metodo_pagamento VARCHAR(50) NOT NULL DEFAULT 'REFERENCIA_MULTICAIXA',
    provider VARCHAR(100) NOT NULL DEFAULT 'EMIS_MULTICAIXA',
    transaction_id VARCHAR(150) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    paid_at DATETIME NULL,
    provider_response TEXT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pagamentos_reserva FOREIGN KEY (reserva_id) REFERENCES reservas(id),
    INDEX idx_pagamentos_referencia (referencia),
    INDEX idx_pagamentos_estado (estado)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 10. BILHETES DIGITAIS (EMISSÃO APÓS PAGAMENTO CONFIRMADO)
-- --------------------------------------------------------------------
CREATE TABLE bilhetes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    numero_bilhete VARCHAR(50) NOT NULL UNIQUE,
    reserva_id BIGINT NOT NULL UNIQUE,
    qr_code VARCHAR(500) NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'EMITIDO', -- EMITIDO, EMBARCADO, CANCELADO, EXPIRADO
    emitido_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    utilizado_em DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_bilhetes_reserva FOREIGN KEY (reserva_id) REFERENCES reservas(id),
    INDEX idx_bilhetes_numero (numero_bilhete),
    INDEX idx_bilhetes_estado (estado)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- ÍNDICE VITAL: IMPEDIR DOIS CLIENTES DE RESERVAREM O MESMO LUGAR NA MESMA VIAGEM
-- (O backend usa transações com FOR UPDATE e este índice garante integridade adicional)
-- --------------------------------------------------------------------
CREATE INDEX idx_concorrencia_lugar_viagem ON reservas (viagem_id, lugar_id, estado);
