// Gabriel Gonzalez and Jared Souther
const knex = require('knex')({
  client: 'pg', 
  connection: { 
      host: 'faraday.cse.taylor.edu',
      user: 'gabriel_gonzalez', 
      password: 'kequfaje',
      database: 'gabriel_gonzalez'
  } 
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
				  capacity: Joi.number().integer().required(),
				  mpg: Joi.number().required(),
				  licenseState: Joi.string().required(),
				  licenseNumber: Joi.string().required()
				}),
			  },
			},
			handler: async (request, h) => {
			  const newVehicle = await Vehicle.query().insert( {
        make: request.payload.make,
        model: request.payload.model,
        color: request.payload.color,
        capacity: request.payload.capacity,
        mpg: request.payload.mpg,
        licenseState: request.payload.licenseState,
        licenseNumber: request.payload.licenseNumber
        });
        if (newVehicle) {
          return {
            ok: true,
            msge: `Registered Vehicle`,
          };
        }
        else {
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
				  licenseNumber: Joi.string().required()
				}),
			  },
			},
			handler: async (request, h) => {
			  const newDriver = await Driver.query().insert( {
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        phone: request.payload.phone,
        licenseNumber: request.payload.licenseNumber
        });
        if (newDriver) {
          return {
            ok: true,
            msge: `Driver Successfully Registered`,
          };
        }
        else {
          return {
            ok: false,
            msge: `Failed to Register Driver`,
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
