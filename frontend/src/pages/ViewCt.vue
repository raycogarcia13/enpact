<template>
    <v-container>
      <v-row class="mt-5">
        <v-col cols="" class="text-center">
        <h2>
          {{projector.name}}
        </h2>
        </v-col>

        <v-col cols="3" class="text-center">
              <!-- :return-value.sync="fecha" -->
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="true"
              :return-value.sync="setFecha"
              transition="scale-transition"
              offset-y
              left
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="fecha"
                  prepend-icon="mdi-calendar"
                  readonly
                  dense
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="fecha"
                no-title
                scrollable
                :max="maxDate"
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="menu = false"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="()=>{this.loadData(); menu = false}"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
            <v-btn @click="prevDay()" small icon color="primary">
              <v-icon>mdi-chevron-left-circle-outline</v-icon> 
            </v-btn>
            <v-btn @click="nextDay()" small icon color="primary" class="ml-5">
              <v-icon>mdi-chevron-right-circle-outline</v-icon> 
            </v-btn>
        </v-col>
    </v-row>

<v-expand-transition>
 <v-row v-if="cargando"
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
    <v-row v-if="res" class="mt-0">
      <v-col>
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
         <v-card-text>
          <v-data-table
              :headers="headers"
              :items="itemsActivities"
              :search="search"
              hide-default-footer
              :item-class="itemRowStyle"
          >
          <template v-slot:item.time="props">
              <div v-if="props.item.editable==true">
                <v-edit-dialog
                :return-value.sync="props.item.time"
                large
                persistent
                @save="save(props.item)"
                @close="close"
                >
                <div>{{ props.item.time }} </div>
                <template v-slot:input>
                  <v-form
                      ref="form"
                      v-model="valid"
                      lazy-validation
                      @submit.prevent=""
                    >
                      <div class="mt-4 title">
                      Tiempo en esta actividad
                      </div>
                      <v-text-field
                      v-model="props.item.time"
                      :rules="[isRequired,max25chars]"
                      label="Tiempo empleado"
                      single-line
                      counter
                      autofocus
                      v-on:keyup.enter="save(props.item)"
                      ></v-text-field>
                  </v-form>
                </template>
                </v-edit-dialog>
              </div>
              <div v-else>
                {{ props.item.time }} 
              </div>
          </template>
          </v-data-table>
         </v-card-text>
        </v-card>


      </v-col>
      <v-col class="text-center d-flex flex-column align-center justify-center">
        <h2>{{fecha}}</h2>
        Tiempo total:
        <h2><span :class="sumHoursDay>cantDias()?'error--text':'success--text'">{{sumHoursDay}}</span> /{{this.cantDias()}} </h2>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
         <v-card-text>
          <v-data-table
              :headers="headersS"
              :items="itemServices"
              :search="search"
              hide-default-footer
              :item-class="itemRowStyle"
          >
          <template v-slot:item.time="props">
              <!-- :return-value.sync="props.item.time" -->
              <v-edit-dialog
              large
              persistent
              @save="save(props.item)"
              @close="close"
              >
              <div>{{ props.item.time }} </div>
              <template v-slot:input>
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                    @submit.prevent=""
                  >
                    <div class="mt-4 title">
                    Tiempo en esta actividad
                    </div>
                    <v-text-field
                    v-model="props.item.time"
                    :rules="[max25chars]"
                    label="Tiempo empleado"
                    single-line
                    counter
                    autofocus
                    v-on:keyup.enter="save(props.item)"
                    ></v-text-field>
                </v-form>
              </template>
              </v-edit-dialog>
          </template>
          </v-data-table>
         </v-card-text>
        </v-card>

        <v-snackbar
        v-model="snack"
        :timeout="3000"
        :color="snackColor"
        shaped
        >
        {{ snackText }}

        <template v-slot:action="{ attrs }">
            <v-btn
            v-bind="attrs"
            text
            @click="snack = false"
            >
            Cerrar
            </v-btn>
        </template>
        </v-snackbar>

      </v-col>
    </v-row>
    </v-container>
</template>
<script>
import moment from 'moment'

