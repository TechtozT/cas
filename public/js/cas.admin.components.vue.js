Vue.component("program", {
  template:
  `
  <tr>
    <td>{{ index + 1 }}</td>
    <td @click="viewProg(id)">
      <b> {{ name }} </b>
    </td>
    <td>
      <button @click="viewProg(id)" class="btn btn-sm btn-warning">
        <i class="fas fa-edit"></i>
      </button>
      <button @click="removeProg(id)" class="btn btn-sm btn-danger">
        <i class="fas fa-trash-alt"></i>
      </button>
    </td>
  </tr>
  `,

  methods: {
    
  }
});

Vue.component("program-details", {
  // A modal form which to de-serialize the program data.
});

// Vue.component("add-program", {});

Vue.component("criteria", {
  template: 
  `
  <tr>
    <td>{{ index + 1 }}</td>
    <td @click="viewCriteria(id)">
      <b> {{ name }} </b>
    </td>
    <td>
      <button @click="viewCriteria(id)" class="btn btn-sm btn-warning">
        <i class="fas fa-edit"></i>
      </button>
      <button @click="removeCriteria(id)" class="btn btn-sm btn-danger">
        <i class="fas fa-trash-alt"></i>
      </button>
    </td>
  </tr>
  `
});

Vue.component("criteria-details", {});

// Vue.component("add-criteria", {});

Vue.component("application", {
  template: 
  `
  <tr>
    <td>{{ index + 1 }}</td>
    <td @click="viewApplication(id)">
      <b> {{ name }} </b>
    </td>
    <td>
      <button @click="viewApplication(id)" class="btn btn-sm btn-warning">
        <i class="fas fa-edit"></i>
      </button>
      <button @click="removeApplication(id)" class="btn btn-sm btn-danger">
        <i class="fas fa-trash-alt"></i>
      </button>
    </td>
  </tr>
  `
});

Vue.component("application-details", {});

// Vue.component("new-application", {});


// Views
// Programs
const casPrograms = {
  template: `
  <div class="card">
    <h5 class="card-header alert-light-blue">Select program of your choice</h5>
    <div class="card-body">
    <table class="table">
      <thead>
        <tr>
          <th style="width: 10px"><h5>#</h5></th>
          <th><h5>Program name</h5></th>  
        </tr>
      </thead>
      <tbody v-if="progs && progs.length" class="table-elevate">
        <program v-for="(prog, index) in progs"
        v-bind:id = "prog._id"
        v-bind:key = "prog._id"
        v-bind:index = "index"
        v-bind:name = "prog.name"
        ></program>
      </tbody>
    </table>
    </div>
  </div>
  `,

  methods: {
    viewProg(id){
      // call the modal form with the data of specified program
      const prog = this.$store.state.progs.find(p => p._id === id);
      console.log(prog);
    },

    // Fired when form is submitted.
    saveProg(prog){
      this.$store.commit("saveEntity", {
        entity: "progs",
        o: prog,
      })
    },

    // executed after user has confirmed the deletion operation.
    removeProg(filterKey, filterValue){
      const progs = this.$store.state.progs;
      const index = this.$parent.findObject(progs, filterKey, filterValue)
      const removedObject = this.$store.commit("removeEntity", {
        entity: "progs",
        index: index,
      });

      console.log(removedObject);
    },
  }
};


// Criteria
const casCriteria = {
  template: `
  <div class="">
  
  </div>
  `,

  methods: {
    viewCriteria(id){
      // call the modal form with the data of specified program
      const prog = this.$store.state.progs.find(p => p._id === id);
      console.log(prog);
    },

    // Fired when form is submitted.
    saveCriteria(prog){
      this.$store.commit("saveEntity", {
        entity: "criteria",
        o: prog,
      })
    },

    // executed after user has confirmed the deletion operation.
    removeCriteria(filterKey, filterValue){
      const progs = this.$store.state.progs;
      const index = this.$parent.findObject(progs, filterKey, filterValue)
      const removedObject = this.$store.commit("removeEntity", {
        entity: "criteria",
        index: index,
      });

      console.log(removedObject);
    },
  }
};


// Applications
const casApplications = {
  template: `
  <div class="">
  
  </div>
  `,

  methods: {
    viewApplication(id){
      // call the modal form with the data of specified program
      const prog = this.$store.state.progs.find(p => p._id === id);
      console.log(prog);
    },

    // Fired when form is submitted.
    saveApplication(prog){
      this.$store.commit("saveEntity", {
        entity: "applications",
        o: prog,
      })
    },

    // executed after user has confirmed the deletion operation.
    removeApplication(filterKey, filterValue){
      const progs = this.$store.state.progs;
      const index = this.$parent.findObject(progs, filterKey, filterValue)
      const removedObject = this.$store.commit("removeEntity", {
        entity: "applications",
        index: index,
      });

      console.log(removedObject);
    },
  }
};
