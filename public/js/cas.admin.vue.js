Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    progs: [],
    criteria: [],
    applications: [],
    progsAdm: [],
    role: null,
    institutions: [],
    users: [],
    attributes: undefined,
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

    loadAdminPrograms(state, progs) {
      this.state.progsAdm = progs;
    },

    loadCriteria(state, crit) {
      this.state.criteria = crit;
    },

    initRole(state, role) {
      this.state.role = role;
    },

    loadInstitutions(state, inst) {
      this.state.institutions = inst;
    },

    loadUsers(state, users) {
      this.state.users = users;
    },

    loadAttr(state, attr) {
      this.state.attributes = attr;
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
  { path: "/institutions", component: casInstitutions },
  { path: "/users", component: casUsers },
  { path: "/results", component: casSchoolResults },
  { path: "/attributes", component: casAttributes },
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

    loadAdminPrograms() {
      axios
        .get("/admin/programs")
        .then((res) => {
          store.commit("loadAdminPrograms", res.data);
        })
        .catch(function (err) {
          console.log("Error: ", err);
        });
    },

    loadCriteria() {
      axios
        .get("/admin/criteria")
        .then((res) => {
          store.commit("loadCriteria", res.data);
        })
        .catch(function (err) {
          console.log("Error: ", err);
        });
    },

    loadInstitutions() {
      axios
        .get("/admin/institution")
        .then((res) => {
          store.commit("loadInstitutions", res.data);
        })
        .catch((err) => {
          console.log("Error: ", err);
        });
    },

    loadUsers() {
      axios
        .get("/admin/users")
        .then((res) => {
          if (res.data) {
            store.commit("loadUsers", res.data);
          }
        })
        .catch((err) => {
          alert("There was an error fetching users");
        });
    },

    loadAttr() {
      axios
        .get("/admin/attributes")
        .then((res) => {
          store.commit("loadAttr", res.data);
        })
        .catch((err) => {
          alert("There was an error");
        });
    },
  },
});
