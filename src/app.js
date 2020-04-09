const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());


const repositories = [];


function findRepositorytId(request, response, next){
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0 ) {
    return response.status(400).json({ error: 'Repository not found' }); 
  }

  response.locals.repositoryIndex = repositoryIndex;

  return next();
}

app.use('/repositories/:id', findRepositorytId);


app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  
  const { title, url, techs } = request.body;
  
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
  
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const repositoryIndex = response.locals.repositoryIndex;
  
  repositories[repositoryIndex] = { ...repositories[repositoryIndex], 
    title: title,
    url: url,
    techs: techs
  };

  return response.json( repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (req, res) => {
  const repositoryIndex = res.locals.repositoryIndex;

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();


});

app.post("/repositories/:id/like", (request, response) => {
   const repositoryIndex = response.locals.repositoryIndex;

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
