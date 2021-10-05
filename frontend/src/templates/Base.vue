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
               <v-app-bar-title>
                CT-ENPA
               </v-app-bar-title>
            </div>

            <v-spacer></v-spacer>

            <v-btn plain>
                Paco Alcacer
                <v-avatar color="red" class="ml-1">
                    <v-icon>mdi-account</v-icon>
                </v-avatar>
            </v-btn>
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
                <v-list-item to="/contratos">
                    <v-list-item-title>Contratos</v-list-item-title>
                </v-list-item>

                <v-list-item to="/servicios">
                    <v-list-item-title>Servicios</v-list-item-title>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Actividades no productivas</v-list-item-title>
                </v-list-item>

                <v-list-item to="/proyectista">
                    <v-list-item-title>Proyectistas</v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>Control de timepos</v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>Control de ausencias</v-list-item-title>
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
import {mapState} from 'vuex'
export default {
    data() {
        return {
            drawer:false
        }
    },
    computed: {
        ...mapState('app',['auth'])
    },
    mounted() {
        // if(!this.auth)
            // this.$router.push('/login')
        // console.log(this.auth)
    },
}
</script>