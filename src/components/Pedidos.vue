<script setup>
import { ref } from "vue";
import { usePedidoStore } from "../stores/pedido.js";
import { useFichaStore } from "../stores/ficha.js";
import { useQuasar } from 'quasar'

const modelo = "Pedidos";
const usePedido = usePedidoStore();
const useFicha = useFichaStore();
const loadingTable = ref(true)
const $q = useQuasar()
const filter = ref("");
const loadingmodal = ref(false);

/* const columns = ref([
  { name: 'fecha_creacion', align: 'center', label: 'Fecha creacion', field: 'fecha creacion'},
  { name: 'fecha_entrega', align: 'center', label: 'Fecha entrega', field: 'fecha entrega'},
  { name: 'ficha',align: 'center',  label: 'Ficha', field: 'ficha' },
  { name: 'instructor_encargado',align: 'center',  label: 'Instructor encargado', field: 'instructor encargado' },
  { name: 'subtotal',align: 'center',  label: 'Subtotal', field: 'subtotal' },
  { name: 'total',align: 'center',  label: 'Total', field: 'total' },
  { name: 'impuestos',align: 'center',  label: 'Impuestos', field: 'Impuestos' },
  { name: 'Items',align: 'center',  label: 'Items', field: 'items' },
  { name: 'Estado',align: 'center',  label: 'Estado', field: 'status' },
]); */
const columns = ref([
  {
    name: "fecha_creacion",
    label: "Fecha creacion",
    align: "left",
    field: (row) => row.fecha_creacion,
    sort: true,
    sortOrder: "da",
  },
  {
    name: "id_requerimiento",
    label: "Requerimiento",
    align: "left",
    field: (row) => row.id_requerimiento,
  },
  {
    name: "id_producto",
    label: "Producto",
    align: "left",
    field: (row) => row.id_producto,
  },
  {
    name: "cantidad",
    label: "Cantidad",
    align: "left",
    field: (row) => row.cantidad,
  },
  {
    name: "valor_unitario",
    label: "Valor Unitario",
    align: "center",
    field: (row) => row.valor_unitario,
  },
  {
    name: "subtotal",
    label: "Subtotal",
    align: "center",
    field: (row) => row.subtotal,
  },
  {
    name: "opciones",
    label: "Opciones",
    field: "opciones",
  },
]);

const rows = ref([]);

const data = ref({
  fecha_creacion: "",
  fecha_entrega: "",
  ficha: "",
  instructor_encargado: "",
});

/* const preciototal = data.cantidad * data.precioporunidad; */

const obtenerInfo = async () => {
  try {
    const pedidos = await usePedido.obtenerInfoPedido();

    console.log(pedidos);

    if (!pedidos) return

    if (pedidos.error) {
      notificar('negative', pedidos.error)
      return
    }
    rows.value = pedidos;

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
    data.value = {
      fecha_creacion: "",
      fecha_entrega: "",
      ficha: "",
      subtotal: "",
      total: "",
      impuestos: "",

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
      const response = await useCliente.guardar(data.value);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        loadingmodal.value = false;
        return
      }

      rows.value.unshift(response.cliente);
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
      const response = await useCliente.editar(data.value._id, data.value);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        loadingmodal.value = false;
        return
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response);
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
  activar: async (id) => {
    try {
      const response = await useCliente.activar(id);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response);
    } catch (error) {
      console.log(error);
    } finally {
      loadingmodal.value = false;
    }
  },
  inactivar: async (id) => {
    try {
      const response = await useCliente.inactivar(id);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)

        return
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response);
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

    if (d[0] === "fecha_creacion" && d[1].toString().length < 1) {
      notificar('negative', "La fecha de creacion es obligatoria")
      return
    }
    if (d[0] === "fecha_entrega" && d[1].toString().length < 1) {
      notificar('negative', "La fecha de entrega es obligatoria")
      return
    }
    if (d[0] === "subtotal" && d[1].toString().length < 1) {
      notificar('negative', "El subtotal es obligatorio")
      return
    }
    if (d[0] === "total" && d[1].toString().length < 1) {
      notificar('negative', "El subtotal es obligatorio")
      return
    }

    if (d[0] === "cedula" && d[1].toString().length < 8) {
      notificar('negative', "La cedula debe tener más de 8 digitos")
      return
    }

    if (d[0] === "email" && !d[1].includes('@')) {
      notificar('negative', 'Email no válido')
      return
    }
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

