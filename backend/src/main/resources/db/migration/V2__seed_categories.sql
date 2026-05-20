-- V2 — Seed 5 categories matching frontend slugs
-- Fixed UUIDs so products (V3) can reference them reliably

INSERT INTO categories (id, name, slug, description, active, sort_order, created_at, updated_at) VALUES
    ('11111111-1111-1111-1111-000000000001', 'Brincar',   'brincar',   'Caça, salto e curiosidade',         TRUE, 1, NOW(), NOW()),
    ('11111111-1111-1111-1111-000000000002', 'Descansar', 'descansar', 'Toca, ninho e calor',               TRUE, 2, NOW(), NOW()),
    ('11111111-1111-1111-1111-000000000003', 'Hidratar',  'hidratar',  'Fontes e bebedouros',               TRUE, 3, NOW(), NOW()),
    ('11111111-1111-1111-1111-000000000004', 'Passear',   'passear',   'Mochilas, transporte e janelas',    TRUE, 4, NOW(), NOW()),
    ('11111111-1111-1111-1111-000000000005', 'Cuidar',    'cuidar',    'Higiene, pelo e arranhador',        TRUE, 5, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
