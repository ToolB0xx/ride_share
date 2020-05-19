const { Model } = require("objection");

class Ride extends Model {
  static get tableName() {
    return "ride";
  }
  static get relationMappings() {
    return {
      drivers: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + "/Driver",
        join: {
          from: "ride.id",
          through: {
            from: "drivers.rideId",
            to: "drivers.driverId",
          },
          to: "driver.id",
        },
      },
      vehicle: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + "/Vehicle",
        join: {
          from: "vehicle.id",
          to: "ride.vehicleId",
        },
      },
      passengers: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + "/Passenger",
        join: {
          from: "ride.id",
          through: {
            from: "passengers.rideId",
            to: "passengers.passengerId",
          },
          to: "passenger.id",
        },
      },
      fromLocation: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + "/Location",
        join: {
          from: "location.id",
          to: "ride.fromlocationId",
        },
      },
      toLocation: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + "/Location",
        join: {
          from: "location.id",
          to: "ride.tolocationId",
        },
      },
    };
  }
}

module.exports = Ride;