function prompt() {
  $q.dialog({
    title: 'Prompt',
    message: 'What is your name?',
    prompt: {
      model: '',
      type: 'text' // optional
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    // console.log('>>>> OK, received', data)
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}
</script>

<template>
  <div>
    <q-dialog v-model="modal" persistent color="primary">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title> Agregar {{ modelo }}</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />

        </q-toolbar>
        <!-- inputs🃏☝ -->

        <!-- btns 🛑👇 -->
        <q-card-section class="q-gutter-md row items-end justify-end continputs1">
          <q-btn @click="validarCampos" :loading="loadingmodal" padding="10px" color="secondary" label="guardar">
            <q-icon name="style" color="white" right />
          </q-btn>

          <q-btn :loading="loadingmodal" padding="10px" color="secondary" label="imprimir">
            <q-icon name="print" color="white" right />
          </q-btn>

          <q-btn :loading="loadingmodal" padding="10px" color="warning" label="cancelar" text-color="white" v-close-popup>
            <q-icon name="cancel" color="white" right />
          </q-btn>

        </q-card-section>
        <!-- btns 🛑☝ -->
      </q-card>
    </q-dialog>

    <div class="q-pa-md">
      <q-table :rows="rows" :columns="columns" class="tabla" row-key="name" :loading="loadingTable" :filter="filter"
        rows-per-page-label="visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
        no-results-label="No hay resultados para la busqueda" wrap-cells="false">
        <template v-slot:top>
          <h4 class="titulo-cont">
            {{ modelo + ' ' }}
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

        <template v-slot:body-cell-Estado="props">
          <q-td :props="props" class="botones">
            <q-btn class="botonv1" text-size="1px" padding="10px" :label="props.row.estado === 1
              ? 'Activo'
              : props.row.estado === 0
                ? 'Inactivo'
                : '‎  ‎   ‎   ‎   ‎ '
              " :color="props.row.estado === 1 ? 'positive' : 'accent'" :loading="props.row.estado === 'load'"
              loading-indicator-size="small" @click="
                props.row.estado === 1
                  ? in_activar.inactivar(props.row._id)
                  : in_activar.activar(props.row._id);
              props.row.estado = 'load';
              " />
          </q-td>
        </template>

        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="warning" icon="zoom_in" class="botonv1" @click="opciones.editar(props.row)" />
          </q-td>
        </template>
      
      </q-table>

      <q-card-section class="q-gutter-md row items-end justify-end continputs1">
          <q-btn @click="validarCampos" :loading="loadingmodal" padding="10px" color="secondary" label="guardar">
            <q-icon name="style" color="white" right />
          </q-btn>

          <q-btn :loading="loadingmodal" padding="10px" color="secondary" label="imprimir">
            <q-icon name="print" color="white" right />
          </q-btn>

          <q-btn :loading="loadingmodal" padding="10px" color="warning" label="cancelar" text-color="white" v-close-popup>
            <q-icon name="cancel" color="white" right />
          </q-btn>

        </q-card-section>

      <!-- <router-link to="/Det_pedido" class="ingresarcont">
        <q-btn class="ingresar opcion" color="primary">Crear Pedido
          <q-icon name="style" color="white" right />
        </q-btn>
      </router-link> -->
    </div>
  </div>
</template>
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

.continputs1 {
  border-top: solid 1px rgba(0, 0, 0, 0.212);
  margin-top: 2px;
}

.modalinputs {
  width: 400px;
  max-width: 80%;
}

.descripcioninput {
  width: 100%;
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
</style>