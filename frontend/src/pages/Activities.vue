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
            Actividades no productivas
            <v-btn @click="dialogInsert = !dialogInsert" class="ml-10" fab x-small color="primary">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn @click="loadAll()" class="ml-10" fab x-small color="primary">
              <v-icon v-text="getAll?'mdi-eye':'mdi-eye-off'"></v-icon>
            </v-btn>
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
            <v-data-table :headers="headers" :items="data" :search="search" :item-class="itemRowStyle" >
              <template v-slot:item.rating="{ item }">
                <v-chip :color="item.rating?'success':''">
                  {{item.rating?'Si':"No"}}
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">

                <v-btn @click="editItem(item)" icon x-small>
                  <v-icon color="green">mdi-pencil</v-icon>
                </v-btn>

                <v-btn v-if="!item.deletedAt" @click="remove(item)" icon x-small>
                  <v-icon color="error">mdi-delete</v-icon>
                </v-btn>
                 <v-btn v-else icon x-small @click="restore(item)">
                  <v-icon color="success">mdi-check</v-icon>
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
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h5 text-center justify-center">
          <v-icon color="warning" x-large>mdi-alert-outline</v-icon>
          ¿Está seguro de querer eliminar el contrato
          {{ toDelete ? toDelete.code : '' }}?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="
              () => {
                dialog = false
                toDelete = null
              }
            "
          >
            Cancelar
          </v-btn>
          <v-btn color="error darken-1" text @click="deleteItem">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="Actividad"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-textarea
                      v-model="editedItem.description"
                      label="Descripción"
                    ></v-textarea>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                   <v-switch
                    v-model="editedItem.rating"
                    label="Se prorratea"
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
      name:'',
      description:'',
      rating:false
    },
    editedIndex:-1,
    editedItem:{
      name:'',
      description:'',
      rating:false
    },
    required: v => v != null || 'Debe escoger un valor!',
    headers: [
      {
        text: 'Nombre',
        align: 'start',
        value: 'name'
      },
      { text: 'Descripción', value: 'description' },
      { text: 'Se prorratea', value: 'rating' },
      { text: 'Acciones', value: 'actions' }
    ],
    getAll:false
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nueva actividad' : 'Editar Actividad'
    },
  },
  methods: {
    itemRowStyle(item){
      if(item.deletedAt)
        return 'rowDeleted'
      return ''
    },
    fecha (dt) {
      return moment(dt)
        .toISOString()
        .substr(0, 10)
    },
    save () {
      if (this.editedIndex > -1) {
            let uri = `/activity/${this.editedItem._id}`
            this.$axios.put(uri, this.editedItem).then((res) => {
              this.snack = true
              this.snackColor = 'success'
              this.snackText = 'Información guardada correctamente'
              Object.assign(this.data[this.editedIndex], res.data.data);
              this.close()
            })
        } else {
            let uri = `/activity`
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
      let uri = !this.getAll?'/activity':'/activity_all'
      this.$axios.get(uri).then(res => {
        this.data = res.data.data
        this.cargando = false;
      }).catch(()=>{
        this.cargando = false;
      })
    },
    loadAll() {
      this.getAll = ! this.getAll;
      this.loadData();
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
      this.editedItem.initialDateP=this.editedItem.initialDateP?moment(this.editedItem.initialDateP).toISOString().substr(0, 10):null
      this.editedItem.finalDateP=this.editedItem.finalDateP?moment(this.editedItem.finalDateP).toISOString().substr(0, 10):null
      this.editedItem.initialDateR=this.editedItem.initialDateR?moment(this.editedItem.initialDateR).toISOString().substr(0, 10):null
      this.editedItem.finalDateR=this.editedItem.finalDateR?moment(this.editedItem.finalDateR).toISOString().substr(0, 10):null
      this.dialogInsert = true;
    },
    deleteItem(){
      let uri = `activity/${this.toDelete._id}`;
      this.$axios.delete(uri).then(()=>{
        this.dialog = !this.dialog
        this.snack = true
        this.snackColor = 'success'
        this.snackText = 'Actividad marcada como eliminado'
        this.data = this.data.filter(item=>item._id!=this.toDelete._id)
        this.toDelete = null
      })
    },
    restore(item){
      let uri = `activity/${item._id}`;
      this.$axios.put(uri,{deletedAt:null}).then(()=>{
        this.snack = true
        this.snackColor = 'success'
        this.snackText = 'Proyecto restaurado'
        item.deletedAt = null
      })
    },
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