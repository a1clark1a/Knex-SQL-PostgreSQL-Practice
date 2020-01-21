require("dotenv").config();
const knex = require("knex");
const ArticlesService = require("./articles_service");

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL
});

console.log(ArticlesService.getAllArticles());
