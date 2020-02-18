import { Model } from "objection";
import { Person } from "./models/Person";
import Knex from "knex";

const knex = Knex({
  client: "pg",
  connection: {
    host: "localhost",
    user: "app",
    port: 5432,
    database: "inventaro"
  }
});

Model.knex(knex);

async function main() {
  // const people: any = await Person.query();
  // const person = people[0];
  // console.log(person);
  // console.log(person.age);
  const t = await Person.query().select(["id", "first_name"]);
  console.log(t);
}

main().then(() => knex.destroy());
