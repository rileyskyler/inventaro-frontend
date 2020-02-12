const { Model } = require("objection");

export class Person extends Model {
  static get tableName() {
    console.log(this);
    return "person";
  }
}
