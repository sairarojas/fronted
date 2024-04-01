<template>
  <div>
    <q-dialog v-model="modal">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title>Agregar {{ modelo }}</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-input class="input1" outlined v-model="data.codigo_ficha" label="Codigo de la Ficha" type="number"
            maxlength="15" lazy-rules :rules="[val => val.trim() != '' || 'Ingrese el codigo de la ficha']"></q-input>
          <q-input class="input1" outlined v-model="data.nombre" label="Nombre" type="text"  lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese un nombre']"></q-input>
            <q-select
  class="input1"
  outlined
  v-model="data.nivel_de_formacion"
  label="Nivel de formación"
  :options="opcionesNivelFormacion"
  emit-value
  map-options
  :use-input="false"
>
  <!-- Manejo de caso en el que no hay opciones disponibles -->
  <template v-slot:no-option>
    <q-item>
      <q-item-section class="text-grey">
        No se encontraron opciones disponibles.
      </q-item-section>
    </q-item>
  </template>
</q-select>

          <q-input class="input1" outlined v-model="data.fecha_inicio" label="Fecha de inicio" type="date" 
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese la fecha de inicio']"></q-input>
          <q-input class="input1" outlined v-model="data.fecha_fin" label="Fecha de cierre" type="date" 
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese la fecha de cierre']"></q-input>
            <q-select class="input1" outlined v-model="data.area" label="Área" :options="opcionesArea"></q-select>
          <q-card-section class="q-gutter-md row items-end justify-end continputs1">
            <q-btn @click="validarCampos" :loading="loadingmodal" padding="10px"
              :color="estado == 'editar' ? 'warning' : 'secondary'" :label="estado">
              <q-icon :name="estado == 'editar' ? 'edit' : 'style'" color="white" right />
            </q-btn>
            <q-btn :loading="loadingmodal" padding="10px" color="warning" label="cancelar" text-color="white" v-close-popup>
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
          </q-td>
        </template>
      </q-table>
    </div>

    <router-link to="/Dis_presupuesto" class="ingresarcont">
      <q-btn class="distribucion" color="primary" icon-right="chevron_right">Distribucion de presupuesto</q-btn>
    </router-link>
  </div>
</template>

<script setup>
import {  ref } from "vue";
import { useFichaStore } from "../stores/ficha.js";
import { useAreaStore } from "../stores/area";
import { useQuasar } from 'quasar'

const modelo = "Fichas";
const useFicha = useFichaStore();
const useArea = useAreaStore();
const loadingTable = ref(true)
const $q = useQuasar()
const filter = ref("");
const loadingmodal = ref(false);


