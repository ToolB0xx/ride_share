import Vue from "vue";
import Router from "vue-router";

import Home from "./pages/Home.vue";
import RegisterRide from "./pages/RegisterRide.vue";
import RegisterDriver from "./pages/RegisterDriver.vue";
import Authorize from "./pages/Authorize.vue";
import Rides from "./pages/Rides.vue";
import RegisterVehicle from "./pages/RegisterVehicle.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { name: "home", path: "/", component: Home },
    { name: "register-ride", path: "/register-ride", component: RegisterRide },
    {
      name: "register-driver",
      path: "/register-driver",
      component: RegisterDriver,
    },
    { name: "authorize", path: "/authorize", component: Authorize },
    { name: "rides", path: "/rides", component: Rides },
    {
      name: "register-vehicle",
      path: "/register-vehicle",
      component: RegisterVehicle,
    },
  ],
});
