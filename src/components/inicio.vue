<template>
  <q-card-section
    class="q-gutter-md row items-center justify-center aling tarjetascont"
  >
    <router-link
      v-for="(item, index) in content[rol]"
      :key="index"
      :to="item.ruta"
      class="link-card"
    >
      <q-btn
        color="secondary"
        class="tarjetasbtn text-weight-bold text-h6 justify-center"
      >
        <span class="tarjetastxt">{{ item.titulo }}</span>

        <div class="card__content" :class="item.titulo + 'btn'">
          <img
            :src="item.img"
            alt=""
            :class="item.titulo + 'img'"
            class="img"
          />
        </div>
      </q-btn>
    </router-link>
  </q-card-section>
</template>

<script setup>
import { ref } from "vue";
import presupuesto from "../assets/presupuesto.png";
import fichas2 from "../assets/fichas2.png";
import lotes from "../assets/lotes.png";
import areas from "../assets/areas.png";
import pedido from "../assets/pedido.png";
import producto from "../assets/producto.png";
import usuario from "../assets/usuario.png";
import { Cookies } from "quasar";

const rol = Cookies.get('rol')
let content = ref({
  Administrador: [
    { ruta: "/Presupuesto", titulo: "Presupuesto", img: presupuesto },
    { ruta: "/Fichas", titulo: "Fichas", img: fichas2 },
    { ruta: "/Lotes", titulo: "Lotes", img: lotes },
    { ruta: "/Areas", titulo: "Areas", img: areas },
    { ruta: "/Pedidos", titulo: "Pedido", img: pedido },
    { ruta: "/Productos", titulo: "Producto", img: producto },
    { ruta: "/Usuario", titulo: "Usuarios", img: usuario },
  ],
  Instructor: [
  { ruta: "/Presupuesto", titulo: "Presupuesto", img: presupuesto },
    { ruta: "/Fichas", titulo: "Fichas", img: fichas2 },
    { ruta: "/Lotes", titulo: "Lotes", img: lotes },
    { ruta: "/Areas", titulo: "Areas", img: areas },
    { ruta: "/Pedidos", titulo: "Pedido", img: pedido },
    { ruta: "/Productos", titulo: "Producto", img: producto },
  ],
  Bodega: [
  { ruta: "/Presupuesto", titulo: "Presupuesto", img: presupuesto },
    { ruta: "/Fichas", titulo: "Fichas", img: fichas2 },
    { ruta: "/Lotes", titulo: "Lotes", img: lotes },
    { ruta: "/Areas", titulo: "Areas", img: areas },
    { ruta: "/Pedidos", titulo: "Pedido", img: pedido },
    { ruta: "/Productos", titulo: "Producto", img: producto },
  ],
});
</script>

<style>
* {
  text-decoration: none;
}
.tarjetascont {
  min-height: 60vh;
}

.img {
  margin: 10px;
  height: 150px;
}

.tarjetasbtn {
  margin: 15px;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.144);
  width: 80vw !important;
  max-width: 400px;
}

.tarjetastxt {
  width: 50%;
}

.tools {
  display: flex;
  align-items: center;
  padding: 5px;
}

.line {
  width: 30px;
  height: 3px;
  background-color: #29a19c;
  margin: 5px;
}
</style>
