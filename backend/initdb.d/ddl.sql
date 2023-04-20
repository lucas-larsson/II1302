-- we don't know how to generate root <with-no-name> (class Root) :(
create table role
(
    role_id integer generated always as identity
        primary key,
    name    varchar(255)
);

alter table role
    owner to postgres;

create table person
(
    person_id integer generated always as identity
        primary key,
    name      varchar(255),
    surname   varchar(255),
    pnr       varchar(255),
    email     varchar(255)
        constraint constraint_name
            unique,
    password  varchar(255),
    role_id   integer
        references role,
    username  varchar(255)
        unique
);

alter table person
    owner to postgres;

create table sessions
(
    session_id      uuid default gen_random_uuid() not null
        constraint sessions_pk
            primary key,
    person_id       integer
        references person,
    expiration_date timestamp
);

alter table sessions
    owner to postgres;

