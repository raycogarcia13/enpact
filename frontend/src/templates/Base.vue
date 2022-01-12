<template>
    <div>
        <v-app-bar
            app
            absolute
            color="primary"
            dark
            >
             <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

            <div class="d-flex align-center">
                <v-btn plain to="/admin">
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


        <v-navigation-drawer
            v-model="drawer"
            absolute
            app
            >
            <v-list nav dense>
                <v-list-item-group
                active-class="primary--text text--accent-4"
                >
                <v-list-item to="/admin">
                    <v-list-item-title>Inicio</v-list-item-title>
                </v-list-item>
                <v-list-item to="/contratos">
                    <v-list-item-title>Contratos</v-list-item-title>
                </v-list-item>

                <v-list-item to="/servicios">
                    <v-list-item-title>Servicios</v-list-item-title>
                </v-list-item>

                <v-list-item to="/actividades">
                    <v-list-item-title>Actividades no productivas</v-list-item-title>
                </v-list-item>

                <v-list-item to="/proyectista">
                    <v-list-item-title>Proyectistas</v-list-item-title>
                </v-list-item>
                <v-list-item to="/times">
                    <v-list-item-title>Control de tiempos</v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>Control de ausencias</v-list-item-title>
                </v-list-item>
                <v-list-item to="/holidays">
                    <v-list-item-title>Días feriados</v-list-item-title>
                </v-list-item>
                <v-list-item to="/schedule">
                    <v-list-item-title>Configuración de horas por día</v-list-item-title>
                </v-list-item>
                <v-list-item to="/closer">
                    <v-list-item-title>Cierre</v-list-item-title>
                </v-list-item>
                <v-list-item to="/departments">
                    <v-list-item-title>Departamentos</v-list-item-title>
                </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
        <v-main>
            <router-view></router-view>
        </v-main>
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
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
        if(!this.admin)
            return this.$router.push('/')
    
    }
}
</script>