const columns = ref([
  {
    name: "codigo_ficha",
    label: "Codigo",
    align: "left",
    field: (row) => row.codigo_ficha,
    sort: true,
    sortOrder: "da",
  },
  {
    name: "nombre",
    label: "Nombre",
    align: "left",
    field: (row) => row.nombre,

  },
  {
    name: "nivel_de_formacion",
    label: "Nivel de formación",
    align: "left",
    field: (row) => row.nivel_de_formacion,
  },
  {
    name: "fecha_inicio",
    label: "Fecha de inicio",
    align: "left",
    field: (row) => convertirFecha(row.fecha_inicio),
  },
  {
    name: "fecha_fin",
    label: "Fecha de cierre",
    align: "left",
    field: (row) => convertirFecha(row.fecha_fin),
  },
  {
    name: "area",
    label: "Área",
    align: "left",
    field: (row) => row.area ? row.area.nombre : '',
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

const opcionesNivelFormacion = [
  { label: 'Curso', value: 'Curso' },
  { label: 'Técnico', value: 'Técnico' },
  { label: 'Tecnólogo', value: 'Tecnólogo' },
];


function convertirFecha(cadenaFecha) {
  const fecha = new Date(cadenaFecha);
  const offset = 5 * 60;
  fecha.setMinutes(fecha.getMinutes() + offset);
  const año = fecha.getFullYear();
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const dia = fecha.getDate().toString().padStart(2, "0");

  const fechaFormateada = `${dia}/${mes}/${año}`;
  return fechaFormateada;
}

const data = ref({
  codigo_ficha: "",
  nombre: "",
  nivel_de_formacion: "",
  fecha_inicio: "",
  fecha_fin: "",
  area: "",
});

const opcionesArea = ref([]);

const obtenerInfo = async () => {
  try {
    const fichas = await useFicha.obtenerInfoFichas();
    const Activa = fichas.filter(ficha => ficha.status === "1")
    console.log(fichas);

    if (!Activa) return;

    if (Activa.error) {
      notificar('negative', Activa.error);
      return;
    }
    rows.value = Activa;

    const area = await useArea.obtenerInfoAreas();
    console.log(area);
      if (area && Array.isArray(area.areas)) {
        const filtro = area.areas.filter(areas => areas.status==1);
      opcionesArea.value = filtro.map(area=>area.nombre)
    } else {
  console.error("El áreas es inválido:", area);
  }
  } catch (error) {
    console.error(error);
  } finally {
    loadingTable.value = false;
  }
};


obtenerInfo();


const estado = ref("guardar");
const modal = ref(false);
const opciones = {
  agregar: () => {
    data.value = {
      codigo_ficha: "",
      nombre: "",
      nivel_de_formacion: "",
      fecha_inicio: "",
      fecha_fin: "",
      area: "",
    };
    modal.value = true;
    estado.value = "guardar";
  },
  editar: (info) => {
    data.value = { ...info };
    if (data.value.fecha_inicio) {
      data.value.fecha_inicio = new Date(data.value.fecha_inicio).toISOString().split('T')[0];
    }
    if (data.value.fecha_fin) {
      data.value.fecha_fin = new Date(data.value.fecha_fin).toISOString().split('T')[0];
    }
    if (data.value.area) {
      data.value.area = { label: info.area.nombre, value: info.area._id };
    }
    modal.value = true;
    estado.value = "editar";
  },
};

function buscarIndexLocal(id) {
  return rows.value.findIndex((r) => r._id === id);
}

const enviarInfo = {
  async guardar() {
  loadingmodal.value = true;
  try {
    const areaValue = typeof data.value.area === 'object' && 'value' in data.value.area ? data.value.area.value : data.value.area;

    const response = await useFicha.postFicha({
      codigo_ficha: data.value.codigo_ficha,
      nombre: data.value.nombre,
      nivel_de_formacion: data.value.nivel_de_formacion,
      fecha_inicio: data.value.fecha_inicio,
      fecha_fin: data.value.fecha_fin,
      area: areaValue
    });

    console.log(response);
    if (!response) return;
    if (response.error) {
      notificar('negative', response.error);
      loadingmodal.value = false;
      return;
    }

    rows.value.unshift(response);
    notificar('positive', 'Guardado exitosamente');
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
    const areaValue = typeof data.value.area === 'object' && 'value' in data.value.area ? data.value.area.value : data.value.area;

    let response = await useFicha.putFicha(data.value._id, {
      codigo_ficha: data.value.codigo_ficha,
      nombre: data.value.nombre,
      nivel_de_formacion: data.value.nivel_de_formacion,
      fecha_inicio: data.value.fecha_inicio,
      fecha_fin: data.value.fecha_fin,
      area: areaValue
    });
    console.log(response);
    if (!response) return;
    if (response.error) {
      notificar('negative', response.error);
      loadingmodal.value = false;
      return;
    }
    console.log(rows.value);
    rows.value.splice(buscarIndexLocal(response.data.fichas._id), 1, response.data.fichas);
    notificar('positive', 'Editado exitosamente');
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
      console.log(id);
      const response = await useFicha.putActivar(id);
      console.log(response);
      console.log("Activando");
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      }
      rows.value.splice(buscarIndexLocal(response.data.fichas._id), 1, response.data.fichas);
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
      console.log("Desactivar");
      const response = await useFicha.putInactivar(id);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)

        return
      }
      rows.value.splice(buscarIndexLocal(response.data.fichas._id), 1, response.data.fichas);
      notificar('negative', 'Inactivado exitosamente')
    } catch (error) {
      console.log(error);
    } finally {
      loadingmodal.value = false;
    }

  },
};

function validarCampos() {
  const arrData = Object.entries(data.value);

  for (const d of arrData) {
    if (d[1] === null) {
      notificar('negative', "Por favor complete todos los campos");
      return;
    }
    if (typeof d[1] === 'string') {
      if (d[1].trim() === "") {
        notificar('negative', "Por favor complete todos los campos");
        return;
      }
    }

    if (d[0] === "codigo_ficha" && d[1].toString().length < 6) {
      notificar('negative', "El codigo debe tener más de 6 digitos");
      return;
    }

    if (d[0] === "nombre" && d[1].length > 30) {
      notificar('negative', 'El nombre no puede tener más de 30 caracteres');
      return;
    }

    if (d[0] === "nivel_de_formacion" && d[1].length > 15) {
      notificar('negative', 'El nivel de formacion no puede tener más de 15 caracteres');
      return;
    }

    if (d[0] === "fecha_inicio" && d[1].trim() === "") {
      notificar('negative', 'Por favor, digite la fecha de inicio');
      return;
    }

    if (d[0] === "fecha_fin" && d[1].trim() === "") {
      notificar('negative', 'Por favor, digite la fecha de fin');
      return;
    }
  }
  const fechaInicio = new Date(data.value.fecha_inicio);
  const fechaFin = new Date(data.value.fecha_fin);

  if (fechaInicio > fechaFin) {
    notificar('negative', 'La fecha de inicio no puede ser posterior a la fecha de fin');
    return;
  }

  enviarInfo[estado.value]();
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