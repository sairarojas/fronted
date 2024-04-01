<template>
  <div>
    <q-dialog v-model="modal">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title>Agregar {{ modelo }}</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-input class="input1" outlined v-model="data.codigo_presupuestal" label="Codigo presupuestal" type="number"
            maxlength="15" lazy-rules :rules="[val => val.trim() != '' || 'Ingrese el codigo presupuestal']"></q-input>
          <q-input class="input1" outlined v-model="data.presupuesto_inicial" label="Presupuesto inicial" type="number"
            maxlength="15" lazy-rules :rules="[val => val.trim() != '' || 'Ingrese el presupuesto inicial']"></q-input>
          <q-input class="input1" outlined v-model="data.ano" label="Año" type="number" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese el año']"></q-input>
          <q-select class="input1" outlined v-model="data.lote" :options="options" label="Lotes" type="number"
            maxlength="30" lazy-rules :rules="[val => val != '' || 'Seleccione el lote']" />
          <q-select class="input1" outlined v-model="data.items" :options="itemsPre" label="Items presupuesto" type="number"
            maxlength="30" lazy-rules :rules="[val => val != '' || 'Seleccione el item de presupuesto']" />
          <q-btn @click="validarCampos" :loading="loadingmodal" padding="10px"
            :color="estado == 'editar' ? 'warning' : 'secondary'" :label="estado">
            <q-icon :name="estado == 'editar' ? 'edit' : 'style'" color="white" right />
          </q-btn>
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
            <q-btn @click="opciones.agregar" label="Añadir" color="secondary">
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
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="encabezado">
              {{ col.label }}
            </q-th>
          </q-tr>
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
            <q-btn color="warning" icon="edit" class="botonv1" @click="opciones.editar(props.row)" />
            <router-link to="/Presupuesto_de_ficha" class="ingresarcont">
              <q-btn color="secondary" icon="zoom_in" class="botonv1" />
            </router-link>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { usedisPresupuesStore } from "../stores/dis_presupuesto.js";
import { useQuasar } from 'quasar'
import { useLoteStore } from "../stores/lotes.js";
import { usePresupStore } from "../stores/presupuesto.js"

const modelo = "Presupuesto por lotes";
const useDisPresupuesto = usedisPresupuesStore();
const useLote = useLoteStore();
const usePresupes = usePresupStore();
const loadingTable = ref(true);
const $q = useQuasar();
const filter = ref("");
const loadingmodal = ref(false);

const columns = ref([
  {
    name: "codigo_presupuestal",
    label: "Codigo Auxiliar Lote",
    align: "left",
    field: (row) => row.codigo_presupuestal,
  },
  {
    name: "presupuesto_inicial",
    label: "Valor",
    align: "left",
    field: (row) => row.presupuesto_inicial,
  },
  {
    name: "ano",
    label: "Año",
    align: "left",
    field: (row) => row.ano,
  },
  {
    name: "lote",
    label: "lote",
    align: "left",
    field: (row) => row.lote.nombre,
  },
  {
    name: "items",
    label: "Codigo presupuestal",
    align: "left",
    field: (row) => row.items.codigo_presupuesto,
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
    field: "opciones",
  },
]);
const rows = ref([]);
let options = ref([]);
let itemsPre = ref([]);

const data = ref({
  codigo_presupuestal: "",
  presupuesto_inicial: "",
  ano: "",
  lote: "",
  items: "",
});

function sortBy(array, key) {
  return array.sort((a, b) => (a[key] > b[key] ? 1 : -1));
}

async function obtenerLotes() {
  try {
    const distribucion = await useLote.obtenerInfoLotes();
    const LotesAct = distribucion.filter(lote => lote.status === "1")
    console.log("distribucion", distribucion);
    console.log("lotes activos", LotesAct);
    options.value = LotesAct.map((lote) => ({
      label: `${lote.nombre}`,
      value: String(lote._id),
    }));
    sortBy(options.value, 'label');
    console.log("options", options);
  } catch (error) {
    console.log(error);
  }
}

async function obtenerPresupuestos() {
  try {
    const presupuestos = await usePresupes.obtenerInfoPresup();
    const PeresuAct = presupuestos.filter(lote => lote.status === "1")
    console.log("presupueto activo", PeresuAct);
    itemsPre.value = PeresuAct.map((items) => ({
      label: `${items.codigo_presupuesto}`,
      value: String(items._id),
      codigo_presupuesto: items.codigo_presupuesto,
    }));
    sortBy(itemsPre.value, 'label');
    console.log("presupuestos items", itemsPre);
  } catch (error) {
    console.log(error);
  }
}

