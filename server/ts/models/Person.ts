import { Model } from "objection";

export class Person extends Model {
  // birth_date: any;
  static get tableName() {
    return "person";
  }

  static get idColumn() {
    return "id";
  }

  static get virtualAttributes() {
    return ["age"];
  }

  get age() {
    return 23;
  }
}
