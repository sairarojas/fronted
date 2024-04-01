<template>
  <div class="cont">
    <div class="olascont">
      <img class="olaazul" src="../assets/olaazul.svg">
      <img class="olaverde" src="../assets/olaverde.svg">
    </div>
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card">
        <q-card-section>
          <q-div class="text-h3">Restablecer Contraseña</q-div>
          <p class="subtittle">Por favor digite su correo y asigne una nueva contraseña</p>
        </q-card-section>
        <q-card-section style="max-width: 500px">
          <q-input standout="bg-secondary text-white" v-model="data.correo" label="Correo electronico" />
        </q-card-section>
        <q-card-section style="max-width: 500px">
          <q-input standout="bg-secondary text-white" v-model="data.contrasena" label="Nueva Contraseña" type="password"/>
        </q-card-section>
        <q-card-section style="max-width: 500px">
          <q-input standout="bg-secondary text-white" v-model="data.contrasena2" label="Confirmar Contraseña" type="password"/>
        </q-card-section>
        <q-card-section style="max-width: 500px">
          <q-btn push color="primary" label="RESTABLECER" @click="cambiar" :loading="loading"/>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script setup>
  import { ref } from "vue";
  import { useQuasar } from 'quasar'
  import { useRouter } from "vue-router";
  import { useUsuarioStore } from "../stores/usuario.js"
  import Cookies from 'js-cookie'

  const UsuarioStore = useUsuarioStore()
  const router = useRouter()

  const data = ref({
    contrasena: "",
    contrasena2: "",
  });

  const $q = useQuasar();
  let errorMessage = ref("");

  const showDefault = () => {
    notification = $q.notify({
      spinner: true,
      message: 'Please wait...',
      timeout: 0
    });
  };

  let validacion = ref(false);
  let notification = ref(null);
  let loading = ref(false)

  function cambiar() {
    const arrData = Object.entries(data.value)
    console.log(arrData);
    for (const d of arrData) {
      console.log(d);
      if (d[1] === null) {
        notificar('negative', 'Por favor complete todos los campos')
        return
      }
      if(typeof d[1] === 'string'){if (d[1].trim() === "") {
        console.log("h");
        notificar('negative','Por favor complete todos los campos')
        return
      }}
    }

    if(data.value.contrasena !== data.value.contrasena2){
      notificar('negative', 'Las contraseñas no coinciden')
      return
    }

    restablecerContrasena()
  }

  async function restablecerContrasena() {
    try {
      console.log("Esperando confirmación...");
      loading.value = true;
      const response = await UsuarioStore.restablecerContrasena(data.value);
      console.log(response);

      if(!response) return

      if (response.status != 200) {
        notificar('negative', response.mensaje)
        return;
      }
      notificar('positive', 'Sección exitosa')
      router.push("/home");
    } catch (error) {
      console.log(error);
  }
}
function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top"
  })
}
    </script>

  <style scoped>
  .paleta {
    background-color:
      #3F497F #29A19C #A3F7BF;
  }
  
  * {
    margin: 0;
    padding: 0;
  }
  .my-card{
    background-color: accent;
    transform: translate(0px, -50px);
}

.cont {
    display: flex;
    justify-content: center;
    height: 100vh;
    align-items: center;
}

.olascont {
    flex: 1;
}
.subtittle {
    font-size: 20px;
    font-weight: bold;
    color: #3F497F;
    margin-bottom: 10px;
}


input::placeholder {
    color: rgb(255, 255, 255);
}


.contrasenaayuda {
    text-align: right;
    color: #29A19C;
    font-weight: 700;
    text-decoration-line: underline;
    margin: 10px 0px;
}

.olascont {
    user-select: none;
    z-index: -1;
    Overflow: hidden;
    position: fixed;
    height: 100vh;
    width: 100vw;
    bottom: 0;
    right: 50%;
    transform: translate(50%, 0);
}

@media only screen and (min-width: 1200px) {
    .olascont{
        bottom: -2vw;
    }
}

.olaverde,
.olaazul {
    position: absolute;
    width: 100vw;
    min-width: 980px;
    bottom: 0;
    right: 50%;
    transform: translate(50%, 0);
}


.contrasenaayuda {
    background-color: transparent;
    border: none;
    color: #29A19C;
    text-decoration: underline;
    cursor: pointer;
    font-size: 14px;
}

.contrasenaayuda:hover {
    color: #3F497F;
}
  </style>