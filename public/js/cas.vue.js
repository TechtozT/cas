// vue logics goes in here
Vue.component('btn-counter', {
  data: function(){
    return {
      count: 0
    }
  },

  template: btn_counter
});

const Apply = {
  data: function(){
    return {
      applicatio_status: {
        completed: false
      }
    }
  },

  template: `<div class="row">
  <div class="col-lg-3 col-6">
    <!-- small box -->
    <div class="small-box bg-info">
      <div class="inner">
        <h3>150</h3>

        <p>New Orders</p>
      </div>
      <div class="icon">
        <i class="ion ion-bag"></i>
      </div>
      <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
    </div>
  </div>
  <!-- ./col -->
  <div class="col-lg-3 col-6">
    <!-- small box -->
    <div class="small-box bg-success">
      <div class="inner">
        <h3>53<sup style="font-size: 20px">%</sup></h3>

        <p>Bounce Rate</p>
      </div>
      <div class="icon">
        <i class="ion ion-stats-bars"></i>
      </div>
      <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
    </div>
  </div>
  <!-- ./col -->
  <div class="col-lg-3 col-6">
    <!-- small box -->
    <div class="small-box bg-warning">
      <div class="inner">
        <h3>44</h3>

        <p>User Registrations</p>
      </div>
      <div class="icon">
        <i class="ion ion-person-add"></i>
      </div>
      <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
    </div>
  </div>
  <!-- ./col -->
  <div class="col-lg-3 col-6">
    <!-- small box -->
    <div class="small-box bg-danger">
      <div class="inner">
        <h3>65</h3>

        <p>Unique Visitors</p>
      </div>
      <div class="icon">
        <i class="ion ion-pie-graph"></i>
      </div>
      <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
    </div>
  </div>

  <!-- ./col -->
</div>`
}

const Payments = {
  data: function(){
    return {
      payment_status: {
        paid: true
      }
    }
  },

  template: `<div v-if="payment_status.paid" class="card card-default color-palette-box">
  <div class="card-header">
    <h3 class="card-title">
      <i class="fas fa-tag"></i>
      Color Palette
    </h3>
  </div>
  <div class="card-body">
    <div class="col-12">
      <h5>Theme Colors</h5>
    </div>
    <!-- /.col-12 -->
    <div class="row">
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center">Primary</h4>

        <div class="color-palette-set">
          <div class="bg-primary color-palette"><span>#007bff</span></div>
          <div class="bg-primary disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center">Secondary</h4>

        <div class="color-palette-set">
          <div class="bg-secondary color-palette"><span>#6c757d</span></div>
          <div class="bg-secondary disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center">Info</h4>

        <div class="color-palette-set">
          <div class="bg-info color-palette"><span>#17a2b8</span></div>
          <div class="bg-info disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center">Success</h4>

        <div class="color-palette-set">
          <div class="bg-success color-palette"><span>#28a745</span></div>
          <div class="bg-success disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center bg-warning">Warning</h4>

        <div class="color-palette-set">
          <div class="bg-warning color-palette"><span>#ffc107</span></div>
          <div class="bg-warning disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center">Danger</h4>

        <div class="color-palette-set">
          <div class="bg-danger color-palette"><span>#dc3545</span></div>
          <div class="bg-danger disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
    </div>
    <!-- /.row -->
    <div class="col-12">
      <h5 class="mt-3">Black/White Nuances</h5>
    </div>
    <!-- /.col-12 -->
    <div class="row">
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center">Black</h4>

        <div class="color-palette-set">
          <div class="bg-black color-palette"><span>#000000</span></div>
          <div class="bg-black disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center">Gray Dark</h4>

        <div class="color-palette-set">
          <div class="bg-gray-dark color-palette"><span>#343a40</span></div>
          <div class="bg-gray-dark disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center">Gray</h4>

        <div class="color-palette-set">
          <div class="bg-gray color-palette"><span>#adb5bd</span></div>
          <div class="bg-gray disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center bg-light">Light</h4>

        <div class="color-palette-set">
          <div class="bg-light color-palette"><span>#1f2d3d</span></div>
          <div class="bg-light disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
    </div>
    <!-- /.row -->
    <div class="col-12">
      <h5 class="mt-3">Colors</h5>
    </div>
    <!-- /.col-12 -->
    <div class="row">
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center bg-indigo">Indigo</h4>

        <div class="color-palette-set">
          <div class="bg-indigo color-palette"><span>#6610f2</span></div>
          <div class="bg-indigo disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center bg-lightblue">Lightblue</h4>

        <div class="color-palette-set">
          <div class="bg-lightblue color-palette"><span>#3c8dbc</span></div>
          <div class="bg-lightblue disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center bg-navy">Navy</h4>

        <div class="color-palette-set">
          <div class="bg-navy color-palette"><span>#001f3f</span></div>
          <div class="bg-navy disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center bg-purple">Purple</h4>

        <div class="color-palette-set">
          <div class="bg-purple color-palette"><span>#605ca8</span></div>
          <div class="bg-purple disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center bg-fuchsia">Fuchsia</h4>

        <div class="color-palette-set">
          <div class="bg-fuchsia color-palette"><span>#f012be</span></div>
          <div class="bg-fuchsia disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center bg-pink">Pink</h4>

        <div class="color-palette-set">
          <div class="bg-pink color-palette"><span>#e83e8c</span></div>
          <div class="bg-pink disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center bg-maroon">Maroon</h4>

        <div class="color-palette-set">
          <div class="bg-maroon color-palette"><span>#d81b60</span></div>
          <div class="bg-maroon disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center bg-orange">Orange</h4>

        <div class="color-palette-set">
          <div class="bg-orange color-palette"><span>#ff851b</span></div>
          <div class="bg-orange disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center bg-lime">Lime</h4>

        <div class="color-palette-set">
          <div class="bg-lime color-palette"><span>#01ff70</span></div>
          <div class="bg-lime disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center bg-teal">Teal</h4>

        <div class="color-palette-set">
          <div class="bg-teal color-palette"><span>#39cccc</span></div>
          <div class="bg-teal disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
      <div class="col-sm-4 col-md-2">
        <h4 class="text-center bg-olive">Olive</h4>

        <div class="color-palette-set">
          <div class="bg-olive color-palette"><span>#3d9970</span></div>
          <div class="bg-olive disabled color-palette"><span>Disabled</span></div>
        </div>
      </div>
      <!-- /.col -->
    </div>
    <!-- /.row -->
  </div>
  <!-- /.card-body -->
</div>`
}

const routes = [
  {path: '/apply', component: Apply},
  {path: '/payments', component: Payments}
];

const router = new VueRouter({
  routes
});


new Vue({
  el: '#app',
  router
});