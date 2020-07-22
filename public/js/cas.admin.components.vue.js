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




Vue.component("new-program-modal", {
  props: ["progs"],
  template:
  `
    <div
    class="modal fade"
    id="newCriteriaModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="newCriteriaModal"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="newCriteriaModalTitle">
            Create new Program
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form id="newCriteria">
            
            <div class="form-group">
              <label>Program name</label>
              <select name="program" class="form-control select2bs4" style="width: 100%;">
                <option v-for ="prog in progs" :value = "prog._id" selected="selected">{{ prog.name }}</option>
              </select>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Maximum allocation</label>
                  <input value="0" name="maxCandidates" class="form-control" type="number">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Males/Female ratio (%)</label>
                  <input value="0" name="malesToFemalesRatio" class="form-control" type="number">
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Program criteria</label>
              <select name="criteria" class="form-control select2bs4" style="width: 100%;">
                <option value="_id" selected="selected">Default TCU criteria</option>
                <option value="_id">Criteria 001</option>
                <option value="_id">Criteria for IT</option>
              </select>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>A-level/Diploma (%)</label>
                  <input value="0" name="aLevelToDiplomaRatio" class="form-control" type="number">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>A-Level/Diploma Factor (%)</label>
                  <input value="0" name="aLevelToDiplomaFactor" class="form-control" type="number">
                </div>
              </div>
            </div>


              
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
          >
            Close
          </button>
          <button @click="submitCriteria()" type="button" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  </div>

  `,


  created() {
    // Fetch all programs
    if (this.$store.state['progs'].length <= 0){
      this.$parent.loadPrograms()
    }
  },
  methods: {
    submitCriteria(){
      const crit = $("#newCriteria").serializeObject();
      // push the criteria to the state.
      this.$store.commit("saveEntity", {
        entity: "criteria",
        obj: crit,
      })
      // submit the form.
      console.log(crit);
    }
  }
});




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
