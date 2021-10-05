<template>
    <v-container>
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
                :items="data"
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
            <template v-slot:item.department="{item}">
              {{(item.department)?item.department.name:'...'}}
                <v-edit-dialog
                :return-value.sync="item.department"
                large
                persistent
                @save="save(item)"
                @close="close"
                >
                <template v-slot:input>
                  <v-form
                      ref="form"
                      v-model="valid"
                      lazy-validation
                      @submit.prevent=""
                    >
                      <div class="mt-4 title">
                      Departamento
                      </div>
                        <v-select
                          :items="selDepartments"
                          :rules="[required]"
                          v-model="item.department"
                        ></v-select>
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
export default {
  name: 'App',

  components: {
  },

  data: () => ({
    res:true,
    cargando:false,
    menu:false,
    data:[],
    departments:[],
    snack: false,
    valid:true,
    search:'',
    snackColor: '',
    snackText: '',
    required: v => v!=null || 'Debe escoger un valor!',
    headers: [
      {
        text: 'Nombre',
        align: 'start',
        value: 'name',
      },
      { text: 'Usuario', value: 'username' },
      { text: 'Departamento', value: 'department' },
    ],

  }),
  computed: {
    selDepartments(){
      return this.departments.map(item=>{ return {value:item,text:item.name}})
    }
  },
  methods: {
     save (item) {
        if(this.$refs.form.validate())
        {
          let uri = `/projector/${item._id}/department`;
          this.$axios.put(uri,{department:item.department._id}).then(()=>{
            this.snack = true
            this.snackColor = 'success'
            this.snackText = 'Información guardada correctamente';
          })
        }else
        {
            this.$refs.form.reset()
            this.$refs.form.resetValidation()
            this.snack = true
            this.snackColor = 'error'
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
        let uri = '/projector';
        this.$axios.get(uri).then(res=>{
          this.data = res.data.data
        })
      },
      loadDepartments(){
        let uri = '/department';
        this.$axios.get(uri).then(res=>{
          this.departments = res.data.data
        })
      }
  },
  mounted() {
    this.loadData();
    this.loadDepartments();
  },
};
</script>
