const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url = "mongodb://localhost:27017";

const dbName = "test_db";

MongoClient.connect(url, function (err, client) {
  assert.equal(null, err);

  console.log("Connected to server");

  const db = client.db(dbName);

  db.collection("aapl", function (err, collection) {
    collection.find().toArray(function (err, items) {
      console.log(items);
    });
  });

  client.close();
});
