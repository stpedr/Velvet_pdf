-- ============================================================
-- V1 — Initial schema (matches JPA entities exactly)
-- ============================================================

CREATE TABLE IF NOT EXISTS customers (
    id               VARCHAR(36)  PRIMARY KEY,
    email            VARCHAR(255) NOT NULL UNIQUE,
    password_hash    VARCHAR(255) NOT NULL,
    first_name       VARCHAR(255),
    last_name        VARCHAR(255),
    phone            VARCHAR(50),
    cpf              VARCHAR(11)  UNIQUE,
    role             VARCHAR(20)  NOT NULL DEFAULT 'CUSTOMER',
    loyalty_points   INT          NOT NULL DEFAULT 0,
    tier             VARCHAR(20)  NOT NULL DEFAULT 'VELUDO',
    active           BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMP,
    updated_at       TIMESTAMP
);

-- ElementCollection for customer saved addresses
CREATE TABLE IF NOT EXISTS customer_addresses (
    customer_id  VARCHAR(36) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    street       VARCHAR(255),
    number       VARCHAR(50),
    complement   VARCHAR(255),
    neighborhood VARCHAR(255),
    city         VARCHAR(255),
    state        VARCHAR(50),
    zip_code     VARCHAR(20),
    country      VARCHAR(50)
);

-- Pet profiles (CustomerCat OneToMany)
CREATE TABLE IF NOT EXISTS customer_cats (
    id          VARCHAR(36)  PRIMARY KEY,
    customer_id VARCHAR(36)  NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    breed       VARCHAR(255),
    birth_date  DATE,
    photo_url   VARCHAR(500),
    created_at  TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id          VARCHAR(36)  PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    slug        VARCHAR(255) UNIQUE,
    description TEXT,
    image_url   VARCHAR(500),
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    sort_order  INT          NOT NULL DEFAULT 0,
    created_at  TIMESTAMP,
    updated_at  TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id             VARCHAR(36)     PRIMARY KEY,
    name           VARCHAR(255)    NOT NULL,
    tagline        VARCHAR(500),
    story          TEXT,
    price          NUMERIC(10, 2)  NOT NULL,
    original_price NUMERIC(10, 2),
    category_id    VARCHAR(36)     REFERENCES categories(id),
    colorways      JSONB,
    tag            VARCHAR(100),
    specs          JSONB,
    images         JSONB,
    active         BOOLEAN         NOT NULL DEFAULT TRUE,
    stock_qty      INT             NOT NULL DEFAULT 0,
    sku            VARCHAR(255)    UNIQUE,
    weight         NUMERIC(8, 3),
    created_at     TIMESTAMP,
    updated_at     TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id                    VARCHAR(36)    PRIMARY KEY,
    customer_id           VARCHAR(36)    NOT NULL REFERENCES customers(id),
    status                VARCHAR(30)    NOT NULL DEFAULT 'PENDING',
    subtotal              NUMERIC(10, 2) NOT NULL DEFAULT 0,
    shipping_cost         NUMERIC(10, 2)          DEFAULT 0,
    discount              NUMERIC(10, 2)          DEFAULT 0,
    total                 NUMERIC(10, 2) NOT NULL DEFAULT 0,
    payment_provider      VARCHAR(100),
    payment_method        VARCHAR(50),
    payment_external_id   VARCHAR(255),
    -- Embedded shippingAddress with @AttributeOverride prefix "shipping_"
    shipping_street       VARCHAR(255),
    shipping_number       VARCHAR(50),
    shipping_complement   VARCHAR(255),
    shipping_neighborhood VARCHAR(255),
    shipping_city         VARCHAR(255),
    shipping_state        VARCHAR(50),
    shipping_zip_code     VARCHAR(20),
    shipping_country      VARCHAR(50),
    tracking_code         VARCHAR(255),
    shipping_carrier      VARCHAR(100),
    coupon_code           VARCHAR(100),
    notes                 TEXT,
    created_at            TIMESTAMP,
    updated_at            TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id                    VARCHAR(36)    PRIMARY KEY,
    order_id              VARCHAR(36)    NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id            VARCHAR(36)    NOT NULL REFERENCES products(id),
    quantity              INT            NOT NULL,
    unit_price            NUMERIC(10, 2) NOT NULL,
    total_price           NUMERIC(10, 2) NOT NULL,
    product_name_snapshot VARCHAR(500),
    colorway_snapshot     VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS payments (
    id                  VARCHAR(36)    PRIMARY KEY,
    order_id            VARCHAR(36)    NOT NULL UNIQUE REFERENCES orders(id),
    external_id         VARCHAR(255),
    provider            VARCHAR(100)   NOT NULL,
    payment_method      VARCHAR(50)    NOT NULL,
    status              VARCHAR(30)    NOT NULL DEFAULT 'PENDING',
    amount              NUMERIC(10, 2) NOT NULL,
    currency            VARCHAR(3)              DEFAULT 'BRL',
    pix_qr_code         TEXT,
    pix_qr_code_base64  TEXT,
    boleto_url          VARCHAR(500),
    boleto_barcode      VARCHAR(255),
    preference_id       VARCHAR(255),
    installments        INT,
    expires_at          TIMESTAMP,
    raw_response        TEXT,
    created_at          TIMESTAMP,
    updated_at          TIMESTAMP
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_products_category   ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active     ON products(active);
CREATE INDEX IF NOT EXISTS idx_orders_customer     ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status       ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order   ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order      ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_external   ON payments(external_id);
