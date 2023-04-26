create table if not exists public.role
(
    role_id integer generated always as identity
        primary key,
    name    varchar(255)
);

alter table public.role
    owner to postgres;

create table if not exists public.person
(
    person_id integer generated always as identity
        primary key,
    name      varchar(255),
    surname   varchar(255),
    email     varchar(255)
        constraint constraint_name
            unique,
    password  varchar(255),
    role_id   integer
        references public.role
);

alter table public.person
    owner to postgres;

create table if not exists public.sessions
(
    session_id      uuid default gen_random_uuid() not null
        constraint sessions_pk
            primary key,
    person_id       integer
        references public.person,
    expiration_date timestamp
);

alter table public.sessions
    owner to postgres;

create table if not exists public.iot_auth
(
    id              integer not null
        constraint iot_auth_pk
            primary key
        constraint iot_auth_person_person_id_fk
            references public.person,
    device_id       varchar not null,
    device_password varchar
);

alter table public.iot_auth
    owner to postgres;

create table if not exists public.plant_data
(
    device_id        varchar,
    last_watered     timestamp,
    moisture_level double precision,
    user_id          integer
        constraint plant_data_person_person_id_fk
            references public.person
);

alter table public.plant_data
    owner to postgres;


