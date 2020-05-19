const { Model } = require("objection");

class Authorization extends Model {
  static get tableName() {
    return "authorization";
  }

  static get idColumn() {
    return ["driverId", "vehicleId"];
  }

  static get relationMappings() {
    return {
      driver: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + "/Driver",
        join: {
          from: "authorizations.id",
          to: "driver.id",
        },
      },
      vehicle: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + "/Vehicle",
        join: {
          from: "authorizations.vehicleId",
          to: "vehicle.id",
        },
      },
    };
  }
}

module.exports = Authorization;
