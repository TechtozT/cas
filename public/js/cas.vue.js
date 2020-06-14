Vue.component("inst", {

  props: ["name", "prog", "site", "apps", "desc", "id"],

  template:
  `
    <div class="col-12">
      <router-link class="a-default" to="/institutions/institution/ {{ id }}">
        <div class="card h-pointer elevate">
          <h5 class="card-header">{{ name }}</h5>
          <div class="card-body">
            <button class="btn btn-info badge-pill mr-3">
              {{ prog }} Programs
            </button>
            <!-- <button class="btn btn-danger badge-pill">
              {{ apps }} Application -->
            </button>
            <a class="float-right" href="#site"><b>{{ site }}</b></a>
            <div class="pt-3">
              {{ desc }}
            </div>
          </div>
        </div>
      </router-link>
    </div>
  
  `,
});

const Apply = {

  data: ()=>{
    return{
      institutions: [{
        id: "654578867894",
        name: "University of Dar-es-salaam",
        programs: [
          {
            id: "prog-id1",
            name: "Bachelor of science in computer science",
            choice: 1
          },

          {
            id: "prog-id1",
            name: "Bachelor of science Electronics",
            choice: 2
          }
        ]
      },
      {
        id: "77867738948",
        name: "Sokoine University of Agriculture",
        programs: [
          {
            id: "prog-id1",
            name: "Bachelor of science in computer science",
            choice: 1
          },

          {
            id: "prog-id1",
            name: "Bachelor of science in computer science",
            choice: 2
          }
        ]
      },
    ]
    }
  },

  template: 
  `

  <div>
    <div v-if="institutions.length===0 || !institutions">
      <div class="col-12 alert alert-light-red">You don't have any application, click 
      <b>"Start new application"</b> to apply now</div>
      
      <div class="row mb-5">
        <button class="btn btn-info mx-auto"> Start new application</button>
      </div>
    </div>
    
      
    <div v-if="institutions.length > 0" class="card">  
      <h4 class="card-header bg-light">
        <b>Your application</b>
      </h4>
      <div class="card-body pb-0">
        <p>You can change the application at any time before you finally submit it. To change 
        the priority rearrange the programs by dragging one over another.</p>
      </div>
      <ul class="list-group list-group-flush">
        <draggable v-model="institutions" group="institutions" @start="drag=true" @end="drag=false">
          <li v-for="element in institutions" :key="element.id" 
          class="list-group-item h-pointer py-3" data-toggle="modal" data-target="#progs-modal">
          <span class="mr-2"><i class="fas fa-arrows-alt"></i></span> <b>{{element.name}}</b>
          </li>
        </draggable>
      </ul>
      <div class="card-footer">
        <div class="col-12">
          <div class="row">
            <button class="btn btn-info mx-auto">Submit Your Application</button>
            </div>
        </div>
      </div>  
    </div>





    <div
    class="modal fade"
    id="progs-modal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="progs-modal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header bg-light">
          <h5 class="modal-title">University of Dar-es-salaam</h5>
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
          <p>You selected these programs from University of Dar-es-salaam</p>
          <ul class="list-group list-group-flush">
            <draggable v-model="institutions.filter(inst=> inst.id==='654578867894')[0].programs" group="programs" @start="drag=true" @end="drag=false">
              <li v-for="element in institutions.filter(inst=> inst.id==='654578867894')[0].programs" :key="element.id" 
              class="list-group-item h-pointer py-3">
              <span class="mr-2"><i class="fas fa-arrows-alt"></i></span> <b>{{element.name}}</b>
              </li>
            </draggable>
          </ul>

          
        </div>
        <div class="modal-footer bg-light">
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary">
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>



    
  </div>`,
};

const institutions = {

  template: 
  `<div class="row">
    <inst v-for="inst in this.$parent.$data.institutions"
    v-bind:id = "inst.id"
    v-bind:name = "inst.name"
    v-bind:prog = "inst.programs"
    v-bind:apps = "inst.application"
    v-bind:site = "inst.website"
    v-bind:desc = "inst.desc"></inst>
  </div>`,
};


// Single institutions.
const institution = {

  template: 
  `<div class="institution">
    <!-- {{ $route.params.id }} -->
    <!-- <h3>University of Dar-es-salaam</h3> -->
    <div class="card">
      <h3 class="card-header">University of Dar-es-salaam</h3>
      <div class="card-body">
      <table class="table">
      <thead>
        <tr>
          <th style="width: 10px"><h5>#</h5></th>
          <th><h5>Program name</h5></th>
          
        </tr>
      </thead>
      <tbody class="table-elevate">
        <tr data-toggle="modal" data-target="#app-modal">
          <td>1.</td>
          <td>
          <b> Bachelor of science in computer science 
          </b> <i class = "fas fa-check color-light-green" ></i>
          <i class="float-right far fa-times-circle color-red"
          data-toggle="tooltip" data-placement="top" title="Not qualified"></i>
          <br>
          <small class="text-muted">[Physics: B, Chemistry: B]</small>
          </td>
          
        </tr>
        <tr>
          <td>2.</td>
          <td><b>Bachelor environmental science</b>
          <i class="float-right far fa-check-circle color-light-green"
          data-toggle="tooltip" data-placement="top" title="Qualified"></i>
          <br>
          <small class="text-muted"> [Biology: B, Chemistry: B, Physics: C] </small>
          </td>
          
        </tr>
        <tr>
          <td>3.</td>
          <td><b>Bachelor of electronics engineering</b>
          <i class="float-right far fa-check-circle color-light-green"
          data-toggle="tooltip" data-placement="top" title="Qualified"></i>
          <br>
          <small class="text-muted"> [Biology: B, Chemistry: B, Physics: C] </small>
          </td>
          
        </tr>
        <tr>
          <td>4.</td>
          <td><b>Bachelor of law</b>
          <i class="float-right far fa-check-circle color-light-green"
          data-toggle="tooltip" data-placement="top" title="Qualified"></i>
          <br>
          <small class="text-muted"> [Biology: B, Chemistry: B, Physics: C] </small>
          </td>
          
        </tr>
      </tbody>
    </table>
      </div>
    </div>
  </div>`,
};

const routes = [
  { path: "/application", component: Apply },
  { path: "/institutions", component: institutions },
  { path: "/institutions/institution/:id", component: institution },
];

const router = new VueRouter({
  routes,
});

const vm = new Vue({
  el: "#app",
  router,
  data: {
    institutions: [{
      id: "654578867894",
      name: "University of Dar-es-salaam",
      website: "www.udsm.ac.tz",
      desc: `This university description is about some 
      length texts to help fa-users to get some incite. 
      This university description is about some length 
      texts to help fa-users to get some incite. 
      This university description is about some 
      length texts to help fa-users to get some incite.`,
      programs: 9,
      application: 100,
    },
    {
      id: "77867738948",
      name: "Sokoine University of Agriculture",
      website: "www.sua.ac.tz",
      desc: `This university description is about some 
      length texts to help fa-users to get some incite. 
      This university description is about some length 
      texts to help fa-users to get some incite. 
      This university description is about some 
      length texts to help fa-users to get some incite.`,
      programs: 120,
      application: 6908,
    },
  ]
  }
});
