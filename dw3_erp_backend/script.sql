CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf_cnpj VARCHAR(20) UNIQUE NOT NULL,
    endereco VARCHAR(255),
    telefone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    data_cadastro TIMESTAMP,
    ativo BOOLEAN
);


CREATE TABLE faturas (
    id_fatura SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    data_emissao DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    valor_total NUMERIC(12,2) NOT NULL,
    status VARCHAR(20) NOT NULL,

    CONSTRAINT fk_cliente_fatura FOREIGN KEY (id_cliente)
        REFERENCES clientes (id_cliente)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

create table IF NOT EXISTS usuarios (
usuarioid bigserial constraint pk_usuarios PRIMARY KEY,
username varchar(10) UNIQUE,
password text,
deleted boolean DEFAULT false
);


CREATE EXTENSION if NOT EXISTS pgcrypto;

insert into usuarios values
(default, 'admin', crypt('admin', gen_salt('bf'))), -- senha criptografada com bcrypt
(default, 'qwe', crypt('qwe', gen_salt('bf'))) -- senha criptografada com bcrypt
ON CONFLICT DO NOTHING;
