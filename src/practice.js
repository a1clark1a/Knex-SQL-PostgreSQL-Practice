require("dotenv").config();
const knex = require("knex");

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL
});

//equivalent to SELECT * FROM amazong_producst;
/*
knexInstance
  .from("amazong_products")
  .select("*")
  .then(result => {
    console.log(result);
  });
*/

//equivalent to SELECT product_id, name, price, category FROM amazong_products WHERE name = 'Point of view gun';
//it returns an array if you want to get only 1 item from the array chain it with .firs()
/*
const qry = knexInstance
  .select("product_id", "name", "price", "category")
  .from("amazong_products")
  .where({ name: "Point of view gun" })
  .first()
  .toQuery();

console.log(qry);
*/

//equivalent SELECT product_id, name, price, category FROM amazong_products WHERE name LIKE '%holo%';
/*
const searchByProductName = searchTerm => {
  knexInstance
    .select("product_id", "name", "price", "category")
    .from("amazong_products")
    .where("name", "ILIKE", `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
};

searchByProductName("holo");
*/

//equivalent SELECT product_id, name, price, category FROM amazong_products LIMIT 10 OFFSET 10;
/*
const paginateProducts = page => {
  const productsPerPage = 10;
  const offset = productsPerPage * (page - 1);
  knexInstance
    .select("product_id", "name", "price", "category")
    .from("amazong_products")
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    });
};

paginateProducts(2);
*/

//equivalent SELECT product_id, name, price, category, image FROM amazong_products WHERE image IS NOT NULL;
/*
const getProductsWithImage = () => {
  knexInstance
    .select("product_id", "name", "price", "category", "image")
    .from("amazong_products")
    .whereNotNull("image")
    .then(result => {
      console.log(result);
    });
};

getProductsWithImage();
*/

//equivalent
//SELECT video_name, region, count(date_viewed) AS views
//FROM whopipe_video_views
//WHERE date_viewed > (now() - '30 days'::INTERVAL) GROUP BY video_name, region
//ORDER BY region ASC, views DESC;

const mostPopularVideosForDays = days => {
  knexInstance
    .select("video_name", "region")
    .count("date_viewed AS views")
    .where(
      "date_viewed",
      ">",
      knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
    )
    .from("whopipe_video_views")
    .groupBy("video_name", "region")
    .orderBy([
      { column: "region", order: "ASC" },
      { column: "views", order: "DESC" }
    ])
    .then(result => {
      console.log(result);
    });
};

mostPopularVideosForDays(30);
