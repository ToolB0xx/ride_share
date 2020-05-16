<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Registering is EZ!</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="firstname"
                label="First Name"
                name="firstname"
                type="text"
              />
              <v-text-field
                v-model="lastname"
                label="Last Name"
                name="lastname"
                type="text"
              />
              <v-text-field
                v-model="phone"
                label="Phone"
                name="phone"
                type="tel"
              />
              <v-text-field
                v-model="pickup"
                label="Pick-Up Location"
                name="pickup"
                type="text"
              />
              <v-text-field
                v-model="dropoff"
                label="Drop-Off Location"
                name="dropoff"
                type="text"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn v-on:click="registerRide" color="primary">Get an EZ-Ride!</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show">
      {{ snackbar.msge }}
      <v-btn text color="primary" @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",

      snackbar: {
        show: false,
        msge: "",
      },
    };
  },

  methods: {
    registerRide() {
      this.$axios
        .post("/register-ride", {
          email: this.email,
          password: this.password,
        })
        .then((result) => {
          this.showSnackbar(result.data.msge);
          if (result.data.ok) {
            this.$store.commit("register-ride", result.data.details);
            this.$router.push({ name: "home-page" });
          }
        })
        .catch((err) => this.showSnackbar(err));
    },

    showSnackbar(msge) {
      this.snackbar.msge = msge;
      this.snackbar.show = true;
    },
  },
};
</script>