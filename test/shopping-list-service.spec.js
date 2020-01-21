const ShoppingListService = require("../src/shopping-list-service");
const knex = require("knex");

describe(`Shopping List service object`, () => {
  let db;
  let testItem = [
    {
      item_id: 1,
      name: "Fish tricks",
      price: "13.10",
      category: "Main",
      checked: false,
      date_added: new Date()
    },
    {
      item_id: 2,
      name: "Not Dogs",
      price: "4.99",
      category: "Snack",
      checked: true,
      date_added: new Date()
    },
    {
      item_id: 3,
      name: "Bluffalo Wings",
      price: "5.50",
      category: "Snack",
      checked: false,
      date_added: new Date()
    },
    {
      item_id: 4,
      name: "SubstiTuna Salad",
      price: "1.24",
      category: "Lunch",
      checked: false,
      date_added: new Date()
    }
  ];

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
  });

  before(() => {
    return db("shopping_list").truncate();
  });

  afterEach(() => {
    return db("shopping_list").truncate();
  });

  after(() => db.destroy());

  context(`given that shopping_list has data`, () => {
    beforeEach(() => {
      return db.into("shopping_list").insert(testItem);
    });

    it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
      return ShoppingListService.getAllItems(db).then(actual => {
        expect(actual).to.eql(testItem);
      });
    });

    it(`getById() resolves all articles from 'shopping_list' table`, () => {
      const fourthId = 4;
      const fourthTestItem = testItem[fourthId - 1];
      return ShoppingListService.getById(db, fourthId).then(actual => {
        expect(actual).to.eql({
          item_id: fourthId,
          name: fourthTestItem.name,
          price: fourthTestItem.price,
          category: fourthTestItem.category,
          checked: false,
          date_added: fourthTestItem.date_added
        });
      });
    });

    it(`deleteItem removes an Item by ID from 'shopping_list' tables`, () => {
      const itemId = 3;
      return ShoppingListService.deleteItem(db, itemId)
        .then(() => {
          return ShoppingListService.getAllItems(db);
        })
        .then(allItems => {
          const expected = testItem.filter(item => item.item_id !== itemId);
          expect(allItems).to.eql(expected);
        });
    });

    it(`updateItem() updates an item from the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3;
      const newItemData = {
        name: "Fish balls",
        price: "1.52",
        category: "Snack",
        checked: true,
        date_added: new Date()
      };
      return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => {
          return ShoppingListService.getById(db, idOfItemToUpdate);
        })
        .then(item => {
          expect(item).to.eql({
            item_id: idOfItemToUpdate,
            ...newItemData
          });
        });
    });
  });

  context(`Given 'shopping_list has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return ShoppingListService.getAllItems(db).then(actual => {
        expect(actual).to.eql([]);
      });
    });

    it(`insertItem() inserts a new item and resolves the new item with an id`, () => {
      const newItem = {
        name: "test new name",
        price: "100.00",
        category: "Snack",
        checked: false,
        date_added: new Date()
      };
      return ShoppingListService.insertItem(db, newItem).then(actual => {
        expect(actual).to.eql({
          item_id: 1,
          name: newItem.name,
          price: newItem.price,
          category: newItem.category,
          checked: newItem.checked,
          date_added: new Date(newItem.date_added)
        });
      });
    });
  });
});
