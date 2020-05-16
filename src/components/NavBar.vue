<template>
  <v-app-bar app dark color="primary">
    <router-link v-bind:to="{ name: 'home' }">
      <v-toolbar-title class="white--text">
        EZ-Ride
      </v-toolbar-title>
    </router-link>

    <v-spacer></v-spacer>

    <v-btn text v-bind:to="{ name: 'home' }">Home Page</v-btn>
    <v-btn text v-bind:to="{ name: 'register-ride' }">Register Ride</v-btn>
    <v-btn text v-bind:to="{ name: 'register-driver' }">Register Driver</v-btn>
    <v-btn text v-bind:to="{ name: 'register-vehicle' }">Register Vehicle</v-btn>
    <v-btn text v-bind:to="{ name: 'authorize' }">Authorize</v-btn>
    <v-btn text v-bind:to="{ name: 'rides' }">Rides</v-btn>


  </v-app-bar>
</template>