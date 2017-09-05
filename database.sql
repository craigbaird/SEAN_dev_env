--Database name: ssg_registration

--create user table
CREATE TABLE "users" (
  "id" serial,
  "username" varchar(80) primary key not null,
  "password" varchar(120) not null,
  "role" varchar(20) not null,
  "email" varchar(80),
  "code" varchar(80),
  "expiration" date default CURRENT_DATE
);
