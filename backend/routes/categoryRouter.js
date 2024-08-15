const express = require("express");
const categoryController = require("../controllers/categoryCtrl");
const isAuthenticated = require("../middlewares/isAuth");
const categoryRouter = express.Router();

//add
categoryRouter.post(
  "/api/v1/categories/create",
  isAuthenticated,
  categoryController.create
);

//lists
categoryRouter.get(
  "/api/v1/categories/lists",
  isAuthenticated,
  categoryController.lists
);

categoryRouter.put(
  "/api/v1/categories/update/:categoryId",
  isAuthenticated,
  categoryController.update
);

categoryRouter.delete(
  "/api/v1/categories/delete/:id",
  isAuthenticated,
  categoryController.delete
);

module.exports = categoryRouter;
