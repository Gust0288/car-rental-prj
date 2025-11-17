CREATE TABLE users (
    id               SERIAL PRIMARY KEY,
    username         VARCHAR(50) NOT NULL UNIQUE,
    name             VARCHAR(100),
    user_last_name   VARCHAR(100),
    email            VARCHAR(255) NOT NULL UNIQUE,
    password         VARCHAR(255) NOT NULL,
    user_created_at  TIMESTAMPTZ NOT NULL,
    user_updated_at  TIMESTAMPTZ,
    user_deleted_at  TIMESTAMPTZ,
    is_admin         SMALLINT NOT NULL DEFAULT 0
);