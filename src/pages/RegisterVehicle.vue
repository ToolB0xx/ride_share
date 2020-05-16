<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Register Vehicle</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <instructions details="Register Your Vehicle Here" />
            <v-form v-model="valid">
              <v-text-field
                v-model="newVehicle.make"
                label="Make"
                v-bind:rules="rules.req"
              ></v-text-field>

              <v-text-field
                v-model="newVehicle.model"
                label="Model"
                v-bind:rules="rules.req"
              ></v-text-field>

              <v-text-field
                v-model="newVehicle.color"
                label="Color"
                v-bind:rules="rules.req"
              ></v-text-field>

              <v-text-field
                v-model="newVehicle.capacity"
                label="Capacity"
                v-bind:rules="rules.int"
              ></v-text-field>

              <v-text-field
                v-model="newVehicle.mpg"
                label="MPG"
                v-bind:rules="rules.int"
              ></v-text-field>

              <v-text-field
                v-model="newVehicle.licenseState"
                label="License State"
                v-bind:rules="rules.req"
              ></v-text-field>

              <v-text-field
                v-model="newVehicle.licenseNumber"
                label="License Number"
                v-bind:rules="rules.req"
              ></v-text-field>

              <v-btn v-bind:disabled="!valid" v-on:click="registerVehicle">
                Register Vehicle
              </v-btn>
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
                      <v-btn color="primary" text v-on:click="hideDialog">Okay</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Instructions from "../components/Instructions.vue";
export default {
  name: "RegisterVehicle",
  components: {
    Instructions, 
  },
  data: function () {
    return {
      valid: false, 
      newVehicle: {
        make: "",
        model: "",
        color: "",
        capacity: "",
        mpg: "",
        licenseState: "",
        licenseNumber: "",
      },
      vehicleCreated: false,
      dialogHeader: "<no dialogHeader>",
      dialogText: "<no dialogText>",
      dialogVisible: false,

      rules: {
        req: [(val) => val.length > 0 || "Required"],
        int: [
            (val) => /[0-9]+$/.test(val) || "Numerical Only",
        ],
      },
    };
  },
  methods: {
    registerVehicle: function () {
      this.vehicleCreated = false;

      this.$axios.post("/vehicle", {
          make: this.newVehicle.make,
          model: this.newVehicle.model,
          color: this.newVehicle.color,
          capacity: this.newVehicle.capacity,
          mpg: this.newVehicle.mpg,
          licenseState: this.newVehicle.licenseState,
          licenseNumber: this.newVehicle.licenseNumber,
      })
      .then((result) => {
        if (result.data.ok) {
          this.showDialog("Success", result.data.msge);
          this.accountCreated = true;
        } else {
          this.showDialog("Sorry", result.data.msge);
        }
      })
      .catch((err) => this.showDialog("Failed", err));
    },

    // Helper method to display the dialog box with the appropriate content.
    showDialog: function (header, text) {
      this.dialogHeader = header;
      this.dialogText = text;
      this.dialogVisible = true;
    },
    hideDialog: function () {
      this.dialogVisible = false;
      if (this.accountCreated) {
        this.$router.push({ name: "home" });
      }
    }
  },
};

</script>
