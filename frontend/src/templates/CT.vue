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
                        <v-list-item-icon>
                            <v-icon>mdi-lock</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Admin</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="sendLogout()">
                        <v-list-item-icon>
                            <v-icon>mdi-logout</v-icon>
                        </v-list-item-icon>
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
import {mapState,mapActions} from 'vuex'
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
        ...mapActions('app',['logout']),
        sendLogout(){
            this.$axios.post('/logout').then(()=>{
                this.logout();
                this.$router.push('/login');
            })
        }
    },
    beforeMount() {
        if(!this.auth )
            return this.$router.push('/login')
        
    } 
}
</script>