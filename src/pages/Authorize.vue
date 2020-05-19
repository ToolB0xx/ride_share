<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Authorize EZ-Drivers for EZ-Rides</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <instructions details="Authorize Driver Here" />
            <v-form v-model="valid">
              <v-text-field
                v-model="auth.firstName"
                v-bind:rules="rules.req"
                label="Driver's First Name"
                required
              >
              </v-text-field>
              <v-text-field
                v-model="auth.lastName"
                v-bind:rules="rules.req"
                label="Driver's Last Name"
                required
              >
              </v-text-field>
              <v-text-field
                v-model="auth.licensePlate"
                v-bind:rules="rules.req"
                label="License Plate"
              >
              </v-text-field>
              <v-btn v-bind:disabled="!valid" v-on:click="authorizeDriver">
                Authorize
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
                      >Okay</v-btn
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
export default {
  name: "AuthorizeDriver",
  data: function() {
    return {
      valid: false,
      auth: {
        firstName: "",
        lastName: "",
        licensePlate: "",
      },
      driverAuthorized: false,
      dialogHeader: "<no dialogHeader>",
      dialogText: "<no dialogText>",
      dialogVisible: false,
      rules: {
        req: [(val) => val.length > 0 || "Required"],
      },
    };
  },
  methods: {
    authorizeDriver: function() {
      this.driverAuthorized = false;

      this.$axios
        .post("/authorization", {
          firstName: this.auth.firstName,
          lastName: this.auth.lastName,
          licensePlate: this.auth.licensePlate,
        })
        .then((result) => {
          if (result.data.ok) {
            this.showDialog("Successful", result.data.msge);
            this.driverAuthorized = true;
          } else {
            this.showDialog("Unsuccessful", result.data.msge);
          }
        })
        .catch((err) => this.showDialog("Error", err));
    },
    showDialog: function(header, text) {
      this.dialogHeader = header;
      this.dialogText = text;
      this.dialogVisible = true;
    },
    hideDialog: function() {
      this.dialogVisible = false;
      if (this.driverAuthorized) {
        this.$router.push({ name: "home" });
      }
    },
  },
};
</script>
