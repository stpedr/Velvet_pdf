-- V3 — Seed 13 products from frontend/src/lib/data.ts
-- Category UUIDs reference V2 seeds
-- colorways/specs/images stored as JSONB

-- brincar products (category 001)
INSERT INTO products (id, name, tagline, story, price, original_price, category_id, colorways, tag, specs, images, active, stock_qty, created_at, updated_at)
VALUES
(
    gen_random_uuid()::text,
    'Ratinho elétrico Picapau',
    'Corre, vira e desafia o instinto.',
    'Sensor de toque que muda o trajeto a cada vez. Ele nunca decora — e seu gato também nunca cansa.',
    89.90, 129.90,
    '11111111-1111-1111-1111-000000000001',
    '["#ed6058","#2a1612","#f2c98a"]',
    'Mais caçado',
    '["Recarregável USB-C","Autonomia 4h","Modo noite silencioso"]',
    NULL,
    TRUE, 100, NOW(), NOW()
),
(
    gen_random_uuid()::text,
    'Varinha Pluma da Sereia',
    'Penas naturais, fio de elástico macio.',
    'Cabo de bambu leve, penas trocáveis. Acabou a pena? A gente manda refil pelo Correio em envelope rosa.',
    49.90, NULL,
    '11111111-1111-1111-1111-000000000001',
    '["#fcebf1","#ed6058"]',
    'Favorito da casa',
    '["Cabo 60cm","3 plumas inclusas","Refil disponível"]',
    NULL,
    TRUE, 100, NOW(), NOW()
),
(
    gen_random_uuid()::text,
    'Túnel Veludo Macio',
    'Esconder. Atacar. Repetir.',
    'Dois metros de túnel dobrável forrado em pelúcia. Faz o barulho de papel amassado por dentro — irresistível.',
    119.90, NULL,
    '11111111-1111-1111-1111-000000000001',
    '["#ed6058","#fcebf1","#fdfedf"]',
    'Novidade',
    '["2m × 25cm","Dobrável","Lavável à mão"]',
    NULL,
    TRUE, 100, NOW(), NOW()
),
(
    gen_random_uuid()::text,
    'Bola Pena de Outono',
    'A gravidade fica do lado do gato.',
    'Seis bolinhas de feltro com pena central. Voam, rolam e somem embaixo da geladeira — como manda a tradição.',
    24.90, NULL,
    '11111111-1111-1111-1111-000000000001',
    '["#ed6058","#f2c98a","#fcebf1"]',
    'Pack com 6',
    '["Feltro 100% lã","Sem cola","Pack 6 unidades"]',
    NULL,
    TRUE, 100, NOW(), NOW()
),
(
    gen_random_uuid()::text,
    'Puzzle Camarão Curioso',
    'Comer com a cabeça (literalmente).',
    'Comedouro interativo em forma de camarão. Esconde ração em 7 níveis de dificuldade — desacelera a comida e ocupa a mente.',
    159.90, NULL,
    '11111111-1111-1111-1111-000000000001',
    '["#ed6058","#fdfedf"]',
    'Enriquecimento',
    '["7 níveis","Antiderrapante","BPA-free"]',
    '["/assets/puzzle-5.jpg","/assets/puzzle-2.jpg","/assets/puzzle-3.jpg","/assets/puzzle-1.png","/assets/puzzle-4.jpg"]',
    TRUE, 100, NOW(), NOW()
),
(
    gen_random_uuid()::text,
    'Túnel Triplo Aventura',
    'Três saídas, infinitas emboscadas.',
    'Túnel modular em formato Y com três entradas. Tecido crepitante por dentro, dobrável em segundos. Combina com mais túneis pra criar labirintos.',
    129.90, 189.00,
    '11111111-1111-1111-1111-000000000001',
    '["#ed6058","#fdfedf","#fcebf1"]',
    'Best-seller',
    '["3 saídas","Dobrável","Tecido crepitante"]',
    NULL,
    TRUE, 100, NOW(), NOW()
),
(
    gen_random_uuid()::text,
    'Varinha Laser Cometa',
    'Ponto vermelho, instinto roxo.',
    'Laser recarregável USB-C com 3 padrões (ponto, peixe, estrela). Cabo leve, botão silencioso, autonomia de 6 horas de caçada.',
    39.90, 89.90,
    '11111111-1111-1111-1111-000000000001',
    '["#ed6058","#2a1612"]',
    '−55%',
    '["USB-C","3 padrões","Autonomia 6h"]',
    NULL,
    TRUE, 100, NOW(), NOW()
),
(
    gen_random_uuid()::text,
    'Bolinhas Crocantes',
    'Pack com 12. Some uma, ainda sobram 11.',
    'Doze bolinhas leves de papel reciclado prensado. Fazem barulho de papel amassado, voam longe e custam quase nada — porque vão sumir embaixo do sofá mesmo.',
    32.40, 35.90,
    '11111111-1111-1111-1111-000000000001',
    '["#fcebf1","#ed6058","#fdfedf"]',
    'Pack 12',
    '["Pack 12 unidades","Papel reciclado","Sem corantes"]',
    NULL,
    TRUE, 100, NOW(), NOW()
),