const obtenerInfo = async () => {
  try {
    const disPresupuesto = await useDisPresupuesto.obtenerInfodisPresupues();
    console.log("useDisPresupuesto")
    console.log(useDisPresupuesto)
    console.log("dentro")
    console.log(disPresupuesto);

    if (!disPresupuesto) return

    if (disPresupuesto.error) {
      notificar('negative', disPresupuesto.error)
      return
    }
    rows.value = disPresupuesto.distribucion
    console.log("datos tabla", rows.value);

  } catch (error) {
    console.error(error);
  } finally {
    loadingTable.value = false
  }
};


  obtenerInfo();


const estado = ref("guardar");
const modal = ref(false);
const opciones = {
  agregar: () => {
    obtenerPresupuestos()
    obtenerLotes();
    data.value = {
      codigo_presupuestal: "",
      presupuesto_inicial: "",
      ano: "",
      lote: "",
      items: "",
    };
    modal.value = true;
    estado.value = "guardar";
  },
  editar: (info) => {
    obtenerPresupuestos()
    obtenerLotes();
    data.value = { ...info }
    if(data.value.lote){
      data.value.lote = { label: info.lote.nombre, value: info.lote._id}
    }
    if(data.value.items){
      data.value.items = { label: info.items.codigo_presupuesto, value: info.items._id}
    }
    modal.value = true;
    estado.value = "editar";
  },
};

function buscarIndexLocal(id) {
  return rows.value.findIndex((r) => r._id === id);
}

const enviarInfo = {
  guardar: async () => {
    console.log("data guardar", data);
    loadingmodal.value = true;
    try {
      const info = {...data.value, lote:data.value.lote.value, items: data.value.items.value}
      const response = await useDisPresupuesto.postDisPresupuesto(info);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error.errors[0].msg)
        loadingmodal.value = false;
        return
      }

      rows.value.unshift(response);
      notificar('positive', 'Guardado exitosamente')
      modal.value = false;
    } catch (error) {
      console.log(error);
    } finally {
      loadingmodal.value = false;
    }
  },
  editar: async () => {
    loadingmodal.value = true;
    try {
      const info = {...data.value, lote:data.value.lote.value, items: data.value.items.value}//esto
      console.log("info", data.items);
      const response = await useDisPresupuesto.putDisPresupuesto(data.value._id, info);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error.errors[0].msg)
        loadingmodal.value = false;
        return
      }
      console.log(rows.value);
      rows.value.splice(buscarIndexLocal(response.data.distribucion_id), 1, response.data.distribucion);
      notificar('positive', 'Editado exitosamente')
      modal.value = false;
    } catch (error) {
      console.log(error);
    } finally {
      loadingmodal.value = false;
    }
  },
};

const in_activar = {
  putActivar: async (id) => {
    try {
      const response = await useDisPresupuesto.putActivar(id);
      console.log(response);
      console.log("Activando");
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      }
      rows.value.splice(buscarIndexLocal(response.data.distribucion._id), 1, response.data.distribucion);
      notificar('positive', 'Activado, exitosamente')
    } catch (error) {
      console.log(error);
    } finally {
      loadingmodal.value = false;
    }
  },
  putInactivar: async (id) => {
    console.log("inactivar");
    try {
      const response = await useDisPresupuesto.putInactivar(id);
      console.log("Desactivar");
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)

        return
      }
      rows.value.splice(buscarIndexLocal(response.data.distribucion._id), 1, response.data.distribucion);
      notificar('negative', 'Inactivado exitosamente')
    } catch (error) {
      console.log(error);
    } finally {
      loadingmodal.value = false;
    }

  },
};

function validarCampos() {

  const arrData = Object.entries(data.value)
  console.log(arrData);
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

    if (d[0] === "codigo_presupuestal" && d[1].toString().length < 6) {
      notificar('negative', "El codigo debe tener más de 6 digitos")
      return
    }

    if (d[0] === "presupuesto_inicial") {
      const presupuesto = parseFloat(d[1]);
      if (isNaN(presupuesto) || presupuesto <= 0) {
        notificar('negative', "El presupuesto inicial debe ser mayor que cero");
        return;
      }
    }

    if (d[0] === "año" && d[1].length !== 4) {
      notificar('negative', 'El año tiene que tener 4 caracteres')
      return
    }

    if (d[0] === "lote" && d[1].toString().length < 1) {
      notificar('negative', "El lote es obligatorio")
      return
    }
    if (d[0] === "items" && d[1].toString().length < 1) {
      notificar('negative', "El items es obligatorio")
      return
    }
  }

  enviarInfo[estado.value]()
  data.value = {
  ...data.value,
  lote: data.value.lote.value._id,
  items: data.value.items.value._id
};
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