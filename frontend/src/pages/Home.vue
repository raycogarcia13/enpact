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
    <v-row v-if="res">
      <v-col>
        <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
        >
         <template v-slot:top>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
            ></v-text-field>
        </template>
        <template v-slot:item.cant="props">
            <v-edit-dialog
            :return-value.sync="props.item.cant"
            large
            persistent
            @save="save(props.item)"
            @close="close"
            >
            <div>{{ props.item.cant }}</div>
            <template v-slot:input>
               <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                  @submit.prevent=""
                >
                  <div class="mt-4 title">
                  Timepo en esta actividad
                  </div>
                  <v-text-field
                  v-model="props.item.cant"
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
    fecha: moment().toISOString().substr(0,10),
    maxDate: moment().toISOString().substr(0,10),
    projects:[],
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
        text: 'Producto',
        align: 'start',
        value: 'nombre',
      },
      { text: 'kg', value: 'cant' },
    ],

  }),
  computed: {
    items(){
      return [{nombre:'Hola',cant:'2'}]
    }
  },
  methods: {
     save (item) {
        // if(this.$refs.form.validate())
        // {
        //   let uri = '/api/captador';
          item['date'] =this.fecha;
        //   item['unidad'] =this.unidad._id;
        //   item.cant = Number.parseFloat(item.cant);
        //   this.$axios.put(uri,item).then(()=>{
        //     this.snack = true
        //     this.snackColor = 'success'
        //     this.snackText = 'Información guardada correctamente';
        //   })
        // }else
        // {
        //     this.$refs.form.reset()
        //     this.$refs.form.resetValidation()
        //     this.snack = true
        //     this.snackColor = 'danger'
        //     this.snackText = 'Tiene errores en le formulario';
        // }

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
        alert('hla')
      },
      nextDay(){
        this.fecha = moment(this.fecha).add(1,"day").toISOString().substr(0,10)
      },
      prevDay(){
        this.fecha = moment(this.fecha).subtract(1,"day").toISOString().substr(0,10)
      }
  },
};
</script>
