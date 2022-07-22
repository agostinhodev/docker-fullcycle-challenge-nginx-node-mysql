const express = require("express");
const Fakerator = require("fakerator");

const app = express();
const port = 3000;
const config = {
  host: "fullcycle-database",
  user: "root",
  password: "root",
  database: "nodedb",
};
const mysql = require("mysql");

app.get("/", async (req, res) => {
  //Generate a random name
  const fakerator = Fakerator("pt-BR");

  const connection = mysql.createConnection(config);

  //Try to create a new table
  connection.query(
    "CREATE TABLE IF NOT EXISTS people (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(50), PRIMARY KEY (id));"
  );

  //Generate a Random Name and insert it at database
  const randomName = fakerator.names.name();
  connection.query(`INSERT INTO people (name) values('${randomName}')`);

  //Retrieve the current people table list

  const queryPromise = new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM people ORDER BY name ASC;",
      function (error, results) {
        if (error) reject(error);

        resolve(results);
      }
    );
  });

  const people = await queryPromise;

  connection.end();

  const response = `
    <div>
      <h1>Full Cycle Rocks!</h1><br>
      The last inserted name was ${randomName}<hr>
      The current list of people:<br>
      <ul>
      ${people.map((person) => `<li>${person.name}</li>`).join("")}
      </ul>
    </div>
    `;

  res.send(response);
});

app.listen(port, () => {
  console.log(`It works and running at ${port}`);
});
