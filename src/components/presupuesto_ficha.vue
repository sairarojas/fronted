<template>
  <div>
    <q-dialog v-model="modal">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title>Agregar {{ modelo }}</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-input class="input1" outlined v-model="data.codigo_auxiliar" label="Codigo auxiliar ficha" type="number" maxlength="20"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese el codigo auxiliar']"></q-input>

          <q-input class="input1" outlined v-model="data.presupuesto" label="Valor" type="number" maxlength="15"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese el valor del presupuesto']"></q-input>

          <q-select outlined options-dense label="Distribucion de presupuesto" lazy-rules
            v-model="data.distribucion_presupuesto" :options="disPresupuesto.distribucion"
            :option-label="item => item.nombre ? 'Nombre: ' + item.nombre + ' Valor: ' + item.presupuesto_inicial : ''"
            :rules="[val => val.nombre !== '' || 'Seleccione el codigo auxiliar del lote']" />

          <q-select outlined options-dense label="ficha" v-model="data.ficha" :options="fichas"
            :option-label="item => item.nombre ? item.nombre + ' #' + item.codigo_ficha : ''"
            :rules="[val => val.nombre !== '' || 'Seleccione la ficha']" />

          <q-card-section class="q-gutter-md row items-end justify-end continputs1" style="margin-top: 0;">
            <q-btn @click="validarCampos" :loading="loadingmodal" padding="10px"
              :color="estado == 'editar' ? 'warning' : 'secondary'" :label="estado">
              <q-icon :name="estado == 'editar' ? 'edit' : 'style'" color="white" right />
            </q-btn>
            <q-btn :loading="loadingmodal" padding="10px" color="warning" label="cancelar" text-color="white"
              v-close-popup>
              <q-icon name="cancel" color="white" right />
            </q-btn>
          </q-card-section>

        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-pa-md">
      <q-table :rows="rows" :columns="columns" class="tabla" row-key="name" :loading="loadingTable" :filter="filter"
        rows-per-page-label="visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
        no-results-label="No hay resultados para la busqueda" wrap-cells="false">
        <template v-slot:top>
          <h4 class="titulo-cont">
            {{ modelo + ' ' }}
            <q-btn @click="opciones.agregar" label="Añadir" color="secondary" :loading="loadingficha">
              <q-icon name="style" color="white" right />
            </q-btn>
          </h4>
          <q-input borderless dense debounce="300" color="primary" v-model="filter" class="buscar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:header="props">
          <q-tr :props="props" class="text-center">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="encabezado">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body-cell-distribucion_presupuesto="props">
          <q-td :props="props" class="botones">
            <q-btn class="botonv1" size="12px" flat padding="10px" :loading="loadingpresupuesto"
              :label="props.row.distribucion_presupuesto.nombre" />
          </q-td>
        </template>

        <template v-slot:body-cell-ficha="props">
          <q-td :props="props" class="botones">
            <q-btn class="botonv1" size="12px" flat padding="10px" :loading="loadingficha"
              :label="props.row.ficha.nombre" />
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props" class="botones">
            <q-btn class="botonv1" text-size="1px" padding="10px" :label="props.row.status == 1
              ? 'Activo'
              : props.row.status == 0
                ? 'Inactivo'
                : '‎  ‎   ‎   ‎   ‎ '
              " :color="props.row.status == 1 ? 'primary' : 'secondary'" :loading="props.row.status == 'load'"
              loading-indicator-size="small" @click="
                props.row.status == 1
                  ? in_activar.putInactivar(props.row._id)
                  : in_activar.putActivar(props.row._id);
              props.row.status = 'load';
              " />
          </q-td>
        </template>

        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="warning" icon="edit" class="botonv1" @click="opciones.editar(props.row)"
              :loading="loadingficha" />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

 
<script setup>
import { onMounted, ref } from "vue";
import { useDisFichaStore } from "../stores/dis_ficha.js";
import { usedisPresupuesStore } from "../stores/dis_presupuesto.js";
import { useFichaStore } from "../stores/ficha.js";
import { useQuasar } from 'quasar'



const useDisFicha = useDisFichaStore();
const useDisPresupuesto = usedisPresupuesStore();
const useFicha = useFichaStore();


const modelo = "Presupuesto por fichas";
const loadingTable = ref(true)
const $q = useQuasar()
const filter = ref("");
const loadingmodal = ref(false);
const loadingpresupuesto = ref(true);
const loadingficha = ref(true);


const columns = ref([
  {
    name: "codigo_auxiliar",
    label: "Codigo Auxiliar Ficha",
    align: "left",
    field: (row) => row.codigo_auxiliar,
  },
  {
    name: "presupuesto",
    label: "Valor",
    align: "left",
    field: (row) => row.presupuesto,
    sort: true,
    sortOrder: "da",
  },
  {
    name: "distribucion_presupuesto",
    label: "Codigo auxiliar lote",
    align: "center",
    field: (row) => row.distribucion_presupuesto,
    loading: false

  },
  {
    name: "ficha",
    label: "Ficha",
    align: "center",
    field: (row) => row.ficha,
  },
  {
    name: "status",
    label: "Estado",
    align: "center",
    field: (row) => row.status,
  },
  {
    name: "opciones",
    label: "Opciones",
    align: "center",
    field: "opciones",
  },
]);
const rows = ref([]);

