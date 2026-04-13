-- init-schemas.sql
-- Khởi tạo các schema cho kiến trúc Microservice (1 Database, nhiều Schema)

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS apartment;
CREATE SCHEMA IF NOT EXISTS booking;

-- Phân quyền cho user (hoặc sử dụng role mặc định nếu chỉ có 1 user)
-- GRANT ALL ON SCHEMA auth TO user;
-- GRANT ALL ON SCHEMA apartment TO user;
-- GRANT ALL ON SCHEMA booking TO user;
