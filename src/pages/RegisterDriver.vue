<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>EZ-Ride Driver Registration</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <instructions details="Register As A Driver Here" />
            <v-form v-model="valid">
              <v-text-field
                v-model="newDriver.firstName"
                label="First Name"
                v-bind:rules="rules.req"
              ></v-text-field>

              <v-text-field
                v-model="newDriver.lastName"
                label="Last Name"
                v-bind:rules="rules.req"
              ></v-text-field>

              <v-text-field
                v-model="newDriver.phone"
                label="Phone"
                v-bind:rules="rules.int"
              ></v-text-field>

              <v-text-field
                v-model="newDriver.licenseNumber"
                label="License Number"
                v-bind:rules="rules.req"
              ></v-text-field>
              <v-btn v-bind:disabled="!valid" v-on:click="registerDriver">
                Register As A Driver
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
  name: "RegisterDriver",
  components: {
    Instructions, 
  },
  data: function () {
    return {
      valid: false, 
      newDriver: {
        firstName: "",
        lastName: "",
        phone: "",
        licenseNumber: "",
      },
      driverCreated: false,
      dialogHeader: "<no dialogHeader>",
      dialogText: "<no dialogText>",
      dialogVisible: false,

      rules: {
        req: [(val) => val.length > 0 || "Required"],
        int: [
            (val) => /[0-9]+$/.test(val) || "Numbers Only",
        ],
      },
    };
  },
  methods: {
    registerDriver: function () {
      this.driverCreated = false;

      this.$axios.post("/driver", {
          firstName: this.newDriver.firstName,
          lastName: this.newDriver.lastName,
          phone: this.newDriver.phone,
          licenseNumber: this.newDriver.licenseNumber,
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
