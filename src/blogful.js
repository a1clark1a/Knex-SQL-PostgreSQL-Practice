require("dotenv").config();
const knex = require("knex");
const ArticlesService = require("./articles_service");

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL
});

ArticlesService.getAllArticles(knexInstance)
  .then(articles => console.log(articles))
  .then(() => {
    return ArticlesService.insertArticle(knexInstance, {
      title: "New title 1",
      content: "New Content",
      date_published: new Date()
    });
  })
  .then(newArticle => {
    console.log(newArticle);
    return ArticlesService.updateArticle(knexInstance, newArticle.id, {
      title: "Updated title"
    })
      .then(() => {
        return ArticlesService.getById(knexInstance, newArticle.id);
      })
      .then(article => {
        console.log(article);
        return ArticlesService.deleteArticle(knexInstance, article.id);
      });
  });
