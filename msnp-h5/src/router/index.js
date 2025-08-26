import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/activity/list'
  },
  {
    path: '/activity/list',
    name: 'activity-list',
    component: () => import('../views/activity/ActivityList.vue')
  },
  {
    path: '/activity/filter',
    name: 'activity-filter',
    component: () => import('../views/activity/ActivityFilter.vue')
  },
  {
    path: '/activity/detail/:id',
    name: 'activity-detail',
    component: () => import('../views/activity/ActivityDetail.vue')
  },
  {
    path: '/activity/new',
    name: 'activity-new',
    component: () => import('../views/activity/NewActivity.vue')
  },
  {
    path: '/activity/audit/:id?',
    name: 'activity-audit',
    component: () => import('../views/activity/AuditActivity.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
