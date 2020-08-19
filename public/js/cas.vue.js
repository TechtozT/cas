
Vue.component("program", {

  props: ["name", "id", "index", "selected"],

  template:
`
  <tr @click="goToInst(id, name)" >
    <td>{{ index + 1 }}</td>
    <td>
    <b> {{ name }}
    </b> <i v-if="selected" class = "fas fa-check color-light-green float-right" 
    data-toggle="tooltip" data-placement="top" title="You selected this program"></i>
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
        this.progs = res.data;
      }).catch(function(err){
        console.log("Error: ", err)
      })
    }
  },

  created(){
    this.loadPrograms()
  }
};


Vue.component("inst", {
  props: ["name", "id", "selected", "qualified"],

  template: 
  `
  <tr>
    <td style="width:10px;">
      <div class="custom-control custom-checkbox">
        <div v-if="qualified">
          <input v-if="selected" class="custom-control-input" type="checkbox" 
          :id="id" :value="id" checked>
          <input v-else class="custom-control-input" type="checkbox" name="institutions[]" :id="id" :value="id">
          <label :for="id" class="custom-control-label"></label>
        </div>
        <div v-else @click="alertNotQualified">
          <input class="custom-control-input" type="checkbox" name="institutions[]" :id="id" disabled>
          <label :for="id" class="custom-control-label"></label>
        </div>
      </div>
    </td>
    <td><b>{{name}}</b>
    <i v-if="qualified" class="float-right far fa-check-circle color-light-green"
    data-toggle="tooltip" data-placement="top" title="Qualified"></i>
    <i v-else class="float-right far fa-times-circle color-light-red"
    data-toggle="tooltip" data-placement="top" title="Not qualified"></i>
    </td>
    
  </tr>
  `,

  methods: {
    alertNotQualified: function(){
      Toast.fire({
        type: "info",
        title: "  You are not qualified to apply this program.",
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
        <form id="inst">
          <table class="table">
            <tbody v-if="institutions && institutions.length" class="table-elevate">          
              <inst v-for="inst in institutions"
                v-bind:id = inst._id
                v-bind:key = inst._id
                v-bind:name = inst.name
                v-bind:selected = inst.selected
                v-bind:qualified = inst.qualified>
              </inst>
            </tbody>
          </table>
        </form>
      </div>
    </div>
    <button @click="addInstitutions()" 
      class="btn btn-info floating_btn floating_btn_add_prog rounded-circle"
      data-toggle="tooltip" data-placement="top" title="Add to your application"
      > <i class="fas fa-plus"></i>
    </button>
  </div>`,


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

    addApplication(app){
      this.$store.commit('addApplication', app);
    },

    addProgSuccess(){
      router.push('/programs');

      Toast.fire({
        type: "success",
        title: "Successful, please select another program.",
      });
    },

    addInstitutions: function(){
      const selectedInst = $("#inst").serializeObject();
      const progID = this.$route.params.progId;
      
      
      if (!selectedInst.institutions || selectedInst.institutions.length === 0 ) {
        Toast.fire({
          type: "warning",
          title: "Please select at least one institution.",
        });

        return;
      }
      
      const ins = [];

      for (let x=0; x<selectedInst.institutions.length; x++){
        let match = this.institutions.find(m => m._id === selectedInst.institutions[x]);
        ins.push({
          inst: match._id, 
          instName: match.name
        })
      }


      // Check if the selected program is already selected.
      // If selected update the program
      const storedInstApp = this.$store.state.application;
      
      const mayBeSelected = storedInstApp.findIndex(m => m.progID === progID);
      if(mayBeSelected > -1) {
        this.$store.commit('updateAppItem', 
          {
            item: {
              progID: progID,
              progName: this.$route.params.progName,
              institutions: ins,
            }, 
            index: mayBeSelected
          }
        )
         
        return this.addProgSuccess();
      }

      this.addApplication({
        progID: progID,
        progName: this.$route.params.progName,
        institutions: ins,
      })
      

      this.addProgSuccess();
    },

  },

  created(){
    this.loadInstitutions()
  }

};


