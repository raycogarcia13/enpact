import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi',
    },
     theme: {
        themes: {
            light: {
                primary: "#0f7b4a",
                // secondary: "#171b34",
                // // secondary: "#ff0000",
                // accent: "#3D87E4"
            }
        }
    }
});