-- hidratar products (category 003)
(
    gen_random_uuid()::text,
    'Fonte Pétala silenciosa',
    'Água em movimento, ronronar em paz.',
    'Motor magnético quase inaudível, 2,5L, três modos de fluxo. Cerâmica leitosa por fora, filtro de carvão por dentro.',
    229.00, NULL,
    '11111111-1111-1111-1111-000000000003',
    '["#fcebf1","#fdfedf","#ed6058"]',
    'Best-seller',
    '["2,5L","USB-C","Filtro trocável"]',
    NULL,
    TRUE, 100, NOW(), NOW()
),

-- descansar products (category 002)
(
    gen_random_uuid()::text,
    'Ninho Pão Quentinho',
    'Cama redonda de bordas altas.',
    'Estofado em bouclê encorpado, base antiderrapante, miolo de espuma de alta densidade. Faz o gato virar pãozinho.',
    189.00, NULL,
    '11111111-1111-1111-1111-000000000002',
    '["#ed6058","#fcebf1","#2a1612"]',
    'Edição limitada',
    '["Ø 55cm","Lavável","Bouclê reciclado"]',
    NULL,
    TRUE, 100, NOW(), NOW()
),
(
    gen_random_uuid()::text,
    'Torre Arranhador Veludo',
    'Três níveis pra reinar.',
    'Torre arranhador em sisal natural com três plataformas, cabine forrada em pelúcia e brinquedo suspenso. Estrutura reforçada para gatos grandes.',
    459.90, 759.90,
    '11111111-1111-1111-1111-000000000002',
    '["#ed6058","#fcebf1","#2a1612"]',
    '−40%',
    '["1,20m altura","Sisal natural","Até 8kg por nível"]',
    NULL,
    TRUE, 100, NOW(), NOW()
),

-- cuidar products (category 005)
(
    gen_random_uuid()::text,
    'Arranhador Onda',
    'Curva que convida a esticar.',
    'Papelão prensado de alta densidade em curva ergonômica. Vem com sachê de catnip e uma carta escrita à mão.',
    139.00, NULL,
    '11111111-1111-1111-1111-000000000005',
    '["#fdfedf","#ed6058"]',
    'Recarga inclusa',
    '["62 × 25cm","Catnip incluso","Recarga vendida à parte"]',
    NULL,
    TRUE, 100, NOW(), NOW()
),

-- passear products (category 004)
(
    gen_random_uuid()::text,
    'Mochila Bolha de Sabão',
    'Transporte com vista panorâmica.',
    'Bolha de policarbonato com ventilação cruzada, alças acolchoadas, base removível para lavar. Cabe gato até 7kg.',
    349.00, NULL,
    '11111111-1111-1111-1111-000000000004',
    '["#fcebf1","#fdfedf"]',
    'Aprovado vet',
    '["Até 7kg","Ventilação 360°","Base removível"]',
    NULL,
    TRUE, 100, NOW(), NOW()
);
