-- ====================================================================
-- ROYAL EXPRESS TRANSPORTES, LDA - SEED TEST DATA (MySQL)
-- ====================================================================

USE royal_express_db;

-- 1. UTILIZADORES INICIAIS (SENHAS HASH BCRYPT)
INSERT INTO users (nome, email, password_hash, telefone, role, activo) VALUES
('Manuel Baptista (Admin)', 'admin@royalexpress.ao', '$2a$12$e8YfJk9aL7qO6kPvQdKj1.eT8.NqXv.HZbK8XmQk1zTjY8R5O/dOa', '+244931324022', 'ADMIN', TRUE),
('Ana Kiala (Operador Bilheteira)', 'operacoes@royalexpress.ao', '$2a$12$e8YfJk9aL7qO6kPvQdKj1.eT8.NqXv.HZbK8XmQk1zTjY8R5O/dOa', '+244954631145', 'OPERADOR', TRUE),
('Carlos Mateus (Fiscal de Embarque)', 'fiscal@royalexpress.ao', '$2a$12$e8YfJk9aL7qO6kPvQdKj1.eT8.NqXv.HZbK8XmQk1zTjY8R5O/dOa', '+244922114477', 'FISCAL', TRUE);

-- 2. CLIENTES DE TESTE
INSERT INTO clientes (nome_completo, telefone, email, numero_bi, data_nascimento, provincia, municipio, endereco) VALUES
('Manuel Baptista', '+244931324022', 'manuelbaptista2023@gmail.com', '006245891LA042', '1990-05-14', 'Luanda', 'Talatona', 'Gamek, Nosso Centro'),
('Esperança dos Santos', '+244923456789', 'esperanca.santos@gmail.com', '008123456LA031', '1994-08-22', 'Benguela', 'Lobito', 'Rua Principal do Lobito'),
('António Pedro Silva', '+244944556677', 'antonio.pedro@yahoo.com', '004987654HU021', '1987-11-03', 'Huambo', 'Huambo', 'Bairro Académico'),
('Teresa Domingos', '+244912334455', 'teresa.domingos@hotmail.com', '005432109BI018', '1998-02-17', 'Bié', 'Cuíto', 'Avenida da Independência');

-- 3. MOTORISTAS PROFISSIONAIS
INSERT INTO motoristas (nome, telefone, numero_carta, categoria_carta, data_validade_carta, estado) VALUES
('João Sebastião Bento', '+244921445566', 'C-109284-LA', 'PESADOS_PASSAGEIROS', '2028-12-31', 'ACTIVO'),
('Paulo Fernando Afonso', '+244932556677', 'C-208391-BG', 'PESADOS_PASSAGEIROS', '2029-06-30', 'ACTIVO'),
('Domingos Kicunda', '+244943667788', 'C-301928-HB', 'PESADOS_PASSAGEIROS', '2027-10-15', 'ACTIVO'),
('Mateus André Zau', '+244954778899', 'C-409182-ZA', 'PESADOS_PASSAGEIROS', '2028-04-20', 'ACTIVO');

-- 4. FROTA DE AUTOCARROS LUXO (VOLVO MARCOPOLO G7)
INSERT INTO viaturas (matricula, marca, modelo, ano, capacidade, ar_condicionado, wifi, tomadas_usb, estado) VALUES
('LD-84-21-HG', 'Volvo', 'B11R Marcopolo Paradiso G7', 2023, 50, TRUE, TRUE, TRUE, 'DISPONIVEL'),
('LD-52-90-JK', 'Volvo', 'B11R Marcopolo Paradiso G7', 2023, 50, TRUE, TRUE, TRUE, 'DISPONIVEL'),
('LD-19-44-MN', 'Volvo', 'B11R Marcopolo Paradiso G7', 2024, 50, TRUE, TRUE, TRUE, 'DISPONIVEL'),
('LD-77-33-OP', 'Scania', 'K410 Marcopolo G8', 2024, 50, TRUE, TRUE, TRUE, 'DISPONIVEL');

