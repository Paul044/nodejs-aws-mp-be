-- public.products definition

-- Drop table

-- DROP TABLE public.products;

CREATE TABLE public.products (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	title text NOT NULL,
	description text NULL,
	price int4 NULL,
	CONSTRAINT products_pk PRIMARY KEY (id)
);


-- public.stocks definition

-- Drop table

-- DROP TABLE public.stocks;

CREATE TABLE public.stocks (
	product_id uuid NOT NULL,
	count int4 NULL,
	CONSTRAINT stocks_pk PRIMARY KEY (product_id),
	CONSTRAINT stocks_un UNIQUE (product_id),
	CONSTRAINT stocks_fk FOREIGN KEY (product_id) REFERENCES products(id)
);