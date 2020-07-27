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

Vue.component("new-criteria-modal", {
  props: ["criteria"],
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
            Create new Criteria
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
              <label>Criteria Name</label>
              <input name="name" class="form-control" type="text" placeholder="Name to identify this criteria">
            </div>  

            <div class="row">
              <div class="col-md-8" data-select2-id="7">
                <div class="form-group">
                  <label>Programs</label>
                  <select name="programs[]" class="select2" multiple="multiple" data-placeholder="Select Programs" style="width: 100%;">
                    <option>PCM</option>
                    <option>PCB</option>
                    <option>PGM</option>
                    <option>CBG</option>
                    <option>HKL</option>
                    <option>BCOM</option>
                    <option>PCOM</option>
                  </select>
                </div>
              </div>

              <div class="col-md-4">
                <div class="form-group">
                  <label>Grade Point</label>
                  <input value="0" name="gradPoint" class="form-control" type="number">
                </div>
              </div>
            </div>

            <p class="alert alert-light-blue">Mandatory Subjects</p>
            <div v-for="i in 3" class="row">
                <div class="col-md-8">
                  <label> Subject Name </label>
                  <select name="manSubs[]" class="select2" data-placeholder="Select Programs" style="width: 100%;">
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Mathematics</option>
                    <option>Biology</option>
                    <option>Geography</option>
                    <option>History</option>
                    <option>Computer</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label>Grade</label>
                    <select name="manGrades[]" class="select2" data-placeholder="Grade" style="width: 100%;">
                    <option>A</option>
                    <option>B+</option>
                    <option>B</option>
                    <option>C</option>
                    <option>D</option>
                    <option>E</option>
                    <option>S</option>
                  </select>
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
          <button 
          @click="submitCriteria()" 
          type="button" class="btn btn-primary"
          data-dismiss="modal"
          >Save</button>
        </div>
      </div>
    </div>
  </div>

  `,

  methods: {
    submitCriteria(){
      const crit = $("#newCriteria").serializeObject();

      const c = {};
      c.programs = crit.programs;
      c.name = crit.name;
      c.mandatorySubs = [];
      // const manSubs = crit.manSubs;
      let o = {};
      crit.manSubs.forEach((sub, i)=>{
        o[sub] = crit.manGrades[i];
        c.mandatorySubs.push(o);
        o = {}
      });

      // push the criteria to the state.
      this.$store.commit("saveEntity", {
        entity: "criteria",
        obj: c,
      });

      axios.post("/admin/criteria", c).then(res =>{
        $('#newCriteriaModal').modal('hide');
        if(res.data){
          Toast.fire({
            type: "success",
            title: "Successfully initiated your application, please proceed",
          });
        }
      }).catch(err =>{
        // remove last added criteria
        this.$store.commit("removeEntity", {
          entity: "criteria",
          index: this.$store.state.criteria.length,
        });
        Toast.fire({
          type: "error",
          title: "There was an error saving the criteria",
        });
      })
    }
  }
});

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
    id="newProgramModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="newProgramModal"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="newProgramModalTitle">
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
          <form id="newProgram">
            
            <div class="form-group">
              <label>Program name</label>
              <select name="program" class="form-control select2bs4" style="width: 100%;">
                <option v-for ="prog in progs" :value = "prog._id" selected="selected">{{ prog.name }}</option>
              </select>
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
          <button @click="submitProgram()" type="button" class="btn btn-primary">Save</button>
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
    submitProgram(){
      const crit = $("#newProgram").serializeObject();
      // push the program to the state.
      this.$store.commit("saveEntity", {
        entity: "progs",
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
