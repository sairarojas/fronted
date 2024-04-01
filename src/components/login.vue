<script setup>
  import { ref } from "vue";
  import { useQuasar } from 'quasar'
  import { useRouter } from "vue-router";
  import { useUsuarioStore } from "../stores/usuario.js"
  import Cookies from 'js-cookie'


  const UsuarioStore = useUsuarioStore()
  const router = useRouter()
  
const data = ref({
  correo: "",
  contrasena: "",
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



  function validarCampos() {
  const arrData = Object.entries(data.value)
  for (const d of arrData) {
    if (d[1] === null) {
      notificar('negative', 'Por favor complete todos los campos')
      return
    }
    if(typeof d[1] === 'string'){if (d[1].trim() === "") {
      notificar('negative','Por favor complete todos los campos')
      return
    }}
  }

  validarIngreso()
}

async function validarIngreso() {
  try {
    console.log("Esperando confirmación...");
    loading.value = true;
    const response = await UsuarioStore.login(data.value);
    console.log(response);
  
    if(!response) return
    
    if (response.status != 200) {
      notificar('negative', response.mensaje)
      return;
    }
    notificar('positive', 'Sección exitosa')
    // Enviar la respuesta del servidor como parámetros de la URL al redirigir a la página de inicio
    router.push({ path: '/inicio'});
  } catch (error) {
    
  }finally{
    loading.value = false
  }
}




/*       if (validacion.value==true) {
          try {
            showDefault()
            const res = await loginStore.Login({
                cuenta: username.value,
                clave: password.value
            });
            console.log(res);
            localStorage.setItem('token', res.data.token)
            if(notification) {
                notification()
            }
            $q.notify({
                spinner: false, 
                message: "Ingresado al programa", 
                timeout: 2000,
                type: 'positive',
            });
        } catch (error) {
            if(notification) {
                notification()
            };
            $q.notify({
                spinner: false, 
                message: `${error.response.data.msg}`, 
                timeout: 2000,
                type: 'negative',
            });
        };
        }
        
        validacion.value = false   */




    function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top"
  })
}
    </script>




<template>
    <div class="cont">
        <div class="olascont">
            <img class="olaazul" src="../assets/olaazul.svg">
            <img class="olaverde" src="../assets/olaverde.svg">
        </div>
        <div class="q-pa-md row items-start q-gutter-md">
            <q-card class="my-card" >
                <q-card-section>
                    <q-div class="text-h3 text-bold">Bienvenido</q-div>
                    <p class="subtittle text-primary" >Por favor ingrese sus datos de usuario para continuar:</p>
                </q-card-section>
                <q-card-section style="max-width: 500px">
                    <q-input standout="bg-secondary text-white" v-model="data.correo" label="Correo electronico" />
                </q-card-section>
                <q-card-section style="max-width: 500px">
                    <q-input standout="bg-secondary text-white" v-model="data.contrasena" label="Contraseña" type="password"/>
                    <router-link to="/Restableciemiento" class="ingresarcont">
                        <button class="contrasenaayuda text-secondary">¿Olvidaste tu contraseña?</button>
                    </router-link>
                </q-card-section>
                    <q-card-section style="max-width: 500px">
                        <q-btn push color="secondary" label="Ingresar" @click="validarCampos" :loading="loading"/>
                    </q-card-section>
            </q-card>
        </div>
    </div>
</template>
    
    <!-- scoped sirve para evitar que los estilos afecte a los
    demas componentes  -->
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

    margin-bottom: 10px;
}


input::placeholder {
    color: rgb(255, 255, 255);
}


.contrasenaayuda {
    text-align: right;
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
    color:#29A19C /* !important */;
    text-decoration: underline;
    cursor: pointer;
    font-size: 14px;
}

.contrasenaayuda:hover {
  color: var(--q-color-accent);
}
/* .contrasenaayuda:hover {
    color: #29A19C;
} */
</style>