const data = ref({
  presupuesto: "",
  distribucion_presupuesto: {
    presupuesto_inicial: "",
    lote: { nombre: "" }
  },
  ficha: {
    nombre: "",
    codigo_ficha: ""
  }
});

onMounted(() => {
  obtenerInfo();
  console.log("inicio");
});

let disFichas
let disPresupuesto
let fichas


const obtenerInfo = async () => {
  try {
    disFichas = await useDisFicha.obtenerInfoDisFicha();

    if (!disFichas) return



    rowbuild()
  } catch (error) {
    console.error(error);
  }


  getdisPresupuesto()
  loadingTable.value = false

};
console.log("Antes de la línea 101");



const getdisPresupuesto = async () => {
  try {
    disPresupuesto = await useDisPresupuesto.obtenerInfodisPresupues();


    if (!disPresupuesto) return

    if (disPresupuesto.error) {
      notificar('negative', disPresupuesto.error)
      return
    }
  } catch (error) {
    notificar('negative', error.response.data.error)
    console.error(error);
  } finally {
    rowbuild()
    getficha()
    loadingpresupuesto.value = false
  }
};

const getficha = async () => {
  try {
    fichas = await useFicha.obtenerInfoFichas();


    if (!disPresupuesto) return

    if (disPresupuesto.error) {
      notificar('negative', disPresupuesto.error)
      return
    }

  } catch (error) {
    notificar('negative', error.response.data.error)
    console.error(error);
  } finally {
    rowbuild()
    loadingficha.value = false
  }
};


function rowbuild() {
  const distribucion_fichas = disFichas.distribucion

  if (disPresupuesto == undefined && fichas == undefined) {
    console.log('rows1:')


    const array = []
    for (let i = 0; i < distribucion_fichas.length; i++) {
      console.log(distribucion_fichas)

      array.push({
        _id: distribucion_fichas[i]._id,
        codigo_auxiliar: distribucion_fichas[i].codigo_auxiliar,
        presupuesto: distribucion_fichas[i].presupuesto,
        distribucion_presupuesto: {
          nombre: "",
          presupuesto_inicial: "",
          lote: { nombre: "" }
        },
        ficha: {
          nombre: "",
          codigo_ficha: ""
        },
        status: distribucion_fichas[i].status,
      })
    }
    rows.value = array
    return
  }

  const distribucion_presupuesto = disPresupuesto.distribucion || []

  if (fichas == undefined) {
    const array = []
    for (let i = 0; i < distribucion_fichas.length; i++) {
      console.log('segunda consulta')
      const indexdispresupuesto = distribucion_presupuesto.findIndex(objeto => objeto._id == distribucion_fichas[i].distribucion_presupuesto)

      let campo_dispresupuesto = {
        presupuesto_inicial: "",
        lote: { nombre: "" }
      }
      if (indexdispresupuesto !== -1) {
        campo_dispresupuesto = distribucion_presupuesto[indexdispresupuesto]
      } else {
        notificar('negative', 'Ficha inexistente')
      }

      array.push({
        _id: distribucion_fichas[i]._id,
        codigo_auxiliar: distribucion_fichas[i].codigo_auxiliar,
        presupuesto: distribucion_fichas[i].presupuesto,
        distribucion_presupuesto: campo_dispresupuesto,
        ficha: {
          nombre: "",
          codigo_ficha: ""
        },
        status: distribucion_fichas[i].status,
      })

    }

    console.log('rows2:')
    console.log(distribucion_presupuesto)
    rows.value = array
    return
  }
  const fichasdatos = fichas || []


  if (true) {
    const array = []
    for (let i = 0; i < distribucion_fichas.length; i++) {
      console.log("tercera consulta")

      const indexdispresupuesto = distribucion_presupuesto.findIndex(objeto => objeto._id == distribucion_fichas[i].distribucion_presupuesto)
      const indexficha = fichasdatos.findIndex(objeto => objeto._id == distribucion_fichas[i].ficha)
      let campo_dispresupuesto = {
        presupuesto_inicial: "",
        lote: { nombre: "" }
      }
      let campo_ficha = {
        nombre: "",
        codigo_ficha: ""
      }

      if (indexdispresupuesto !== -1) {
        campo_dispresupuesto = distribucion_presupuesto[indexdispresupuesto]
      } else {
        notificar('negative', 'Distribucion de presupuesto inexistente')
      }


      if (indexficha !== -1) {
        campo_ficha = fichasdatos[indexficha]
      } else {
        notificar('negative', 'Distribucion de presupuesto inexistente')
      }

      array.push({
        _id: distribucion_fichas[i]._id,
        codigo_auxiliar: distribucion_fichas[i].codigo_auxiliar,
        presupuesto: distribucion_fichas[i].presupuesto,
        distribucion_presupuesto: campo_dispresupuesto,
        ficha: campo_ficha,
        status: distribucion_fichas[i].status,
      })

    }
    rows.value = array
    console.log('TERMINOOOOO')
    return
  }
}

