<template>
  <div class="cont">
    <div class="olascont">
      <img class="olaazul" src="../assets/olaazul.svg">
      <img class="olaverde" src="../assets/olaverde.svg">
    </div>
    <div class="opcioncont">
      <p class="tittle">Bienvenido</p>
      <p class="subtittle">Por favor ingrese sus datos de usuario para continuar, ¡te esperamos!</p>

      <input class="input opcion" type="text" placeholder="Nombre de usuario">
      <div class="contrasenacont">
        <input class="input opcion" type="text" placeholder="Contraseña">
        <router-link to="/Restableciemiento" class="ingresarcont">
          <button class="contrasenaayuda">¿Olvidaste tu contraseña?</button>
        </router-link>

      </div>
      <router-link to="/home" class="ingresarcont">
        <button class="ingresar opcion">Ingresar</button>
      </router-link>
    </div>
  </div>
</template>
<!-- <script setup>
import { ref } from "vue";
import { useLoginStore } from "../stores/login.js"
import { useQuasar } from 'quasar'
const loginStore = useLoginStore()

const username = ref('');
const password = ref('');
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
async function validar() {
    if (!username.value && !password.value) {
        errorMessage.value = "* Ingrese el usuario y la contraseña"
    }else if(!username.value){
        errorMessage.value = "* Ingrese el usuario"
    }else if(!password.value){
        errorMessage.value = "* Ingrese la contraseña"
    }else{
        errorMessage.value =""
        validacion.value = true;
};
    if (validacion.value==true) {
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
      
      validacion.value = false  
  };
  </script> -->
  
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




.cont {
  display: flex;
  justify-content: center;
  height: 100vh;
}

.olascont {
  flex: 1;
}

.opcioncont {
  flex: 1;
  text-align: center;
}

.tittle {
  margin-top: 20px;
  font-size: 100px;
  font-weight: 700;
  color: #3F497F;
}



.subtittle {
  font-size: 20px;
  font-weight: bold;
  color: #3F497F;
  margin-bottom: 10px;
}



.opcion {
  width: 95vw;
  max-width: 525px;
}

.input {
  background-color: #29A19C;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  text-align: left;
  padding: 15px 30px;
  margin-top: 70px;
}



input::placeholder {
  color: rgb(255, 255, 255);
}

.input:focus {
  outline: solid #A3F7BF;
}

.contrasenacont {
  width: min-content;
  margin: auto;
}

.contrasenaayuda {
  text-align: right;
  color: #29A19C;
  font-weight: 700;
  text-decoration-line: underline;
  margin: 10px 0px;
}


.ingresar {
  font-size: 30px;
  font-weight: 700;
  padding: 10px 100px;
  background-color: #3F497F;
  color: white;
  border-radius: 20px;
  margin: 50px 0px;
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

.olaverde,
.olaazul {
  position: absolute;
  width: 100vw;
  min-width: 1280px;
  bottom: 0;
  right: 50%;
  transform: translate(50%, 0);
}


@media screen and (min-height: 850px) {
  .opcioncont {
    margin-top: 5vh;
  }
}

@media screen and (max-width: 640px) {
  .tittle {
    font-size: 80px;
    font-weight: 700;
  }
}

@media screen and (max-width: 500px) {
  .tittle {
    font-size: 55px;
    font-weight: 700;
  }

  .subtittle,
  .input,
  .contrasenaayuda {
    font-size: 17px;
  }

  .ingresar {
    font-size: 20px;
  }
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