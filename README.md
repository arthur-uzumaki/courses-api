# Courses  API para gerenciamento de cursos utilizando Fastify, Drizzle ORM e PostgreSQL.  

## Diagrama de Fluxo Principal

O diagrama abaixo ilustra o fluxo mais importante da aplicação: criação, listagem e consulta de cursos.

```mermaid
sequenceDiagram
    participant Cliente
    participant API
    participant Banco
    Cliente->>API: POST /courses (criar curso)
    API->>Banco: Insere curso
    Banco-->>API: Retorna ID do curso
    API-->>Cliente: 201 Created + courseId
    Cliente->>API: GET /courses (listar cursos)
    API->>Banco: Consulta todos os cursos
    Banco-->>API: Lista de cursos
    API-->>Cliente: 200 OK + cursos
    Cliente->>API: GET /courses/:courseId (detalhe)
    API->>Banco: Consulta curso por ID
    Banco-->>API: Dados do curso
    API-->>Cliente: 200 OK + curso ou 404
```

## Tecnologias  

- Fastify 
- Drizzle ORM 
- PostgreSQL 
- Zod 
- Swagger  

### Componentes do Fluxo

1. **Cliente**: Aplicação ou usuário que consome a API
2. **Fastify**: Servidor HTTP que processa as requisições
3. **Zod**: Biblioteca de validação de dados de entrada
4. **Drizzle ORM**: Camada de abstração para o banco de dados
5. **PostgreSQL**: Banco de dados relacional onde os cursos são armazenados

## Estrutura  

```
api.http
biome.json
docker-compose.yml
drizzle.config.ts
package.json
swagger.json
tsconfig.json
src/
  db/
    connection.ts
    migrations/
      0000_charming_iron_fist.sql
      meta/
        _journal.json
        0000_snapshot.json
    schema/
      courses.ts
      index.ts
      users.ts
  env/
    env.ts
  http/
    server.ts
    routes/
      create-course.ts
      get-course-by-id.ts
      get-courses.ts
```

## Como rodar  

1. **Configure o banco de dados**  
   Edite o arquivo `.env` conforme o exemplo em `.env-example`.

2. **Suba o banco com Docker**  
   ```sh
   docker-compose up -d
   ```

3. **Instale as dependências**  
   ```sh
   npm install
   ```

4. **Execute as migrações**  
   ```sh
   npm run db:migrate
   ```

5. **Inicie o servidor**  
   ```sh
   npm run dev
   ```

## Endpoints  

- `GET /courses` — Lista todos os cursos
- `GET /courses/:courseId` — Busca curso por ID
- `POST /courses` — Cria um novo curso

## Documentação  

Acesse a documentação Swagger em [http://localhost:3333/docs](http://localhost:3333/docs) (modo desenvolvimento).


## Teste rápido  

Utilize o arquivo [`api.http`](api.http) para testar os endpoints.

Feito com ❤️ usando Fastify e Drizzle ORM.