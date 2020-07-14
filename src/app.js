const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4"); // Importando função (ID Unico Universl)

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/* TIPOS DE PARÂMETROS
 * Query Params: usado p/ filtros e paginação
 * Route params: usado p/
 * Request Body: usado no conteúdo na hora de criar ou editar um recurso (através do JSON)
*/

/* MIDDLEWARE: 
 * Interceptador de requisições que intorrompe totalmente a requisição ou alterar dados da requisição
*/

// GET: Buscando informações do back-end
app.get("/repositories", (request, response) => {
  return response.json(repositories); // lista todos os repositórios;
});

// POST: Criar uma  informação do back-end
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

// PUT/PATCH: Alterar uma informação back-end
app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

// DELETE: Excluir uma informação no back-end
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send();
});

// POST: Criando Like atrvés do ID do repositories no back-end
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id == id );

  if (repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found."});
  }

  const repository = {
    id,
    title: repositories[repositoryIndex].title,
    url: repositories[repositoryIndex].url,
    techs: repositories[repositoryIndex].techs,
    likes: repositories[repositoryIndex].likes+1,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;
