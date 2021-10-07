<template>
    <div>
          <v-app-bar
            app
            absolute
            color="primary"
            dark
            >

            <div class="d-flex align-center">
                <v-btn plain to="/">
                    <v-app-bar-title>
                        CT-ENPA
                    </v-app-bar-title>
                </v-btn>
            </div>

            <v-spacer></v-spacer>

            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn plain v-bind="attrs" v-on="on">
                        {{user.name}}
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-if="admin" to="/admin">
                        <v-list-item-title>Admin</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="logout()">
                        <v-list-item-title>Cerrar sesión</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>
        <v-main>
            <router-view></router-view>
        </v-main>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data() {
        return {
            drawer:false
        }
    },
    computed: {
        ...mapState('app',['auth','user']),
        admin(){
            return this.$hasRole('Administradores') || this.$hasRole('CTJefe') || this.$hasRole('CTRRHH')
        }
    },
    methods: {
        logout(){
            this.$axios.post('/logout').then(()=>{
                this.$router.push('/login');
            })
        }
    },
    mounted() {
        if(!this.auth)
            this.$router.push('/login')
        
         if(!this.$hasRole('CTProyectista'))
            return this.$router.push('/admin')
    },
}
</script>