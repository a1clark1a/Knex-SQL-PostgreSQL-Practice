require("dotenv").config();
const knex = require("knex");

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL
});

//DRILL 1
const searchItem = searchTerm => {
  knexInstance
    .select("item_id", "name", "price")
    .from("shopping_list")
    .where("name", "ILIKE", `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
};

//DRILL 2
const paginateItems = page => {
  const itemsPerPage = 6;
  const offset = itemsPerPage * (page - 1);
  knexInstance
    .select("item_id", "name", "price")
    .from("shopping_list")
    .limit(itemsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    });
};

//DRILL 3
const getAllItemsAddedAfterDate = daysAgo => {
  knexInstance
    .select("name", "price", "date_added")
    .where(
      "date_added",
      ">",
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .from("shopping_list")
    .then(result => {
      console.log(result);
    });
};

//DRILL 4
const totalCostForEachCategory = () => {
  knexInstance
    .select("category")
    .from("shopping_list")
    .sum("price AS total")
    .groupBy("category")
    .then(result => {
      console.log(result);
    });
};

totalCostForEachCategory();
