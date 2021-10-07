<template>
    <v-container>
      <v-row class="mt-5">
        <v-col cols="" class="text-center">
        <h2>Control de tiempo trabajado en proyectos</h2>
        </v-col>

        <v-col cols="3" class="text-center">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="fecha"
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
                  @click="loadData()"
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
              :items="items"
              :search="search"
              hide-default-footer
              :item-class="itemRowStyle"
          >
          <template v-slot:item.time="props">
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

  components: {
  },

  data: () => ({
    res:true,
    cargando:false,
    menu:false,
    fecha: moment().format('YYYY-MM-DD'),
    maxDate: moment().format('YYYY-MM-DD'),
    services:[],
    activities:[],
    ct:[],
    snack: false,
    valid:true,
    search:'',
    snackColor: '',
    snackText: '',
    max25chars: v => !isNaN(v) || 'Debe ser un valor númerico!',
    headers: [
      {
        text: 'Actividad/Servicio',
        align: 'start',
        value: 'name',
      },
      { text: 'Identificador', value: 'code' },
      { text: 'Horas', value: 'time' },
    ],

  }),
  computed: {
    items(){
      let all = [];
      this.activities.forEach(item => {
        let time = this.ct.find(act=>act.activity?act.activity._id==item._id:false);
        time = time?time.cantHours:0
        all.push({type:'activity',id:item._id,name:item.name,code:'item.code', time})
      });
      this.services.forEach(item => {
        let time = this.ct.find(act=>act.service?act.service._id==item._id:false);
        time = time?time.cantHours:0
        all.push({type:'service',id:item._id,name:item.name,code:item.code, time})
      });

      return all;
    }
  },
  methods: {
     itemRowStyle(item){
      if(item.type == 'activity')
        return 'activity'
      return 'service'
    },
     save (item) {
        if(this.$refs.form.validate())
        {
            const data = {
              type:item.type,
              date:moment(this.fecha).format('YYYY-MM-DD'),
              id:item.id,
              cantHours:item.time
            }
            let uri = '/ct'
            this.$axios.put(uri, data).then((res) => {
              this.snack = true
              this.snackColor = 'success'
              this.snackText = 'Información guardada correctamente'
              console.log(res.data.data);
              // Object.assign(this.ct[this.ct.findIndex(t=>t._id == res.data.data._id)], res.data.data);
              this.close()
            })
        }else
        {
            this.$refs.form.reset()
            this.$refs.form.resetValidation()
            this.snack = true
            this.snackColor = 'danger'
            this.snackText = 'Tiene errores en le formulario';
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
        console.log('Dialog closed')
      },
      loadData(){
        let uri = '/ct'
        this.cargando = true;
        this.$axios.post(uri,{date:this.fecha}).then((res)=>{
          this.ct = res.data.services.concat(res.data.activities);
          this.cargando = false;
        }).catch(()=>{
          this.cargando = false
        })
      },
      loadMyservices(){
        let uri = '/my_services'
        this.cargando = true;
        this.$axios.get(uri).then(res=>{
          this.services = res.data.data;
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
    this.loadMyservices();
    this.loadActivities();
    this.loadData();
  },
};
</script>

<style>
  .activity{
    color: green;
  }
  .service{
    color: red;
  }
</style>