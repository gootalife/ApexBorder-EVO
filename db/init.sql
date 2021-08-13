BEGIN;

CREATE TABLE public.rplog
(
    id integer NOT NULL,
    date text NOT NULL,
    season text,
    origin integer[] NOT NULL,
    ps integer[] NOT NULL,
    xbox integer[] NOT NULL,
    valid boolean NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE public.border
(
    platform text NOT NULL,
    date text NOT NULL,
    rp integer NOT NULL,
    PRIMARY KEY (platform)
);

COMMIT;
