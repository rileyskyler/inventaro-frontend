import Knex from "knex";
const KnexConfig = require("../knexfile");

const { Model } = require("objection");
const { Person } = require("./models/Person");

const knex = Knex(KnexConfig.development);

Model.knex(knex);

const main = async () => {
  const person = await Person.query()
    .findById(1)
    .column("id")
    .as("fart");
};

main().then(() => knex.destroy());
