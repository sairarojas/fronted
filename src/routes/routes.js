import Login from "../components/login.vue" 
import Menu from "../components/menu.vue"

import inicio from "../components/inicio.vue"
import presupuesto from '../components/presupuesto.vue'
import Lotes from "../components/lotes.vue"
import Fichas from '../components/ficha.vue'
import Areas from '../components/area.vue'
import Pedidos from '../components/Pedidos.vue'
import Productos from '../components/producto.vue'
import contraseña from '../components/res_clave.vue'
import Dis_presupuesto from '../components/dis_presupuesto.vue'
import Det_pedido from '../components/det_pedido.vue'
import presupuesto_ficha from '../components/presupuesto_ficha.vue'
import Usuario from '../components/usuario.vue'
import Entradas from '../components/entradas.vue'
import Requerimiento from '../components/Requerimiento.vue'



import {createRouter, createWebHashHistory} from 'vue-router'
import { useUsuarioStore } from "../stores/usuario.js"
/* const UsuarioStore = useUsuarioStore() */
import { Cookies } from "quasar"


const auth = (to, from, next) => {
  console.log('verificar ruta')
  if (checkAuth()) {
    const UsuarioStore = useUsuarioStore()
      const rol = UsuarioStore.sesion.usuarios.rol
      console.log('rol:',rol)
      if (!to.meta.rol.includes(rol)) {
          return next({ path: '/' })
      }
      next()
  } else {
      return next({ path: '/' })
  }
}

const checkAuth = () => {
  const UsuarioStore = useUsuarioStore()

  const token = UsuarioStore.sesion.token
  console.log(token)

  if (!token) return false
  console.log(token)
  return true
};


const routes = [
    {path: "/",component: Login,},
    {path: "/Restableciemiento",component: contraseña,},
    {path: "/menu",component: Menu, 
      children: [
        { path: "/", redirect: "/menu/inicio" },
        { path: "/inicio", component: inicio, beforeEnter: auth , meta: { rol: ['Administrador','Instructor']}},
        {path: '/Presupuesto', component:presupuesto, beforeEnter: auth , meta: { rol: ['Administrador','Instructor']}},
        {path: '/Fichas', component:Fichas, beforeEnter: auth , meta: { rol: ['Administrador','Instructor']}},
        {path: '/Lotes', component:Lotes, beforeEnter: auth , meta: { rol: ['Administrador','Instructor']}},
        {path: '/Areas', component:Areas, beforeEnter: auth , meta: { rol: ['Administrador','Instructor']}},
        {path: '/Pedidos', component:Pedidos, beforeEnter: auth , meta: { rol: ['Administrador','Instructor']}},
        {path: '/Productos', component:Productos, beforeEnter: auth , meta: { rol: ['Administrador','Instructor']}},
        {path: '/Dis_presupuesto', component:Dis_presupuesto, beforeEnter: auth , meta: { rol: ['Administrador','Instructor']}},
        {path: '/Det_pedido', component:Det_pedido, beforeEnter: auth , meta: { rol: ['Administrador','Instructor']}},
        {path: '/Presupuesto_de_ficha', component:presupuesto_ficha, beforeEnter: auth , meta: { rol: ['Administrador','Instructor']}},
        {path: '/Usuario', component:Usuario, beforeEnter: auth , meta: { rol: ['Administrador', ]}},
        {path: '/entradas', component:Entradas, beforeEnter: auth , meta: { rol: ['Administrador','Instructor']}},
        {path: '/Requerimiento', component:Requerimiento, beforeEnter: auth , meta: { rol: ['Administrador','Instructor']}},
      ],
    }
]

export const router = createRouter({
    history:createWebHashHistory(),
    routes
})

