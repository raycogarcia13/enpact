<template>
    <v-container>
      <v-row>
        <v-col>
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
          <v-col class="text-right">
              <v-btn :disabled="!active" @click="modalClose = true" color="success">Hacer cierre del mes</v-btn>
          </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card v-if="all.length>0">
            <v-card-title>
              {{suma}}/{{horas*all.length}}
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
                :items="all"
                :search="search"
                hide-default-footer
            >
            <template v-slot:item.department="props">
              <div>{{props.item.department.name}}</div>
            </template>
            <template v-slot:item.activities="props">
              <div>{{props.item.actRating}} / {{props.item.actTotal}}</div>
            </template>
            <template v-slot:item.services="props">
              <div>{{props.item.servTotal}}</div>
            </template>
            <template v-slot:item.horas="props">
              <div :class="props.item.actRating+props.item.servTotal>horas?'success--text':'error--text'">{{props.item.actRating+props.item.servTotal}} / {{horas}}</div>
            </template>
            </v-data-table>
          </v-card-text>
          </v-card>
          <v-card v-else>
          <v-card-text class="text-center">
            {{message}}
          </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-dialog
      v-model="modalClose"
      width="500"
    >
      <v-card>
        <v-card-title>
          Cierre del mes {{month}}/{{year}}
        </v-card-title>
        <v-card-text>

          <v-form>
              <v-text-field
                autocomplete
                v-model="prodbruta"
                name="prodbruta"
                label="Producción bruta"
              ></v-text-field>
                <v-text-field
                autocomplete
                v-model="prodmerca"
                name="email"
                label="Producción mercantil"
              ></v-text-field>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="cierre()"
          >
           Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    </v-container>
</template>
<script>

import {countHourMonth} from "../utils/datesUtil"

export default {
  name: 'Admin',

  components: {
  },

  data: () => ({
    fecha:null,
    month:null,
    year:null,
    search:'',
    message:'Debe seleccionar un mes',
     headers: [
      {
        text: 'Nombre',
        align: 'start',
        value: 'name',
      },
      { text: 'Departamento', value: 'department' },
      { text: 'Productivo', value: 'services' },
      { text: 'No Productivo', value: 'activities' },
      { text: 'Horas', value: 'horas' }
    ],
    all:[],
    horas:0,
    suma:0,
    modalClose:false,
    prodmerca:0,
    prodbruta:0,
    snack: false,
    snackColor: '',
    snackText: '',
  }),
  computed: {
    active(){
      return this.month && this.year&&this.ready
    },
    ready(){
      // if(this.suma>=this.horas*this.all.length)
          return true
      // return false
    }
  },
  methods: {
    cierre(){
      if(this.prodmerca > this.prodbruta){
        this.sendMessage('error','La producción mercantil no puede ser mayor que la bruta')
        return;
      }

      

      let uri = `/month/${this.month}/${this.year}`;
      this.$axios.put(uri,{
        prodbruta:this.prodbruta, prodmerca:this.prodmerca
      }).then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log('error',err)
      })
      this.modalClose = false;
    },
    sendMessage(type,msg){
      this.snack = true
      this.snackColor = type
      this.snackText = msg;
    },
    verifyCloser(){
      this.all = [];
      let uri = `/month/${this.month}/${this.year}`;
      this.$axios.get(uri).then(res=>{
        this.all = res.data.data
        this.message = 'Debe seleccionar un mes';

        this.suma = this.all.reduce((sum,it)=>{
          return sum+it.actRating+it.servTotal;
        },0)

      }).catch(err=>{
        this.message = err.response.data.error
      })
    },
    dateChange(){
      const st = this.fecha.split('-');
      this.month = st[1];
      this.year = st[0];
      this.verifyCloser()
      this.horas = countHourMonth(this.month,this.year)
    }
  },
};
</script>