-- 5. GERAR 50 LUGARES PARA CADA AUTOCARRO (Layout: 13 filas, 4 lugares por fila A-B | C-D)
-- Inserir lugares para viatura 1
INSERT INTO lugares (viatura_id, numero, fila, coluna, tipo, estado) VALUES
(1, 1, 1, 'B', 'PRIORITARIO', 'DISPONIVEL'),
(1, 2, 1, 'C', 'NORMAL', 'DISPONIVEL'),
(1, 3, 1, 'D', 'NORMAL', 'DISPONIVEL'),
(1, 4, 2, 'A', 'PRIORITARIO', 'DISPONIVEL'),
(1, 5, 2, 'B', 'PRIORITARIO', 'DISPONIVEL'),
(1, 6, 2, 'C', 'NORMAL', 'DISPONIVEL'),
(1, 7, 2, 'D', 'NORMAL', 'DISPONIVEL'),
(1, 8, 3, 'A', 'NORMAL', 'DISPONIVEL'),
(1, 9, 3, 'B', 'NORMAL', 'DISPONIVEL'),
(1, 10, 3, 'C', 'NORMAL', 'DISPONIVEL'),
(1, 11, 3, 'D', 'NORMAL', 'DISPONIVEL'),
(1, 12, 4, 'A', 'NORMAL', 'DISPONIVEL'),
(1, 13, 4, 'B', 'NORMAL', 'DISPONIVEL'),
(1, 14, 4, 'C', 'NORMAL', 'DISPONIVEL'),
(1, 15, 4, 'D', 'NORMAL', 'DISPONIVEL'),
(1, 16, 5, 'A', 'NORMAL', 'DISPONIVEL'),
(1, 17, 5, 'B', 'NORMAL', 'DISPONIVEL'),
(1, 18, 5, 'C', 'NORMAL', 'DISPONIVEL'),
(1, 19, 5, 'D', 'NORMAL', 'DISPONIVEL'),
(1, 20, 6, 'A', 'NORMAL', 'DISPONIVEL'),
(1, 21, 6, 'B', 'NORMAL', 'DISPONIVEL'),
(1, 22, 6, 'C', 'NORMAL', 'DISPONIVEL'),
(1, 23, 6, 'D', 'NORMAL', 'DISPONIVEL'),
(1, 24, 7, 'A', 'NORMAL', 'DISPONIVEL'),
(1, 25, 7, 'B', 'NORMAL', 'DISPONIVEL'),
(1, 26, 7, 'C', 'NORMAL', 'DISPONIVEL'),
(1, 27, 7, 'D', 'NORMAL', 'DISPONIVEL'),
(1, 28, 8, 'A', 'NORMAL', 'DISPONIVEL'),
(1, 29, 8, 'B', 'NORMAL', 'DISPONIVEL'),
(1, 30, 8, 'C', 'NORMAL', 'DISPONIVEL'),
(1, 31, 8, 'D', 'NORMAL', 'DISPONIVEL'),
(1, 32, 9, 'A', 'NORMAL', 'DISPONIVEL'),
(1, 33, 9, 'B', 'NORMAL', 'DISPONIVEL'),
(1, 34, 9, 'C', 'NORMAL', 'DISPONIVEL'),
(1, 35, 9, 'D', 'NORMAL', 'DISPONIVEL'),
(1, 36, 10, 'A', 'NORMAL', 'DISPONIVEL'),
(1, 37, 10, 'B', 'NORMAL', 'DISPONIVEL'),
(1, 38, 10, 'C', 'NORMAL', 'DISPONIVEL'),
(1, 39, 10, 'D', 'NORMAL', 'DISPONIVEL'),
(1, 40, 11, 'A', 'NORMAL', 'DISPONIVEL'),
(1, 41, 11, 'B', 'NORMAL', 'DISPONIVEL'),
(1, 42, 11, 'C', 'NORMAL', 'DISPONIVEL'),
(1, 43, 11, 'D', 'NORMAL', 'DISPONIVEL'),
(1, 44, 12, 'A', 'NORMAL', 'DISPONIVEL'),
(1, 45, 12, 'B', 'NORMAL', 'DISPONIVEL'),
(1, 46, 12, 'C', 'NORMAL', 'DISPONIVEL'),
(1, 47, 12, 'D', 'NORMAL', 'DISPONIVEL'),
(1, 48, 13, 'A', 'NORMAL', 'DISPONIVEL'),
(1, 49, 13, 'B', 'NORMAL', 'DISPONIVEL'),
(1, 50, 13, 'C', 'NORMAL', 'DISPONIVEL');

