import Vue from 'vue'
import VueRouter from 'vue-router'
import ProcessesShow from '../views/ProcessesShow'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'processesShow',
    component: ProcessesShow
  },
  {
    path: '/processesExample',
    name: 'processesExample',
    component: () => import('../views/ProcessesExample')
  },
  {
    path: '/businessTemplate',
    name: 'businessTemplate',
    component: () => import('../views/BusinessTemplate')
  },
  {
    path: '/businessLists',
    name: 'businessLists',
    component: () => import('../views/BusinessLists')
  },
  {
    path: '/processDesign',
    name: 'processDesign',
    component: () => import('../components/ProcessDesign')
  },
  {
    path: '/businessTemplateEdit',
    name: 'businessTemplateEdit',
    component: () => import('../components/BusinessTemplateEdit')
  },
  {
    path: '/businessListsEdit',
    name: 'businessListsEdit',
    component: () => import('../components/BusinessListsEdit')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
