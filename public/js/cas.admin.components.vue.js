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
                  <input type="number" value="0" name="gradPoint" class="form-control">
                </div>
              </div>
            </div>

            <p class="alert alert-light-blue">Mandatory Subjects</p>
            <div v-for="i in 2" class="row">
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
      c.name = crit.name;
      c.school = {}
      c.school.programs = crit.programs;
      c.school.gradPoint = crit.gradPoint;
      c.school.mandatorySubs = [];
      // const manSubs = crit.manSubs;
      let o = {};
      crit.manSubs.forEach((sub, i)=>{
        o.name = sub;
        o.grade = crit.manGrades[i];
        c.school.mandatorySubs.push(o);
        o = {}
      });
    
      axios.post("/admin/criteria", c).then(res =>{
        $('#newCriteriaModal').modal('hide');
        // push the criteria to the state.
        this.$store.commit("saveEntity", {
          entity: "criteria",
          obj: res.data,
        });
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


Vue.component("criteria", {
  props: ["name", "index", "id"],
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
  `,

  methods:{
    viewCriteria(id){
      // call the modal form with the data of specified program
      /* const crit = this.$store.state.criteria.find(p => p._id === id);
      const manSubs = [];
      const manGrades = [];

      for(let c in crit.mandatorySubs){
        console.log(c)
        manSubs.push(c.name);
        manGrades.push(c.grade);
      }

      $('#critName').val(crit.name);
      $('#critMandatorySubs').val(crit.mandatorySubs);
      $('#critPrograms').val(crit.programs);
      $('#critGradPoint').val(crit.gradPoint); */

      $("#newCriteriaModal").modal("show");

    },
  }
});


// Criteria
const casCriteria = {
  template: `
  <div class="card">
    <h5 class="card-header alert-light-blue">Criteria</h5>
    <div class="card-body">
      <table class="table">
        <thead>
          <tr>
            <th style="width: 10px"><h5>#</h5></th>
            <th><h5>Criteria name</h5></th> 
            <th style="width: 10%; text-align: right"><h5>Actions</h5></th>  
          </tr>
        </thead>
        <tbody v-if="this.$store.state.criteria && this.$store.state.criteria" class="table-elevate">
          <criteria v-for="(crit, index) in this.$store.state.criteria"
          v-bind:key = "crit._id"
          v-bind:id = "crit._id"
          v-bind:index = "index"
          v-bind:name = "crit.name"
          ></criteria>
        </tbody>
      </table>
    </div>
  </div>
  `,

  created(){
    // load all criteria.
    axios.get("/admin/criteria", {}).then(res=>{
      this.$store.commit("loadCriteria", res.data);
    })
  },

  methods: {
    viewCriteria(id){
      // call the modal form with the data of specified program
      const prog = this.$store.state.criteria.find(p => p._id === id);
      console.log(prog);
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


Vue.component("new-program-modal", {
  props: ["progs", "criteria"],
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
                <option v-for="crt in criteria" :value="crt._id" >{{ crt.name }}</option>
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
          <button @click="submitProgram()" 
          type="button" 
          class="btn btn-primary"
          data-dismiss="modal"
          >Save</button>
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

    if (this.$store.state['criteria'].length <= 0){
      this.$parent.loadCriteria()
    }
  },
  methods: {
    submitProgram(){
      const prog = $("#newProgram").serializeObject();
      const progName = this.$store.state.progs.find(p => p._id === prog.program);
      prog.name = progName.name;
      
      axios.post("/admin/program", prog).then(res =>{
        this.$store.commit("loadPrograms", res.data);
        Toast.fire({
          type: "success",
          title: "Successfully created the program",
        });
      })
    }
  }
});

Vue.component("program", {
  props: ["prog", "id", "index"],
  template:
  `
  <tr>
    <td>{{ index + 1 }}</td>
    <td @click="viewProg(id)">
      <b> {{ prog.name }} </b>
    </td>
    <td v-if="!isSuper()">
      <b > {{ prog.maxCandidates }} </b>
    </td>
    <td v-if="!isSuper()">
      <b> {{ prog.allocatedCandidates }} </b>
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
    isSuper(){
      return this.$parent.isSuper();
    },
  }
});


// Views
// Programs
const casPrograms = {
  template: `
  <div class="card">
    <h5 class="card-header alert-light-blue">Programs</h5>
    <div class="card-body">
    <table class="table">
      <thead>
        <tr>
          <th style="width: 10px"><h5>#</h5></th>
          <th><h5>Program name</h5></th> 
          <th style="width: 15%;" v-if="!isSuper()"><h5>Max Allocation</h5></th> 
          <th style="width: 15%;" v-if="!isSuper()"><h5>Allocated</h5></th>  
          <th style="width: 10%;"><h5>Actions</h5></th> 
        </tr>
      </thead>
      <tbody v-if="this.$store.state.progs && this.$store.state.progs.length" 
      class="table-elevate">
        <program v-if="isSuper()" v-for="(prog, index) in this.$store.state.progs"
        v-bind:prog = "prog"
        v-bind:index = "index"
        v-bind:key = "prog._id"
        ></program>
        <program v-if="!isSuper()" v-for="(prog, index) in this.$store.state.progsAdm"
        v-bind:prog = "prog"
        v-bind:index = "index"
        v-bind:key = "prog._id"
        ></program>
      </tbody>
    </table>
    </div>
  </div>
  `,

  created(){
    if (this.$store.state['progs'].length <= 0 && this.isSuper()){
      this.$parent.loadPrograms()
    } else if(this.$store.state['progsAdm'].length <= 0 && !this.isSuper()){
      return this.$parent.loadAdminPrograms()
    }
  },

  methods: {
    viewProg(id){
      // call the modal form with the data of specified program
      const prog = this.$store.state.progs.find(p => p._id === id);
      console.log(prog);
    },

    isSuper(){
      return this.$parent.isSuper();
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

Vue.component("new-inst", {
  template:
  `
  <div
    class="modal fade"
    id="newInstModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="newInstModal"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="newInstModalTitle">
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
          <form id="newInst">

            <div class="form-group">
              <label>Institution Name</label>
              <input name="name" class="form-control" 
              placeholder="Institution Name" type="text" required>
            </div>

            <div class="form-group">
              <label>Registration Number</label>
              <input name="regNo" class="form-control" type="text" 
              placeholder="Registration Number" required>
            </div>



            <div class="form-group">
              <label>Website</label>
              <input name="website" class="form-control" type="text"
              placeholder="www.example.ac.tz" required>
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea name="desc" class="form-control" rows="3" placeholder=""></textarea>
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
          <button @click="submitInst()" 
          type="button" 
          class="btn btn-primary"
          data-dismiss="modal"
          >Save</button>
        </div>
      </div>
    </div>
  </div>
  `,

  methods: {
    submitInst(){
      const inst = $("#newInst").serializeObject();
      axios.post("/admin/institution", inst).then(res =>{
        Toast.fire({
          type: "success",
          title: `Successfully created ${res.data.name}`,
        });
      })
    }
  }
});

Vue.component("inst", {
  props: ["inst", "id", "index"],
  template:
  `
  <tr>
    <td>{{ index + 1 }}</td>
    <td>
      <span> {{ inst.name }} </span>
    </td>
    <td>
      <span> {{ inst.regNo }} </span>
    </td>
    <td>
      <span> {{ inst.website }} </span>
    </td>
    <td>
      <button class="btn btn-sm btn-warning">
        <i class="fas fa-edit"></i>
      </button>
      <button class="btn btn-sm btn-danger">
        <i class="fas fa-trash-alt"></i>
      </button>
    </td>
  </tr>
  `,
});

const casInstitutions = {
  template: 
  `
  <div class="card">
    <h5 class="card-header alert-light-blue">Institutions</h5>
    <div class="card-body">
    <table class="table">
      <thead>
        <tr>
          <th style="width: 10px"><h5>#</h5></th>
          <th><h5>Name</h5></th> 
          <th><h5>Reg No</h5></th> 
          <th><h5>Website</h5></th>  
          <th style="width: 10%;"><h5>Actions</h5></th> 
        </tr>
      </thead>
      <tbody v-if="this.$store.state.institutions && this.$store.state.institutions.length" 
      class="table-elevate">
        <inst v-for="(inst, index) in this.$store.state.institutions"
        v-bind:inst = "inst"
        v-bind:index = "index"
        v-bind:key = "inst._id"
        ></inst>
      </tbody>
    </table>
    </div>
  </div>
  `,

  created(){
    if (this.$store.state['institutions'].length <= 0 ){
      this.$parent.loadInstitutions()
    } 
  },

}

Vue.component("new-user-modal", {

  props: ["institutions"],
  template: 
  `
  <div
    class="modal fade"
    id="newUserModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="newUserModal"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="newUserModalTitle">
            Create new User
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
          <form id="newUser">
            <div v-if="isSuper()" class="form-group">
              <label>Institution</label>
              <select name="institution" class="form-control select2bs4" style="width: 100%;">
                <option value="super" >Super Administrator</option>
                <option v-for="inst in institutions" :value="inst._id" >{{ inst.name }}</option>
              </select>
            </div>

            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label>First Name</label>
                  <input name="firstName" class="form-control" type="text">
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label>Middle Name</label>
                  <input name="middleName" class="form-control" type="text">
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label>Last Name</label>
                  <input name="lastName" class="form-control" type="text">
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Email</label>
                  <input name="email" class="form-control" type="text">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Phone Number</label>
                  <input name="phoneNumber" class="form-control" type="text">
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
              <div class="form-group">
                <label>Gender</label>
                <select name="gender" class="form-control select2bs4" style="width: 100%;">
                  <option value="M" >Male</option>
                  <option value="F" >Female</option>
                </select>
              </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Password</label>
                  <input name="password" class="form-control" type="password">
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
          <button @click="submitUser()" 
          type="button" 
          class="btn btn-primary"
          data-dismiss="modal"
          >Save</button>
        </div>
      </div>
    </div>
  </div>
  `,

  created(){
    if (this.$store.state['institutions'].length <= 0){
      this.$parent.loadInstitutions()
    }
  },

  methods: {
    isSuper(){
      return this.$parent.isSuper();
    },

    submitUser(){
      const user = $("#newUser").serializeObject();
      axios.post("/admin/user", user).then(res=>{
        if (res.data) {
          Toast.fire({
            type: "success",
            title: `Successfully created ${res.data.firstName}`,
          });
        }
      })
    }
  }
})


Vue.component("user", {
  props: ["user", "index"],
  template: 
  `
  <tr>
    <td>{{ index + 1 }}</td>
    <td>
      <span> {{ user.firstName }} {{ user.lastName}} </span>
    </td>
    <td>
      <span> <a :href="'mailto: ' + user.email"> {{ user.email }} </a> </span>
    </td>
    <td>
      <span> {{ user.phoneNumber }} </span>
    </td>
    <td>
      <button class="btn btn-sm btn-warning">
        <i class="fas fa-edit"></i>
      </button>
      <button class="btn btn-sm btn-danger">
        <i class="fas fa-trash-alt"></i>
      </button>
    </td>
  </tr>
  `
});

const casUsers = {
  template: 
  `
  <div class="card">
    <h5 class="card-header alert-light-blue">
      Administrators
    </h5>
    <div class="card-body">
    <table class="table">
      <thead>
        <tr>
          <th style="width: 10px"><h5>#</h5></th>
          <th><h5>Name</h5></th> 
          <th><h5>Email</h5></th> 
          <th><h5>Phone</h5></th>  
          <th style="width: 10%;"><h5>Actions</h5></th> 
        </tr>
      </thead>
      <tbody v-if="this.$store.state.users && this.$store.state.users.length" 
      class="table-elevate">
        <user v-for="(user, index) in this.$store.state.users"
        v-bind:user = "user"
        v-bind:index = "index"
        v-bind:key = "user._id"
        ></user>
      </tbody>
    </table>
    </div>
  </div>
  `,

  created(){
    if(this.$store.state["users"].length <= 0){
      this.$parent.loadUsers();
    }
  },
}

Vue.component("application", {
  props: ["app", "index"],
  template: 
  `
    <tr data-toggle="collapse" :data-target="'#id'+app._id"
    aria-expanded="false" :aria-controls="'id'+app._id">
      <td>{{ index + 1 }}</td>
      <td>
        {{ app.indexNo }}
      </td>
      <td>
        {{ app.year }}
      </td>
      <td> 
        {{ getAllocatedInstName(app, app.allocatedInst) }}
      </td>
    </tr>
  `,


  methods: {
    getAllocatedInstName(app, instID){
      let inst;
      for (let i in app.entry){
        inst = app.entry[i].institutions.find(pr => pr._id === instID);
        if (inst) break;
      }
      if(!inst) return "Not allocated";
      return inst.instName;
    }
  }
});

Vue.component("app-details", {
  props: ["app"],
  template: 
  `
  <tr class="collapse" :id="'id'+app._id">
    <td colspan="4">
      <div class="card-body">
        <div v-for="entry in app.entry">
          <h5 class="card-header alert-light-blue rounded-0">
            {{ entry.progName }}
          </h5>

          <ul class="list-group list-group-flush">
            <li v-for="(inst, index) in entry.institutions" class="list-group-item">
              {{ index + 1 }}: {{ inst.instName }}
              <i 
              v-if="inst._id === app.allocatedInst && entry.program === app.allocatedProg" 
              class="fas fa-check-circle float-right color-light-green"
              data-toggle="tooltip" title="Allocated to this institution"
              ></i>
            </li>
          </ul>
        </div>
      </div>
    </td>
  </tr>
  `,

  created(){
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }
})

// Applications
const casApplications = {
  template: `
  <div class="card">
    <h5 class="card-header alert-light-blue">Applications</h5>
    <div class="card-body">
    <table class="table">
      <thead>
        <tr>
          <th style="width: 10px">#</th>
          <th style="width: 20%">Reg No</th> 
          <th style="width: 15%">Year</th> 
          <th>Allocation</th>  
        </tr>
      </thead>
      <tbody v-if="this.$store.state.applications && this.$store.state.applications.length" 
      class="table-elevate">
        <template v-for="(app, index) in this.$store.state.applications">
          <application
          v-bind:app = "app"
          v-bind:index = "index"
          v-bind:key = "app._id"
          ></application>

          <app-details
          v-bind:app = "app"
          v-bind:key = "'id'+app._id">
          </app-details>
        </template>
      </tbody>
    </table>
    </div>
  </div>
  `,

  created(){
    this.$parent.loadApplications();
  },
};

const casSchoolResults = {
  template: 
  `
  <div class="w-50 ml-auto mr-auto mt-5 pt-5">

    <div class="card">
      <h5 class="card-header alert-light-blue">
        Upload School Results
      </h5>
      <div class="card-body">
        <div class="form-group">
          <div class="custom-file">
            <input type="file" class="custom-file-input" id="uploadResults" accept=".xlsx, .xls">
            <label class="custom-file-label" for="uploadResults">Choose file</label>
          </div>
        </div>

        <div class="row">
          <button class="btn btn-info  ml-auto mr-auto"> 
            <i class="fas fa-file-upload"> </i> Upload 
          </button>
        </div>

      </div>
    </div>

  </div>
  `,

  methods: {
    uploadResult(){

    },
  },
}

Vue.component("attributes-modal", {
  props: ["attr"],
  template: 
  `
  <div v-if="isSuper() && attr !== undefined" 
    class="modal fade"
    id="attributesModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="attributesModal"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="attributesModalTitle">
            Application's Attributes
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
          <form id="attributes">
            
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Min Applied Institutions</label>
                  <input id="minAppInst" 
                  :value = "attr.minAppliedInstitutions"
                  name="minAppliedInstitutions" 
                  class="form-control" type="number">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Max Applied Institutions</label>
                  <input id="maxAppInst" 
                  :value = "attr.maxAppliedInstitutions"
                  name="maxAppliedInstitutions" 
                  class="form-control" type="number">
                </div>
              </div>

              <div class="col-md-12">
                <div class="form-group">
                  <label>Max Applied Programs</label>
                  <input id="maxProg" 
                  :value = "attr.maxAppliedPrograms"
                  name="maxAppliedPrograms" 
                  class="form-control" type="number">
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
          <button @click="submitAttributes()" 
          type="button" 
          class="btn btn-primary"
          data-dismiss="modal"
          >Save</button>
        </div>
      </div>
    </div>
  </div>
  `,

  created(){
    if(this.$store.state.attributes === undefined){
      this.$parent.loadAttr();
    }
  },

  methods: {
    isSuper(){
      return this.$parent.isSuper();
    },

    submitAttributes(){
      const attr = $("#attributes").serializeObject();
      axios.put("/admin/attributes", attr).then(res => {
        if(res.data.nModified > 0){
          Toast.fire({
            type: "success",
            title: `Attributes was successfully updated`,
          });
        }
      }).catch(err => {
        alert("There was an error please try again");
      })
    }
  }
})

Vue.component("attr-view", {
  props: ["attr"],
  template: 
  `
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Attributes</h3>
    </div>
    <div class="card-body">
      <table class="table table-bordered">
        <thead>                  
          <tr>
            <th style="width: 10px">#</th>
            <th>Attribute Name</th>
            <th>Attribute Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Max Applied Programs</td>
            <td> {{ attr.maxAppliedPrograms }} </td>
            </tr>
            <tr>
            <td>2</td>
            <td>Min Institutions Per Program</td>
            <td> {{ attr.minAppliedInstitutions }} </td>
            </tr>
            <tr>
            <td>3</td>
            <td>Max Institutions Per Program</td>
            <td> {{ attr.maxAppliedInstitutions }} </td>
            </tr>
          </tr>
        
        </tbody>
      </table>
    </div>
  </div>
  `,
})

const casAttributes = {
  template:
  `
    <attr-view :attr = "this.$store.state.attributes"
    v-if="this.$store.state.attributes !== undefined"
    ></attr-view>
  `,

  created(){
    if(this.$store.state.attributes === undefined){
      this.$parent.loadAttr();
    }
  }
};

Vue.component("notification", {
  props: ["not"],
  template: 
  `
  <a @click="viewNot(not._id)" class="dropdown-item hover-pointer">
  <i v-if="not.type==='important'" class="fas fa-gem" mr-2></i>
  <b v-if="not.status==='unseen'"> {{ not.title }} </b>
  <b v-else class="bg-light"> {{ not.title }} </b></a>
  `,

  methods: {
    viewNot(id){
      router.push({ path: `/nots/${id}` });
    }
  }
});

Vue.component("nots", {
  template:
  `
  <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
  <span class="dropdown-item dropdown-header">
  {{ this.$store.state.notifications.length }} Notifications</span> 
  <div class="dropdown-divider"></div>
  <div v-for="not in this.$store.state.notifications">
    <notification
    :not="not"
    :key="not._id"
    ></notification>
    <div class="dropdown-divider"></div>
  </div>
  <a href="#" class="dropdown-item dropdown-footer">See All Notifications</a></div>
  `,

  created(){
    this.$parent.loadNotifications();
  },

  methods: {
    
  }
});

const Notification = {
  template:
  `
  <div class="card w-75 mr-auto ml-auto">
    <h5 class="alert alert-light-blue">
    {{ getNot().title }}
    </h5>
    <div v-html="getNot().body" class="card-body">
    </div>
  </div>
  `,

  methods: {
    getNot(){
      const id = this.$route.params.notId;
      const not = this.$store.state.notifications.find(p => p._id === id);
      return not;
    }
  }
}
