## Soundset API README

Adioset recorder is an application for collecting audio data for Baule to French translation.

### Prerequises
- [Nodejs](https://nodejs.org/) >= 14.x
- [Docker](https://docs.docker.com/get-docker/)
- [Docker-compose](https://docs.docker.com/compose/)
- [GPG](https://doc.ubuntu-fr.org/gnupg)

### Databases supported
- [PostreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Microsoft SQL Server](https://www.prisma.io/docs/concepts/database-connectors/sql-server)
- [Mysql](https://www.prisma.io/docs/concepts/database-connectors/mysql)
- [Sqlite](https://www.prisma.io/docs/concepts/database-connectors/sqlite)
- [MongoDB](https://www.mongodb.com/)

### Documentation
- [Prisma](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference) For making good schema.
- [Swagger](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#schemaObject) For making good api's documentation.
- [Supertest](https://www.npmjs.com/package/supertest) For making Api test.
- [EXpressJs](https://expressjs.com/fr/4x/api.html)


### For Begining
1. Use *gpc secrets.json.gpg* to decrypt the file wich contain environment variables
2. Type **yarn install** to install all dependencies you needed
3. Run GCP Local storage with **docker-compose up -d gcp_storage_local** (moking of google storage)
4. Use **yarn db:start** to run your Dev BD instance
5. Use **yarn db:update** to update API and database structure following your model in schema.prisma file and generate prisma client
6. To fill database use **npx ts-node seeder.ts**
7. Use **yarn start:dev** to run project.
8. Use **yarn test** to test project.