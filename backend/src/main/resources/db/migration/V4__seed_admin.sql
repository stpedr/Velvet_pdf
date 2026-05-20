-- V4 — Seed admin user
-- Password: Admin@123 (BCrypt strength 12)

INSERT INTO customers (id, email, password_hash, first_name, last_name, role, tier, active, loyalty_points, created_at, updated_at)
VALUES (
    gen_random_uuid()::text,
    'admin@patadeveludo.com.br',
    '$2a$12$Soblnc7XuoUNGAP9qLT2JO63gbT2WLfTLLSR/.inbW.w1gs/.ShTm',
    'Admin',
    'Pata de Veludo',
    'ADMIN',
    'PANTERA',
    TRUE, 0,
    NOW(), NOW()
) ON CONFLICT (email) DO NOTHING;
