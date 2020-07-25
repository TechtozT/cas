Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    progs: [],
    criteria: [],
    applications: [],
  },

  // Synchronous operations
  mutations: {
    // payload: {entity["progs" || criteria || applications], index}
    removeEntity(state, payload) {
      const entity = payload.entity;
      return state[entity].splice(payload.index, 1);
    },

    /**
     * update or add new object to an entity.
     * @param payload is the argument which has entity and modified object.
     */
    saveEntity(state, payload) {
      const o = payload.obj;
      const index = state[payload.entity].findIndex((obj) => obj._id === o._id);
      if (index < 0) {
        // o is a new object.
        state[payload.entity][index] = o;
      } else {
        // o is being updated.
        state[payload.entity].push(o);
      }
    },

    loadPrograms(state, progs) {
      this.state.progs = progs;
    },
  },

  // Support asynchronous operations
  actions: {},
});

// Adding new entity does not require different route, just use modal.
// Details should not have different route, just call modal and deserialize the form.
const routes = [
  { path: "/applications", component: casApplications },
  { path: "/criteria", component: casCriteria },
  { path: "/programs", component: casPrograms },
];

const router = new VueRouter({
  routes,
});

const vm = new Vue({
  el: "#app",
  router,
  store,

  data: {
    role: role,
  },

  methods: {
    /**
     * @param arr an array from which we want to find the object.
     * @param filterKey a key in which an object to find contains.
     * @param filterValue a value of the filterKey.
     * @return index of the the object in the arr (-1 if no match found).
     */
    findObject(arr, filterKey, filterValue) {
      let index = arr.findIndex((obj) => obj[filterKey] === filterValue);
      return index;
    },

    isSuper() {
      if (role.toString() === "super") {
        return true;
      }
      return false;
    },

    loadPrograms() {
      axios
        .get("/api/program")
        .then((res) => {
          store.commit("loadPrograms", res.data);
        })
        .catch(function (err) {
          console.log("Error: ", err);
        });
    },
  },
});
