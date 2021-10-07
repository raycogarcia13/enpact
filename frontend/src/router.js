import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
       {
            path: '/admin',
            component: ()=>import('@/templates/Base'),
            children:[
                {
                    path: '',
                    component: ()=>import('@/pages/Admin')
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
                {
                    path: '/actividades',
                    component: ()=>import('@/pages/Activities')
                },
            ]
        },
       {
             path: '/',
            component: ()=>import('@/templates/CT'),
            children:[{
                path: '',
                component: ()=>import('@/pages/Home'),
            }
            ]
        },
       {
            path: '/login',
            name: 'Login',
            component: ()=>import('@/pages/Login'),
        },
    ]
})