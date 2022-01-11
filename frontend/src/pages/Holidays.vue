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
            Díás feriados
            <v-btn @click="dialogInsert = !dialogInsert" class="ml-10" fab x-small color="primary">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Filtrar"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="headers" :items="data" :search="search" :item-class="itemRowStyle" >
              <template v-slot:item.date="{ item }">
                {{ fecha(item.date)}}
              </template>
               <template v-slot:item.repeat="{ item }">
                <v-chip :color="item.repeat?'success':''">
                  {{item.repeat?'Si':"No"}}
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">

                <v-btn @click="editItem(item)" icon x-small>
                  <v-icon color="green">mdi-pencil</v-icon>
                </v-btn>

              </template>
            </v-data-table>
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
    <v-dialog
          v-model="dialogInsert"
          max-width="500px"
          persistent
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                  >
                    <v-text-field
                      v-model="editedItem.description"
                      label="Motivo"
                    ></v-text-field>
                  </v-col>
                 
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                  >
                    <v-menu
                      ref="menu"
                      :close-on-content-click="true"
                      transition="scale-transition"
                      offset-y
                      left
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          label="Fecha inicial planificada"
                          v-model="editedItem.date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.date"
                        no-title
                        scrollable
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                   <v-switch
                    v-model="editedItem.repeat"
                    label="Se repite todos los años"
                  ></v-switch>
                  </v-col>
                 
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </v-container>
</template>
<script>
import moment from 'moment'
export default {
  name: 'App',

  components: {},

  data: () => ({
    res: true,
    cargando: true,
    menu: false,
    group: false,
    data: [],
    snack: false,
    dialogInsert: false,
    valid: true,
    toDelete: null,
    search: '',
    dialog: false,
    snackColor: '',
    snackText: '',
    defaultItem: {
      description:'',
      date:moment().toISOString().substr(0, 10),
      repeat:false,
    },
    editedIndex:-1,
    editedItem:{
      description:'',
      date:moment().toISOString().substr(0, 10),
      repeat:false,
    },
    required: v => v != null || 'Debe escoger un valor!',
    headers: [
      {
        text: 'Descripción',
        align: 'start',
        value: 'description'
      },
      { text: 'Fecha', value: 'date' },
      { text: 'Dia', value: 'dia' },
      { text: 'Mes', value: 'mes' },
      { text: 'Repetible', value: 'repeat' },
      { text: 'Acciones', value: 'actions' }
    ],
    getAll:false
  }),
  computed: {
   
    formTitle () {
      return this.editedIndex === -1 ? 'Nuevo día feriado' : 'Editar dia feriado'
    },
  },
  methods: {
    itemRowStyle(item){
      if(item.deletedAt)
        return 'rowDeleted'
      return item.finalDateR ? 'rowCompleted':''
    },
    fecha (dt) {
      return moment(dt)
        .toISOString()
        .substr(0, 10)
    },
    save () {
      if (this.editedIndex > -1) {
          let uri = `/days/holy`
          this.$axios.put(uri, this.editedItem).then(() => {
            this.snack = true
            this.snackColor = 'success'
            this.snackText = 'Información guardada correctamente'
            Object.assign(this.data[this.editedIndex], this.editedItem);
            this.close()
          })
        } else {
            let uri = `/days/holy`
            this.$axios.post(uri, this.editedItem).then((res) => {
              this.snack = true
              this.snackColor = 'success'
              this.snackText = 'Información guardada correctamente'
              this.data.push(res.data.data)
              this.close()
            })
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
    remove (item) {
      this.toDelete = item
      this.dialog = !this.dialog
    },
    loadData () {
      this.cargando = true;
      let uri = '/days/holy'
      this.$axios.get(uri).then(res => {
        this.data = res.data.data
        this.cargando = false;
      }).catch(()=>{
        this.cargando = false;
      })
    },
    close(){
      this.dialogInsert = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
    },
    editItem(item){
      this.editedIndex = this.data.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.date=moment(this.editedItem.date).toISOString().substr(0, 10)
      this.dialogInsert = true;
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