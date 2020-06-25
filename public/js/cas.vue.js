Vue.component("program", {

  props: ["name", "id", "index", "selected", "qualified"],

  template:
`
  <tr @click="goToInst(id, name)" >
    <td>{{ index + 1 }}</td>
    <td>
    <b> {{ name }}
    </b> <i v-if="selected" class = "fas fa-check color-light-green" ></i>
    
    <i v-if="!qualified" class="float-right far fa-times-circle color-red"
    data-toggle="tooltip" data-placement="top" title="Not qualified"></i>
    <i v-else class="float-right far fa-check-circle color-light-green"
    data-toggle="tooltip" data-placement="top" title="Qualified"></i>
    <br>
    <small class="text-muted">[Physics, Chemistry, Biology]</small>
    </td>
    
  </tr>
  `,

  methods: {
    goToInst: (progID, progName)=>{
      router.push({ path: `/institutions/${progID}/${progName}` });
    }
  },
  
});

const programs = {
  template: 
  `
  <div class="card">
    <h3 class="card-header">Programs</h3>
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
        v-bind:qualified = "prog.qualified"
        v-bind:selected = "prog.selected"
        
        ></program>
      </tbody>
    </table>
    </div>
  </div>
  `,

  data() {
    return {
      progs: [],
    }
  },

  methods: {
    loadPrograms(){
      axios.get("/api/program")
      .then((res)=>{
        // hard coding 
        res.data.forEach(function (pro){
          pro.selected = false;
          pro.qualified = true;
        });

        this.progs = res.data;
      
      }).catch(function(err){
        console.log(err)
      })
    }
  },

  created(){
    this.loadPrograms()
  }
};


Vue.component("inst", {
  props: ["name", "id", "selected", "website", "qualified"],

  template: 
  `
  <tr>
    <td style="width:10px;" class="pt-4">
      <div class="custom-control custom-checkbox">
        <div v-if="qualified">
          <input v-if="selected" class="custom-control-input" type="checkbox" :id="id" checked>
          <input v-else class="custom-control-input" type="checkbox" :id="id">
          <label :for="id" class="custom-control-label"></label>
        </div>
        <div @click="alertNotQualified" v-else >
          <input class="custom-control-input" type="checkbox" :id="id" disabled>
          <label :for="id" class="custom-control-label"></label>
        </div>
      </div>
    </td>
    <td><b>{{name}}</b>
    <i v-if="qualified" class="float-right far fa-check-circle color-light-green"
    data-toggle="tooltip" data-placement="top" title="Qualified"></i>
    <i v-else class="float-right far fa-times-circle color-light-red"
    data-toggle="tooltip" data-placement="top" title="Not qualified"></i>
    <br>
    <small class="text-muted">[ Physics: B, Chemistry: B, Biology: A ]</small>
    </td>
    
  </tr>
  `,

  methods: {
    alertNotQualified: function(){
      console.log("clicked")
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: true,
        timer: 7000,
      });

      Toast.fire({
        type: "error",
        title: "  You are not qualified to apply this program. not qualified to.",
      });
    }
  }
})


// Single institutions.
const institution = {

  template: 
  `<div class="institution">
    <!-- {{ $route.params.id }} -->
    <!-- <h3>University of Dar-es-salaam</h3> -->
    <div class="card">
      <h5 class="card-header alert-light-blue">
      Select some Universities below of your choice for <b>{{$route.params.progName}}</b>.
      </h5>
      <div class="card-body">
      <table class="table">
      <!-- <thead>
        <tr>
          <th style="width: 10px"><h6><i class="fas fa-check"></i></h6></th>
          <th><h5>Name</h5></th>
          
        </tr>
      </thead> -->
      <tbody v-if="institutions && institutions.length" class="table-elevate">
        <inst v-for="inst in institutions"
          v-bind:id = inst._id
          v-bind:key = inst._id
          v-bind:name = inst.name
          v-bind:website = inst.website
          v-bind:selected = inst.selected
          v-bind:qualified = inst.qualified></inst>
      </tbody>
    </table>
      </div>
    </div>
  </div>`,











/* template: `


<div class="card">
<div class="card-header">
  <h3 class="card-title">DataTable with default features</h3>
</div>
<!-- /.card-header -->
<div class="card-body">
  <div id="example1_wrapper" class="dataTables_wrapper dt-bootstrap4">
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <div class="dataTables_length" id="example1_length">
          <label
            >Show
            <select
              name="example1_length"
              aria-controls="example1"
              class="custom-select custom-select-sm form-control form-control-sm"
              ><option value="10">10</option
              ><option value="25">25</option
              ><option value="50">50</option
              ><option value="100">100</option></select
            >
            entries</label
          >
        </div>
      </div>
      <div class="col-sm-12 col-md-6">
        <div id="example1_filter" class="dataTables_filter">
          <label
            >Search:<input
              type="search"
              class="form-control form-control-sm"
              placeholder=""
              aria-controls="example1"
          /></label>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <table
          id="example1"
          class="table table-bordered dataTable"
          role="grid"
          aria-describedby="example1_info"
        >
          <thead>
            <tr role="row">
              <th
                class="sorting"
                tabindex="0"
                aria-controls="example1"
                rowspan="1"
                colspan="1"
                aria-label="Selection"
              > Select
              </th>

              <th
                class="sorting"
                tabindex="0"
                aria-controls="example1"
                rowspan="1"
                colspan="1"
                aria-label="Program Name"
              > University Name
              </th>
            </tr>
          </thead>
          <tbody v-if="institutions && institutions.length" class="table-elevate">
            <inst v-for="inst in institutions"
              v-bind:id = inst._id
              v-bind:key = inst._id
              v-bind:name = inst.name
              v-bind:website = inst.website
              v-bind:selected = inst.selected></inst>
          </tbody>

        </table>
      </div>
    </div>
  </div>
</div>
<!-- /.card-body -->
</div>


`,
 */








  data() {
    return {
      institutions: [],
    }
  },

  methods: {
    loadInstitutions: function(){
      
      axios.get("/api/institution", {
        params: {
          options: JSON.stringify({
            "programs.program": this.$route.params.progId,
          })
        }
      })
      .then((res)=>{
        
        this.institutions = res.data;
      
      }).catch(function(err){
        console.log(err)
      })
    },
  },

  created(){
    this.loadInstitutions()
  }

};



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




const routes = [
  { path: "/application", component: Apply },
  { path: "/programs", component: programs },
  { path: "/institutions/:progId/:progName", component: institution },
];

const router = new VueRouter({
  routes,
});

const vm = new Vue({
  el: "#app",
  router,
  data: {

  },

  methods: {
    
  },
});
