<template>
    <v-main class="container">
          <v-card class="rounded-xl" :class="{'elevation-0':$vuetify.breakpoint.mobile}">
            <v-card-title>
              <v-spacer></v-spacer>
                CT ENPA
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text class="px-15">
              <v-text-field
                solo
                light
                rounded
                dense
                autocomplete
                v-model="email"
                name="email"
                label="Correo"
                append-icon="mdi-email"
              ></v-text-field>
              <v-text-field
                solo
                type="password"
                light
                name="password"
                rounded
                dense
                v-model="password"
                autocomplete="false"
                label="Contraseña"
                append-icon="mdi-lock"
              ></v-text-field>

               <v-alert
                  color="red lighten-2"
                  dark
                  dense
                  class="rounded-xl"
                  type="error"
                  v-if="error"
                  transition="scale-transition"
                >
                  {{error}}
                </v-alert>

            </v-card-text>
            <v-divider v-if="!$vuetify.breakpoint.mobile" ></v-divider>
            <v-card-actions class="pa-5">
              <v-spacer></v-spacer>
                <v-btn rounded color="primary" :block="$vuetify.breakpoint.mobile" @click="sendLogin">
                  Entrar
                </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
    </v-main>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Login',

  data: () => ({
    error:'',
    email:'',
    password:''
  }),
  computed: {
    ...mapState('app',['auth']),
  },
  methods: {
    ...mapActions('app', ['login','logout']),
    sendLogin(){
      let uri = 'login';
      this.$axios.post(uri,{email:this.email,password:this.password}).then(res=>{
        if(res.data.user.role == 'Admin'){
          this.login(res)
          this.$router.push('/')  
        }else{
          this.error = "Acceso denegado"
        }
      }).catch(err => {
        this.error = err.response.data.error
      })
    }
  },
};
</script>

<style scoped>
  .container {
    display: grid;
    width: '100vw';
    height: '100vh';
    place-items: center;
    /* align-items: center; */
    /* justify-content: center; */
  }
  .login-area {
    background-color: 'red';
  }
</style>