export default {
  name: 'App',

  props:['id','date'],
  components: {
  },

  data: () => ({
    res:true,
    cargando:false,
    menu:false,
    fecha: moment().format('YYYY-MM-DD'),
    items:[],
    maxDate: moment().format('YYYY-MM-DD'),
    services:[],
    activities:[],
    schedule:[],
    projector:{},
    ct:[],
    isHoly:false,
    snack: false,
    valid:true,
    search:'',
    snackColor: '',
    snackText: '',
    isRequired:  v => !!v  || 'Es obligatorio!',
    max25chars: v => !isNaN(v) || 'Debe ser un valor númerico!',
    headers: [
      {
        text: 'Actividad',
        align: 'start',
        value: 'name',
      },
      { text: 'Horas', value: 'time' },
    ],
    headersS: [
      {
        text: 'Servicio',
        align: 'start',
        value: 'name',
      },
      { text: 'Identificador', value: 'code' },
      { text: 'Horas', value: 'time' },
    ],

  }),
  watch: {
    fecha(){
        if(this.$router.currentRoute.path !=`/viewct/${this.$router.currentRoute.params.id}/${this.fecha}`  )
          this.$router.push(`/viewct/${this.$router.currentRoute.params.id}/${this.fecha}`)
    }
  },
  computed: {
    
    setFecha:{
      set(){
        this.fecha = moment(this.fecha).format('YYYY-MM-DD');
        this.loadData();
      },
      get(){
        return this.fecha
      }
    },
    itemsActivities(){
      return this.ct.filter(item=>item.type=='activity');
    },
    itemServices(){
      return this.ct.filter(item=>item.type=='service');
    },
    sumHoursDay(){
      return this.ct.reduce((count,item)=>{return count+(parseInt(item.time)||0)},0)
    }
  },
  methods: {
    countHourDayP(dt){
      let fecha = new Date(dt);
      let d = fecha.getDay();
      if(this.isHoly)
        return 0;
      return this.schedule[d];
    },
    cantDias(){
      return this.countHourDayP(moment(this.fecha));
    },
     itemRowStyle(item){
      if(item.type == 'activity')
        if(item.editable)
          return 'activity'
        else
          return 'activityDisabled'
      return 'service'
    },
   async save (item) {
     
     if(this.$refs.form.validate())
        {
          if(this.sumHoursDay > this.cantDias())
          {
            this.snack = true
            this.snackColor = 'error'
            this.snackText = `No puede excederse de ${this.cantDias()} de horas`;
            this.loadData()
            return;
          }
            const data = {
              type:item.type,
              date:moment(this.fecha).format('YYYY-MM-DD'),
              id:item.id,
              cantHours:item.time,
              me:this.id
            }
            let uri = '/ct'
            this.$axios.put(uri, data).then(() => {
              this.snack = true
              this.snackColor = 'success'
              this.snackText = 'Información guardada correctamente'
              this.close()
            })
        }else
        {
            this.snack = true
            this.snackColor = 'error'
            this.snackText = 'Tiene errores en le formulario';
            this.loadData()
        }

      },
      cancel () {
        this.snack = true
        this.snackColor = 'error'
        this.snackText = 'Canceled'
      },
      open () {
        this.snack = true
        this.snackColor = 'info'
        this.snackText = 'Dialog opened'
      },
      close () {
        // console.log('Dialog closed')
      },
      async loadData(){
        this.loadIsHoly()
        let uri = '/ct_admin'
        this.cargando = true;
        await this.$axios.post(uri,{id:this.id,date:this.fecha}).then((res)=>{
          this.ct = res.data.all;
          this.items = res.data.all;
          this.cargando = false;
        }).catch(()=>{
          this.cargando = false
        })
      },
      async loadSchedule(){
        let uri = '/days/schedule'
        this.cargando = true;
        await this.$axios.get(uri).then((res)=>{
          this.schedule = res.data.schedule;
          this.cargando = false;
        }).catch(()=>{
          this.cargando = false
        })
      },
      loadMyservices(){
        let uri = '/admin_services/'+this.id
        this.cargando = true;
        this.$axios.get(uri).then(res=>{
          this.services = res.data.data;
          this.cargando = false;
        }).catch(()=>{
          this.cargando = false
        })
      },
      loadProjector(){
        let uri = '/projector/'+this.id
        this.cargando = true;
        this.$axios.get(uri).then(res=>{
          this.projector = res.data.data;
          this.cargando = false;
        }).catch(()=>{
          this.cargando = false
        })
      },
      loadActivities(){
        let uri = '/activity'
        this.cargando = true;
        this.$axios.get(uri).then(res=>{
          this.activities = res.data.data;
          this.cargando = false;
        }).catch(()=>{
          this.cargando = false
        })
      },
      loadIsHoly(){
        let uri = '/days/holiday'
        this.cargando = true;
        this.$axios.post(uri,{date:this.fecha}).then(res=>{
          this.isHoly = res.data.data?true:false;
          this.cargando = false;
        }).catch(()=>{
          this.cargando = false
        })
      },
      nextDay(){
        this.fecha = moment(this.fecha).add(1,"day").format('YYYY-MM-DD')
        this.loadData();
      },
      prevDay(){
        this.fecha = moment(this.fecha).subtract(1,"day").format('YYYY-MM-DD')
        this.loadData();
      }
  },
  mounted() {
    if(this.date){
      this.fecha  = this.date;
    }
    // this.loadMyservices();
    // this.loadActivities();
    this.loadSchedule();
    this.loadData();
    this.loadProjector();
  },
};
</script>

<style>
  .activity{
    color: green;
  }
  .activityDisabled{
    color: gray;
  }
  .service{
    color: red;
  }
</style>