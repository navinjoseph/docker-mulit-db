FROM postgres:10.3
COPY create-multiple-postgresql-databases.sh /docker-entrypoint-initdb.d/
VOLUME create --driver local --opt /var/lib/postgresql/data tokentax-db-volume