-- 6. ROTAS INTERPROVINCIAIS
INSERT INTO rotas (origem, destino, distancia_km, duracao_estimada, preco_base, descricao, estado) VALUES
('Luanda', 'Benguela', 540, '8h30', 18000.00, 'Viagem expressa via Sumbe e Lobito com paragem técnica e máximo conforto.', 'ACTIVA'),
('Luanda', 'Huambo', 590, '9h30', 19000.00, 'Ligação directa ao Planalto Central de Angola em autocarro executivo climatizado.', 'ACTIVA'),
('Luanda', 'Bié', 680, '11h00', 21000.00, 'Linha regular para o Cuíto com segurança e pontualidade Royal Express.', 'ACTIVA'),
('Luanda', 'Waku Kungu', 410, '6h30', 15000.00, 'Trajecto pelo Kwanza Sul com paisagens deslumbrantes e condução defensiva.', 'ACTIVA'),
('Luanda', 'Soyo', 480, '7h30', 17000.00, 'Ligação à província do Zaire com saídas matinais.', 'ACTIVA'),
('Luanda', 'Kibala', 320, '5h00', 11000.00, 'Percurso confortável pelo centro de Angola.', 'ACTIVA'),
('Benguela', 'Luanda', 540, '8h30', 18000.00, 'Retorno da cidade das acácias rubras para Luanda.', 'ACTIVA'),
('Huambo', 'Luanda', 590, '9h30', 19000.00, 'Retorno do Huambo para Luanda.', 'ACTIVA');

-- 7. VIAGENS PROGRAMADAS (Para datas de teste correntes)
INSERT INTO viagens (rota_id, viatura_id, motorista_id, data_viagem, hora_partida, hora_chegada_estimada, preco, estado) VALUES
(1, 1, 1, CURRENT_DATE(), '06:30:00', '15:00:00', 18000.00, 'AGENDADA'),
(1, 2, 2, CURRENT_DATE(), '10:00:00', '18:30:00', 18000.00, 'AGENDADA'),
(1, 1, 1, CURRENT_DATE(), '14:00:00', '22:30:00', 18000.00, 'AGENDADA'),
(1, 2, 2, CURRENT_DATE(), '17:00:00', '01:30:00', 18000.00, 'AGENDADA'),
(2, 3, 3, CURRENT_DATE(), '06:00:00', '15:30:00', 19000.00, 'AGENDADA'),
(2, 4, 4, CURRENT_DATE(), '13:00:00', '22:30:00', 19000.00, 'AGENDADA'),
(3, 1, 1, CURRENT_DATE(), '05:30:00', '16:30:00', 21000.00, 'AGENDADA'),
(4, 2, 2, CURRENT_DATE(), '07:30:00', '14:00:00', 15000.00, 'AGENDADA'),
(5, 3, 3, CURRENT_DATE(), '06:00:00', '13:30:00', 17000.00, 'AGENDADA'),
(6, 4, 4, CURRENT_DATE(), '08:00:00', '13:00:00', 11000.00, 'AGENDADA');

-- 8. EXEMPLOS DE RESERVAS, PAGAMENTO E BILHETE
-- Reserva 1: Já CONFIRMADA e PAGA com bilhete emitido (Lugar 12 na Viagem 1)
INSERT INTO reservas (id, codigo_reserva, cliente_id, viagem_id, lugar_id, estado, valor, created_at, expires_at, confirmed_at)
VALUES (1, 'RE-20261003-000001', 1, 1, 12, 'CONFIRMADA', 18000.00, NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 1 HOUR, NOW() - INTERVAL 1 HOUR);

INSERT INTO pagamentos (reserva_id, entidade, referencia, valor, moeda, estado, metodo_pagamento, provider, transaction_id, created_at, expires_at, paid_at)
VALUES (1, '00578', '842731905', 18000.00, 'AOA', 'PAGO', 'REFERENCIA_MULTICAIXA', 'EMIS_MULTICAIXA', 'TRX-EMIS-994821', NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 1 HOUR, NOW() - INTERVAL 1 HOUR);

INSERT INTO bilhetes (id, numero_bilhete, reserva_id, qr_code, estado, emitido_em)
VALUES (1, 'RX-20261003-000001', 1, 'https://royalexpress.ao/validar/RX-20261003-000001', 'EMITIDO', NOW() - INTERVAL 1 HOUR);

-- Reserva 2: Temporária PENDENTE de pagamento (Lugar 07 na Viagem 1 com 60 min restantes)
INSERT INTO reservas (id, codigo_reserva, cliente_id, viagem_id, lugar_id, estado, valor, created_at, expires_at)
VALUES (2, 'RE-20261003-000002', 2, 1, 7, 'PENDENTE_PAGAMENTO', 18000.00, NOW(), NOW() + INTERVAL 60 MINUTE);

INSERT INTO pagamentos (reserva_id, entidade, referencia, valor, moeda, estado, metodo_pagamento, provider, created_at, expires_at)
VALUES (2, '00578', '910384726', 18000.00, 'AOA', 'PENDENTE', 'REFERENCIA_MULTICAIXA', 'EMIS_MULTICAIXA', NOW(), NOW() + INTERVAL 60 MINUTE);
