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
                {
                    path: '/holidays',
                    component: ()=>import('@/pages/Holidays')
                },
                {
                    path: '/schedule',
                    component: ()=>import('@/pages/Config')
                },
                {
                    path: '/closer',
                    component: ()=>import('@/pages/Closer')
                },
                {
                    path: '/times',
                    component: ()=>import('@/pages/Times')
                },
                {
                    path: '/departments',
                    component: ()=>import('@/pages/Departments')
                },
                {
                    path: '/viewct/:id/:date?',
                    component: ()=>import('@/pages/ViewCt'),
                    props:true
                },
            ]
        },
       {
            path: '/login',
            name: 'Login',
            component: ()=>import('@/pages/Login'),
        },
       {
             path: '/:date?',
            component: ()=>import('@/templates/CT'),
            children:[{
                path: '',
                props:true,
                component: ()=>import('@/pages/Home'),
            }
            ]
        },
    ]
})