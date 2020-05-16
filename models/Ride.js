const { Model } = require("objection");

class Ride extends Model {
  static get tableName() {
      return 'ride';
  }
  static get relationMappings() {
		return {
			drivers: {
				relation: Model.ManyToManyRelation,
				modelClass: __dirname + "/Driver",
				join: {
					from: 'ride.id',
					through: {
						from: 'drivers.rideid',
						to: 'drivers.driverid'
					},
					to: 'driver.id'
				}
			},
			vehicle: {
				relation: Model.BelongsToOneRelation,
				modelClass: __dirname + "/Vehicle",
				join: {
					from: 'vehicle.id',
					to: 'ride.vehicleid'
				}
			},
			passengers: {
				relation: Model.ManyToManyRelation,
				modelClass: __dirname + "/Passenger",
				join: {
					from: 'ride.id',
					through: {
						from: 'passengers.rideid',
						to: 'passengers.passengerid'
					},
					to: 'passenger.id'
				}
			},
			fromLocation: {
				relation: Model.BelongsToOneRelation,
				modelClass: __dirname + "/Location",
				join: {
					from: 'location.id',
					to: 'ride.fromlocationid'
				}
			},
			toLocation: {
				relation: Model.BelongsToOneRelation,
				modelClass: __dirname + "/Location",
				join: {
					from: 'location.id',
					to: 'ride.tolocationid'
				}
			}
		}
	}
}

module.exports = Ride;
