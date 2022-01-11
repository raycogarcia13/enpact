<template>
  <v-container>
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
    <v-row v-if="res">
      <v-col>
        <v-card>
          <v-card-title>
            Configuraciones
          </v-card-title>
          <v-card-text>
            <v-card class="elevation-0">
              <v-card-title>
                Cantidad de horas por día
                <v-spacer></v-spacer>  
                Total de Horas semanal: 
                {{ schedule.reduce((act,it)=>{return act+ (parseInt(it)||0) },0) }}
              </v-card-title>
              <v-card-text>
              <v-row>
                <v-col v-for="(item,i) in schedule" :key="i">
                  <v-text-field
                    v-model="schedule[i]"
                    :label="label(i)"
                  ></v-text-field>
                </v-col>
              </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="save"
                  >
                    Guardar
                  </v-btn>
              </v-card-actions>
            </v-card>
            <v-divider></v-divider>
          </v-card-text>
        </v-card>
        <v-snackbar v-model="snack" :timeout="3000" :color="snackColor" shaped>
          {{ snackText }}

          <template v-slot:action="{ attrs }">
            <v-btn v-bind="attrs" text @click="snack = false">
              Cerrar
            </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import {days} from '../utils/datesUtil'
export default {
  name: 'App',

  components: {},

  data: () => ({
    res: true,
    cargando: true,
    schedule: [],
    snack: false,
    snackColor: '',
    snackText: '',
  }),
  computed: {
  
  },
  methods: {
    label(i){
      return days[i]; 
    },
    save () {
        let uri = `/days/schedule`
        // console.log(this.schedule)
        this.$axios.put(uri, {days:this.schedule}).then(() => {
          this.snack = true
          this.snackColor = 'success'
          this.snackText = 'Información guardada correctamente'
        })
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
    loadData () {
      this.cargando = true;
      let uri = '/days/schedule'
      this.$axios.get(uri).then(res => {
        this.schedule = res.data.schedule
        this.cargando = false;
      }).catch(()=>{
        this.cargando = false;
      })
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style>
  .rowDeleted{
    text-decoration-line: line-through;
    text-decoration-color: red;
  }
  .rowCompleted{
    color: green;
  }
</style>