/* import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const usePresupuestoStore = defineStore('items', () => {
    const presupuestos = ref([]);

    const obtenerInfoPresupuesto = async () => {
        try {
            let responsePresupuesto = await axios.get('items/ver');
            console.log(responsePresupuesto);
            return responsePresupuesto.data
/*             presupuestos.value = responsePresupuesto.data.presupuestos;  
        } catch (error) {
            throw error
        }
    };

    const postItem = async (data) =>{
        try {
            let res = await axios.post("items/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const  putItem= async (id, data) => {
        try {
            let res = await axios.put(`items/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`items/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del presupuesto");
        }
    }
    const putactivar = async (id)=>{
        try {
            let r = await axios.put(`items/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del presupuesto");
        }
    }

    return {
        presupuestos,
        obtenerInfoPresupuesto, postItem, putItem,putInactivar , putactivar
    };
});  */

import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const usePresupStore = defineStore('items', () => {
    const presupuestos = ref([]);

    const obtenerInfoPresup = async () => {
        try {
            let responsePresup = await axios.get('items/ver');
            console.log (responsePresup);
            // lotes.value = responseLotes.data; 
            return responsePresup.data
            console.log(presupuestos)
        } catch (error) {
            throw error
        }
    };

    const postItem = async (data) =>{
        try {
            console.log('a');
            let res = await axios.post("items/agregar", data);
            console.log('a', res);
            return res.data.items
        } catch (error) {
            throw error
        }
    }

    const putItem = async (id, data) => {
        try {
            let res = await axios.put(`items/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`items/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del presupuesto");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let r = await axios.put(`items/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del presupuesto");
        }
    }

    return {
        presupuestos,
        obtenerInfoPresup, postItem, putItem, putInactivar, putActivar
    };
});