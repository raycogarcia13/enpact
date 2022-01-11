<template>
    <v-container>
      <v-row>
        <v-col> 
          <v-select
            v-model="service"
            :items="selServices"
            @change="serviceChange"
            :menu-props="{ maxHeight: '400' }"
            label="Servicios"
            hint="Selecciona el servicio"
          ></v-select>
        </v-col>
        <v-col class="text-center">
          <h3 class="mt-5">Control de tiempos</h3>
           <v-menu
              ref="menu2"
              :close-on-content-click="true"
              transition="scale-transition"
              offset-y
              left
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  label="Mes"
                  v-model="fecha"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
              @change="dateChange"
              v-model="fecha"
              type="month"
            ></v-date-picker>
            </v-menu>
        </v-col>
        <v-col>
          <v-select
            v-model="department"
            @change="departmentChange"
            :items="selDepartment"
            :menu-props="{ maxHeight: '400' }"
            label="Departamento"
            hint="Selecciona el departamento"
          ></v-select>
        </v-col>
      </v-row>
       <v-expand-transition>
        <v-row
          v-if="cargando"
          style="height:50vh"
          align="center"
          justify="center"
        >
          <v-progress-circular
            indeterminate
            color="green"
            :size="100"
          ></v-progress-circular>
        </v-row>
      </v-expand-transition>
      <v-row v-if="!cargando">
        <v-col>
             <v-card>
              <v-card-title>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Filtrar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-card-text>
                <v-data-table :headers="headers" :items="data" :search="search" >
                  <template v-slot:item.projector="{ item }">
                    {{ item.projector.name }}
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn :to="`/viewct/${item.projector._id}`" icon x-small>
                      <v-icon color="info">mdi-eye</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>
<script>

export default {
  name: 'Times',

  components: {
  },
  data() {
    return {
      cargando:false,
      search:'',
      services:[],
      departments:[],
      service:null,
      fecha:null,
      department:null,
      data:[],
       headers: [
        {
          text: 'Nombre',
          align: 'start',
          value: 'projector'
        },
        { text: 'Tiempo Productivo', value: 'productives' },
        { text: 'Tiempo No Productivo', value: 'noProductives' },
        { text: 'Acciones', value: 'actions' }
      ],
    }
  },
  computed: {
    selServices(){
      return this.services.map(item => {
        return { value: item, text: `${item.code} - ${item.name}` }
      })
    },
    selDepartment(){
      return this.departments.map(item => {
        return { value: item, text: item.name }
      })
    }
  },
  methods: {
    loadServices(){
      let uri = '/services'
      this.cargando = true
      this.$axios.get(uri).then(res => {
        this.services = res.data.data
        this.cargando = false;
      }).catch(()=>{
        this.cargando = false;
      })
    },
    loadDepartment(){
      let uri = '/department'
      this.cargando = true
      this.$axios.get(uri).then(res => {
        this.departments = res.data.data
        this.cargando = false;
      }).catch(()=>{
        this.cargando = false;
      })
    },
    loadData(){
      this.cargando = true;
      const request = {
        filter: this.service?'service':'department',
        id: this.service?this.service:this.department,
        month:10,
        year:2021
      };
      let uri = '/times';
      this.$axios.post(uri,request).then(res=>{
        this.data = res.data.times;
        this.cargando = false;
      }).catch(()=>{
        this.cargando = false
      })

    },
    dateChange(){
      const dt = new Date(this.fecha).toString()
      alert(dt)
    },
    serviceChange(){
      this.department=null;
      this.loadData()
    },
    departmentChange(){
      this.service=null;
      this.loadData();
    }
  },
  mounted() {
    this.loadServices();
    this.loadDepartment();
  },
};
</script>
