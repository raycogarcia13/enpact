import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
       {
            path: '/',
            component: ()=>import('@/templates/Base'),
            children:[
                {
                    path: '',
                    component: ()=>import('@/pages/Home')
                },
                {
                    path: '/proyectista',
                    component: ()=>import('@/pages/Projector')
                },
                {
                    path: '/contratos',
                    component: ()=>import('@/pages/Projects')
                },
                {
                    path: '/servicios',
                    component: ()=>import('@/pages/Services')
                },
            ]
        },
       {
            path: '/login',
            name: 'Login',
            component: ()=>import('@/pages/Login'),
        },
    ]
})