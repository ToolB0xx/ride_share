<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Registering is EZ</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <instructions details="Register As A Passenger Here" />
            <v-form v-model="valid">
              <v-text-field
                v-model="ride.date"
                label="Date (MM-DD-YYYY)"
                v-bind:rules="rules.req"
              >
              </v-text-field>
              <v-text-field
                v-model="ride.time"
                label="Time (HH-MM)"
                v-bind:rules="rules.req"
              >
              </v-text-field>
              <v-text-field
                v-model="ride.distance"
                label="Distance (Miles)"
                v-bind:rules="rules.float"
              >
              </v-text-field>
              <v-text-field
                v-model="ride.fuelPrice"
                label="Fuel Cost (USD)"
                v-bind:rules="rules.float"
              >
              </v-text-field>
              <v-text-field
                v-model="ride.fee"
                label="Fee (USD)"
                v-bind:rules="rules.float"
              >
              </v-text-field>
              <v-select
                v-model="ride.vehicleId"
                :items="vehicleList"
                label="Vehicle"
              >
              </v-select>
              <v-text-field
                v-model="ride.fromLocationId"
                label="From Location"
                v-bind:rules="rules.req"
              >
              </v-text-field>
              <v-text-field
                v-model="ride.toLocationId"
                label="To Location"
                v-bind:rules="rules.req"
              >
              </v-text-field>
              <v-btn v-bind:disabled="!valid" v-on:click="registerRide">
                Register as a Passenger
              </v-btn>
            </v-form>
            <div class="text-xs-center">
              <v-dialog v-model="dialogVisible" width="500">
                <v-card>
                  <v-card-title primary-title>
                    {{ dialogHeader }}
                  </v-card-title>

                  <v-card-text>
                    {{ dialogText }}
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text v-on:click="hideDialog"
                      >OK</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Instructions from "../components/Instructions.vue";

export default {
  name: "RegisterRide",
  components: {
    Instructions,
  },
  data: function() {
    return {
      valid: false,

      ride: {
        date: "",
        time: "",
        distance: "",
        fuelPrice: "",
        fee: "",
        vehicleId: "",
        fromLocationId: "",
        toLocationId: "",
      },
      vehicleList: [],
      rideCreated: false,
      dialogHeader: "<no dialogHeader>",
      dialogText: "<no dialogText>",
      dialogVisible: false,
      rules: {
        req: [(val) => val.length != 0 || "Required"],
        int: [(val) => /[0-9]+$/.test(val) || "Invalid number"],
        float: [(val) => /[0-9]+.*[0-9]*$/.test(val) || "Invalid number"],
      },
    };
  },

  mounted: function() {
    this.$axios.get("/getVehicles").then((response) => {
      this.vehicleList = response.data.map(function(obj) {
        return obj.id;
      });
    });
  },

  methods: {
    registerRide: function() {
      this.rideCreated = false;

      this.$axios
        .post("/ride", {
          date: this.ride.date,
          time: this.ride.time,
          vehicleId: this.ride.vehicleId,
          fuelPrice: this.ride.fuelPrice,
          fee: this.ride.fee,
          distance: this.ride.distance,
          fromLocationId: this.ride.fromLocationId,
          toLocationId: this.ride.toLocationId,
        })
        .then((result) => {
          if (result.data.ok) {
            this.showDialog("Successful", result.data.msge);
            this.rideCreated = true;
          } else {
            this.showDialog("Unsuccessful", result.data.msge);
          }
        })

        .catch((err) => {
          this.showDialog("Error", err);
        });
    },

    showDialog: function(header, text) {
      this.dialogHeader = header;
      this.dialogText = text;
      this.dialogVisible = true;
    },

    hideDialog: function() {
      this.dialogVisible = false;
      if (this.rideCreated) {
        this.$router.push({ name: "home" });
      }
    },
  },
};
</script>
