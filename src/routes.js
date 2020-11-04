const express = require("express");
const AuthController = require("./controllers/AuthController");
const TarefasController = require("./controllers/TarefasController");
const FilesController = require("./controllers/FilesController");
const multer = require("multer");
const multerConfig = require("./config/multer");
const routes = express.Router();

routes.post("/criar-usuario", AuthController.criar);
routes.post("/recuperar-senha", AuthController.recuperarSenha);
routes.post("/login", AuthController.login);
routes.get("/logout", AuthController.logout);

routes.get("/listar-tarefas", TarefasController.listar);
routes.post("/criar-tarefa", TarefasController.criar);
routes.put("/editar-tarefa", TarefasController.editar);
routes.delete("/excluir-tarefa", TarefasController.excluir);
routes.get("/logs/:idTarefa", TarefasController.listarLogs);

routes.post("/enviar-arquivo", multer(multerConfig).single("file"), FilesController.enviar);
routes.get("/listar-arquivos", FilesController.listar);
routes.delete("/excluir-arquivo/:idFile", FilesController.excluir);

module.exports = routes;
