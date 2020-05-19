// Gabriel Gonzalez and Jared Souther
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "faraday.cse.taylor.edu",
    user: "gabriel_gonzalez",
    password: "kequfaje",
    database: "gabriel_gonzalez",
  },
});

// Objection
const objection = require("objection");
objection.Model.knex(knex);

// Models
const Authorization = require("./models/Authorization");
const Driver = require("./models/Driver.js");
const Location = require("./models/Location.js");
const Passenger = require("./models/Passenger.js");
const Ride = require("./models/Ride.js");
const State = require("./models/State.js");
const Vehicle = require("./models/Vehicle.js");

// Hapi
const Joi = require("@hapi/joi"); // Input validation
const Hapi = require("@hapi/hapi"); // Server

const server = Hapi.server({
  host: "localhost",
  port: 3000,
  routes: {
    cors: true,
  },
});

async function init() {
  // Show routes at startup.
  await server.register(require("blipp"));

  // Output logging information.
  await server.register({
    plugin: require("hapi-pino"),
    options: {
      prettyPrint: true,
    },
  });

  // Configure routes.
  server.route([
    {
      method: "POST",
      path: "/vehicle",
      config: {
        description: "Register a new vehicle",
        validate: {
          payload: Joi.object({
            make: Joi.string().required(),
            model: Joi.string().required(),
            color: Joi.string().required(),
            capacity: Joi.number()
              .integer()
              .required(),
            mpg: Joi.number().required(),
            licenseState: Joi.string().required(),
            licenseNumber: Joi.string().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const newVehicle = await Vehicle.query().insert({
          make: request.payload.make,
          model: request.payload.model,
          color: request.payload.color,
          capacity: request.payload.capacity,
          mpg: request.payload.mpg,
          licenseState: request.payload.licenseState,
          licenseNumber: request.payload.licenseNumber,
        });
        if (newVehicle) {
          return {
            ok: true,
            msge: `Registered Vehicle`,
          };
        } else {
          return {
            ok: false,
            msge: `Failed to Register Vehicle`,
          };
        }
      },
    },
    {
      method: "POST",
      path: "/driver",
      config: {
        description: "Register a new driver",
        validate: {
          payload: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            phone: Joi.string().required(),
            licenseNumber: Joi.string().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const newDriver = await Driver.query().insert({
          firstName: request.payload.firstName,
          lastName: request.payload.lastName,
          phone: request.payload.phone,
          licenseNumber: request.payload.licenseNumber,
        });
        if (newDriver) {
          return {
            ok: true,
            msge: `Driver Successfully Registered`,
          };
        } else {
          return {
            ok: false,
            msge: `Failed to Register Driver`,
          };
        }
      },
    },
    {
      method: "POST",
      path: "/authorization",
      config: {
        description: "Authorize Driver for Vehicle",
        validate: {
          payload: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            licensePlate: Joi.string().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const driver = await Driver.query()
          .where({
            firstName: request.payload.firstName,
            lastName: request.payload.lastName,
          })
          .select("id")
          .first();
        const vehicle = await Vehicle.query()
          .where("licenseNumber", request.payload.licensePlate)
          .select("id")
          .first();
        const auth = await Authorization.query().insert({
          driverId: driver.id,
          vehicleId: vehicle.id,
        });
        if (auth) {
          return {
            ok: true,
            msge: `${request.payload.firstName} ${request.payload.lastName} is now authorized to use ${request.payload.licensePlate}.`,
          };
        } else {
          return {
            ok: false,
            msge: `Authorization failed.`,
          };
        }
      },
    },
    {
      method: "GET",
      path: "/getVehicles",
      config: {
        description: "Gets Vehicles",
      },
      handler: (request, h) => {
        return Vehicle.query().select("id");
      },
    },
    {
      method: "POST",
      path: "/ride",
      config: {
        description: "Register a Ride",
        validate: {
          payload: Joi.object({
            date: Joi.string().required(),
            time: Joi.string().required(),
            vehicleId: Joi.number().required(),
            fuelPrice: Joi.number().required(),
            fee: Joi.number().required(),
            distance: Joi.number().required(),
            fromLocationId: Joi.number().required(),
            toLocationId: Joi.number().required(),
          }),
        },
      },
      handler: async (request, h) => {
        console.log(request.payload);
        const ride = await Ride.query().insert({
          date: request.payload.date,
          time: request.payload.time,
          vehicleId: request.payload.vehicleId,
          fuelPrice: request.payload.fuelPrice,
          fee: request.payload.fee,
          distance: request.payload.distance,
          /*fromLocationId: request.payload.fromLocationId,
					toLocationId: request.payload.toLocationId,*/
        });
        if (ride) {
          return {
            ok: true,
            msge: `Ride Registered.`,
          };
        } else {
          return {
            ok: false,
            msge: `Failed to register ride.`,
          };
        }
      },
    },
  ]);

  // Start the server.
  await server.start();
}

process.on("unhandledRejection", (err) => {
  server.logger().error(err);
  process.exit(1);
});

// Go!
init();
