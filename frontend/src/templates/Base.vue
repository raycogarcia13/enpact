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

            <v-btn text>
                {{user.name}}
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

                <v-list-item to="/actividades">
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
        ...mapState('app',['auth','user'])
    },
    methods: {
        // ...mapActions('app',['hasRole']),

    },
    mounted() {
        if(!this.auth)
            return this.$router.push('/login')
        
        if(!this.$hasRole('CTJefe') || !this.$hasRole('CTRHH'))
            return this.$router.push('/')
    },
}
</script>