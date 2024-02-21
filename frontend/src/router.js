import { createRouter, createWebHistory } from 'vue-router'
import { session } from './data/session'
import { userResource } from '@/data/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
  },
  {
    name: 'Login',
    path: '/account/login',
    component: () => import('@/pages/Login.vue'),
  },
  {
    name: 'NewSlot',
    path: '/NewSlot/:periodTime',
    component: () => import('@/pages/NewSlot.vue'),
    props: route => ({
      periodTime: route.params.periodTime,
      sendDate: route.query.sendDate,
      sendDoctor: route.query.sendDoctor,
    })
  },
  {
    name: 'AppointmentsPage',
    path: '/todayAppointments/:todayDate',
    component: () => import('@/pages/AppointmentsPage.vue'),
    props: true,
  },
]

let router = createRouter({
  history: createWebHistory('/frontend'),
  routes,
})

router.beforeEach(async (to, from, next) => {
  let isLoggedIn = session.isLoggedIn
  try {
    await userResource.promise
  } catch (error) {
    isLoggedIn = false
  }

  if (to.name === 'Login' && isLoggedIn) {
    next({ name: 'Home' })
  } else if (to.name !== 'Login' && !isLoggedIn) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
