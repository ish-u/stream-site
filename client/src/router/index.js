import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import SignIn from "../views/SignIn.vue";
import SignUp from "../views/SignUp.vue";
import Profile from "../views/Profile.vue";
import Stream from "../views/Stream.vue";
import Error404 from "../views/Error404.vue";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/signup",
    name: "Sign Up",
    component: SignUp,
  },
  {
    path: "/signin",
    name: "Sign In",
    component: SignIn,
  },
  {
    path: "/me",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/:user",
    name: "Stream",
    component: Stream,
    props: true,
  },
  {
    path: "*",
    name: "404",
    component: Error404,
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue"),
  // },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// authentication middleware using Navigation Guards
router.beforeEach((to, from, next) => {
  const publicPages = ["Sign In", "Sign Up", "Home", "Stream"];
  const needAuth = !publicPages.includes(to.name);
  const isLoggedIn = store.getters.isLoggedIn;
  if (needAuth && !isLoggedIn) {
    next({ name: "Sign In" });
  }
  next();
});

export default router;