const estado = ref("guardar");
const modal = ref(false);
const opciones = {
  agregar: () => {
    data.value = {
      codigo_auxiliar: "",
      presupuesto: "",
      distribucion_presupuesto: {
        nombre: "",
        presupuesto_inicial: "",
        lote: { nombre: "" }
      },
      ficha: {
        nombre: "",
        codigo_ficha: ""
      }
    };
    modal.value = true;
    estado.value = "guardar";
  },
  editar: (info) => {
    data.value = { ...info }
    modal.value = true;
    estado.value = "editar";
  },
};

function buscarIndexLocal(id) {
  return rows.value.findIndex((r) => r._id === id);
}

const enviarInfo = {
  guardar: async () => {
    loadingmodal.value = true;
    try {
      const response = await useDisFicha.postDisFicha(data.value);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      }
      const responseDatos = response.data.distribucion
      responseDatos.distribucion_presupuesto = data.value.distribucion_presupuesto
      responseDatos.ficha = data.value.ficha

      rows.value.unshift(responseDatos);

      loadingmodal.value = false;
      modal.value = false
    } catch (error) {
      console.log(error);
    } finally {
    }
  },
  editar: async () => {
    loadingmodal.value = true;
    try {
      const response = await useDisFicha.putDisFicha(data.value._id, data.value);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.response.data.error)
        return
      }
      console.log(rows.value);
      rows.value[buscarIndexLocal(response.data.distribucion._id)] = data.value;
      notificar('positive', 'Editado exitosamente')
      loadingmodal.value = false;
      modal.value = false
    } catch (error) {
      console.log(error);
    } finally {
    }
  },
};

const in_activar = {
  putActivar: async (id) => {
    try {
      const response = await useDisFicha.putActivar(id);
      console.log("Activando");
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.data.error)
        loadingmodal.value = false
        return
      }

      console.log(response.data.distribucion._id)
      rows.value[buscarIndexLocal(response.data.distribucion._id)].status = response.data.distribucion.status;
      notificar('positive', 'Activado, exitosamente')
    } catch (error) {
      console.log(error);
      notificar('negative', error)
    } finally {
      loadingmodal.value = false;
    }
  },
  putInactivar: async (id) => {
    try {
      const response = await useDisFicha.putInactivar(id);
      console.log("Activando");
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.data.error)
        loadingmodal.value = false
        return
      }

      console.log(response.data.distribucion._id)
      rows.value[buscarIndexLocal(response.data.distribucion._id)].status = response.data.distribucion.status;
      notificar('positive', 'Inactivado exitosamente')
    } catch (error) {
      console.log(error);
      notificar('negative', error)
    } finally {
      loadingmodal.value = false;
    }
  },
};

function validarCampos() {
  const arrData = Object.entries(data.value)
  for (const d of arrData) {
    console.log(d);
    if (d[1] === null) {
      notificar('negative', "Por favor complete todos los campos")
      return
    }
    if (typeof d[1] === 'string') {
      if (d[1].trim() === "") {
        notificar('negative', "Por favor complete todos los campos")
        return
      }
    }
    if (typeof d[1] === 'object') {
      if (d[1].nombre.trim() === "") {
        notificar('negative', "Por favor complete todos los campos")
        return
      }
    }
    if (d[0] === "presupuesto" && d[1] < 1) {
      notificar('negative', "El presupuesto debe ser diferente a 0")
      return
    }
    console.log('paso la prueba')
  }
  enviarInfo[estado.value]()
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
/* 
primary: Color principal del tema.
secondary: Color secundario del tema.
accent: Color de acento.
positive: Color para indicar una acción positiva o éxito.
negative: Color para indicar una acción negativa o error.
info: Color para información o mensajes neutrales.
warning: Color para advertencias o mensajes importantes. 
*/

* {
  margin: 0px;
  padding: 0px;
}

.modal {
  width: 100%;
  max-width: 600px;
}

.tabla {
  padding: 0 20px;
  margin: 10px auto;
  max-width: 1200px;
  /* min-height: 710px; */
  border: 0px solid black;
}

.titulo-cont {
  margin: auto;
}

.buscar {
  display: inline-block;
  margin: auto;
  margin-top: 8px;
  padding: 0px 15px;
  border: 1px solid rgb(212, 212, 212);
  border-radius: 5px;
}

.encabezado {
  font-weight: bold;
  font-size: 15px;
}

.botonv1 {
  font-size: 10px;
  font-weight: bold;
}

.botonv1 {
  font-size: 10px;
  font-weight: bold;
}
</style>