const Application = {

  data: ()=>{
    return{

    }
  },

  computed: {
    application: {
      get(){
        return this.$store.state.application;
      },

      set(value){
        this.$store.commit("updateApplication", value);
      }
    }
  },

  created() {
    // Check if user is already initiated the application
    if(!this.$store.state.initAppStatus){
      this.isInitApplication()
    }
    
  },


  methods: {

    isInitApplication(){

      axios.get("/api/application")
      .then(res=>{
        if(res.data.length > 0 && res.data[0].entry.length > 0) {
          const application = res.data[0].entry;
          const app = [];
          for(let i = 0; i < application.length; i++){
            app.push({
              progID: application[i].program,
              progName: application[i].progName,
              institutions: application[i].institutions,
            });
          }
          this.$store.commit("updateApplication", app);

          // app appInitStatus to true
          this.$store.commit("initAppStatus");
        }
        // console.log(this.$store.state.application)
      }).catch(err =>{
        console.log(err);
      })
    },

    initAppStatus(){
      return this.$store.state.initAppStatus
    },

    // When Start new application
    initApplication(){
      axios.post("/api/application", {})
      .then(res => {
        if(res.data) {
          Toast.fire({
            type: "success",
            title: "Successfully initiated your application, please proceed",
          });

          this.$store.commit("initAppStatus");
          router.push('/programs');
        }
      })
      .catch(err => {
        console.log(err);
      })
    },

    saveApplication(){
      const application = this.$store.state.application;
      axios.put("/api/application", application)
      .then(res => {
        if(res.data.ok === 1){
          Toast.fire({
            type: "success",
            title: "Your application wa saved successfully",
          });
        }
      })
      .catch(err => {
        Toast.fire({
          type: "error",
          title: err.toString(),
        });
      });
    },
  },
 

  template: 
  `
  <div>
    <div v-if="!initAppStatus()">
      <div class="col-12 alert alert-light-red">You don't have any application yet, click 
      <b>"Start new application"</b> to apply now</div>
      <div class="row mb-5">
        <button @click="initApplication()" class="btn btn-info mx-auto">Start new application</button>
      </div>
    </div> 
    
    <div class="row" v-else>
      
      <div class="col-12">
      <button v-if="this.$store.state.application.length > 0" 
      class="btn btn-info mb-2"
      @click="saveApplication()"> <i class="fas fa-save"></i> Save </button>

        <div class="">
        <draggable
        class="dragArea"
        v-model="application"
        :group="{ name: 'programs', pull: 'clone', put: false }">
      
          <div class="mb-3 card cursor-move rounded-0" v-for="(section, i) in application">
            <h5 class="card-header alert-light-blue rounded-0"> {{section.progName}} </h5>
            <draggable
              class="dragArea"
              :list="section.institutions"
              :group="{ name: 'inst', pull: 'clone', put: false }">
        
              <li class="list-group-item rounded-0" v-for="item in section.institutions" 
              :key="item.instID">
                <i class="fas fa-thumbtack mr-2 color-orange"></i>
                {{item.instName}}
              </li>
            </draggable>
        
          </div>
        </draggable>
      </div>
      </div>
      
        
      
    </div>
  </div>
  
  `
  ,
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

const Home = {
  template:
  `
  <div>

    <h5 class="p-3 alert alert-light-green border-radius-0">
      Application window is open, to apply follow the instruction below.
    </h5>

    <div class="p-3">
      1. Click My Application on the left panel. <br>
      2. Click Start New Application an follow the instructions.
      or click
    </div>

    <div class="row mb-5">
      <button @click="initApplication()" class="btn btn-info mx-auto">Start new application</button>
    </div>
  </div>
  `
}


Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    application: [],
    initAppStatus: false,
    notifications: [],
  },


  mutations: {
    addApplication (state, app) {
      state.application.push(app);
    },

    updateApplication(state, updatedApplication){
      state.application = updatedApplication;
    },

    updateAppItem(state, payload){
      state.application[payload.index] = payload.item;
    },

    initAppStatus(state){
      state.initAppStatus = true;
    },

    loadNotifications(state, nots){
      state.notifications = nots;
    }
  }
})


const routes = [
  { path: "/home", component: Home },
  { path: "/application", component: Application },
  { path: "/programs", component: programs },
  { path: "/institutions/:progId/:progName", component: institution },
  { path: "/nots/:notId", component: Notification }
];

const router = new VueRouter({
  routes,
});

const vm = new Vue({
  el: "#app",
  router,
  store,
  data: {
    apps: [],
  },

  methods: {
    loadNotifications(){
      axios.get("/nots/user/all")
      .then(res => {
        if(res.data){
          store.commit("loadNotifications", res.data);
        }
      })
      .catch(err => {
        alert("There was an error please try again")
      })
    }
  },
});
