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
            Servicios
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
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="headers" :items="data" :search="search" :item-class="itemRowStyle" >
              <template v-slot:item.project="{ item }">
                {{ item.project.name }}
              </template>
              <template v-slot:item.fecha_inicio="{ item }">
                {{ `${item.initialDateP?fecha(item.initialDateP):'-'} /` }}
                <b>{{ item.initialDateR?fecha(item.initialDateR):'-' }}</b>
              </template>
              <template v-slot:item.fecha_final="{ item }">
                {{ `${fecha(item.finalDateP)} /` }}
                <b>{{ item.finalDateR ? fecha(item.finalDateR) : '-' }}</b>
              </template>
              <template v-slot:item.team="{ item }">
                {{ item.team.map(item=>getName(item.name)).join(' - ')}}
                <!-- {{ item.team.map(item=>item.name).join(' - ')}} -->
              </template>
              <template v-slot:item.projectManager="{ item }">
                {{ item.projectManager.name}}
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
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="Nombre del contrato"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.code"
                      label="Código"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                  >
                    <v-select
                      v-model="editedItem.project"
                      :items="selProjects"
                      :menu-props="{ maxHeight: '400' }"
                      label="Proyecto"
                      hint="Selecciona el proyecto al que pertence"
                    ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
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
                          v-model="editedItem.initialDateP"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.initialDateP"
                        no-title
                        scrollable
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
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
                          label="Fecha final planificada"
                          v-model="editedItem.finalDateP"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.finalDateP"
                        no-title
                        scrollable
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
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
                          label="Fecha inicial real"
                          v-model="editedItem.initialDateR"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.initialDateR"
                        no-title
                        scrollable
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
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
                          label="Fecha final real"
                          v-model="editedItem.finalDateR"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.finalDateR"
                        no-title
                        scrollable
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                  >
                    <v-select
                      v-model="editedItem.projectManager"
                      :items="selProjectors"
                      :menu-props="{ maxHeight: '400' }"
                      label="Jefe del proyecto"
                      hint="Escoge al jefe del proyecto"
                    ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                  >
                    <v-select
                      v-model="editedItem.team"
                      :items="selProjectors"
                      :menu-props="{ maxHeight: '400' }"
                      label="Equipo"
                      multiple
                      hint="Selecciona los integrantes del equipo"
                    ></v-select>
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
    projectors: [],
    projects: [],
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
      code:'',
      initialDateP:moment().toISOString().substr(0, 10),
      initialDateR:null,
      finalDateP:null,
      finalDateR:null,
      project:null,
      projectManager:{},
      team:[]
    },
    editedIndex:-1,
    editedItem:{
      name:'',
      code:'',
      initialDateP:moment().toISOString().substr(0, 10),
      initialDateR:null,
      finalDateP:null,
      finalDateR:null,
      projectManager:{},
      project:null,
      team:[]
    },
    required: v => v != null || 'Debe escoger un valor!',
    headers: [
      {
        text: 'Nombre',
        align: 'start',
        value: 'name'
      },
      { text: 'Proyecto', value: 'project' },
      { text: 'Código', value: 'code' },
      { text: 'Fecha Inicio(P/R)', value: 'fecha_inicio' },
      { text: 'Fecha Final(P/R)', value: 'fecha_final' },
      { text: 'J/Proyecto', value: 'projectManager' },
      { text: 'Equipo', value: 'team' },
      { text: 'Acciones', value: 'actions' }
    ],
    getAll:false
  }),
  computed: {
    selProjectors () {
      return this.projectors.map(item => {
        return { value: item, text: item.name }
      })
    },
    selProjects () {
      return this.projects.map(item => {
        return { value: item, text: item.name }
      })
    },
    formTitle () {
      return this.editedIndex === -1 ? 'Nuevo servicio' : 'Editar servicio'
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
        let data = {...this.editedItem}
        data.projectManager = data.projectManager._id;
        data.project = data.project._id;
        data.team = data.team.map(item=>item._id)
            let uri = `/services/${this.editedItem._id}`
            this.$axios.put(uri, this.editedItem).then((res) => {
              this.snack = true
              this.snackColor = 'success'
              this.snackText = 'Información guardada correctamente'
              Object.assign(this.data[this.editedIndex], res.data.data);
              this.close()
            })
        } else {
            let uri = `/services`
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
      let uri = !this.getAll?'/services':'/services_all'
      this.$axios.get(uri).then(res => {
        this.data = res.data.data
        this.cargando = false;
      }).catch(()=>{
        this.cargando = false;
      })
    },
    loadProjectors () {
      this.cargando = true;
      let uri = '/projector_only'
      this.$axios.get(uri).then(res => {
        this.projectors = res.data.data
        this.cargando = false;
      }).catch(()=>{
        this.cargando = false;
      })
    },
    loadProjects () {
      this.cargando = true;
      let uri = '/project_only'
      this.$axios.get(uri).then(res => {
        this.projects = res.data.data
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
      let uri = `project/${this.toDelete._id}`;
      this.$axios.delete(uri).then(()=>{
        this.dialog = !this.dialog
        this.snack = true
        this.snackColor = 'success'
        this.snackText = 'Proyecto marcado como eliminado'
        this.data = this.data.filter(item=>item._id!=this.toDelete._id)
        this.toDelete = null
      })
    },
    restore(item){
      let uri = `project/${item._id}`;
      this.$axios.put(uri,{deletedAt:null}).then(()=>{
        this.snack = true
        this.snackColor = 'success'
        this.snackText = 'Proyecto restaurado'
        item.deletedAt = null
      })
    },
    getName(name){
      return name.split(' ')[0]
    }
  },
  mounted () {
    this.loadData();
    this.loadProjectors();
    this.loadProjects();
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