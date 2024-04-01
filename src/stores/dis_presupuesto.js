import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const usedisPresupuesStore = defineStore('disPresupues', () => {
    const disPresupuesto = ref([]);

    const obtenerInfodisPresupues = async () => {
        try {
            let responsedisPresupuesto = await axios.get('disPresupues/ver');
            return responsedisPresupuesto.data
        } catch (error) {
            throw error
        }
    };


    const postDisPresupuesto = async (data) =>{
        try {
            console.log('a');
            let res = await axios.post("disPresupues/agregar",data);
            console.log('a', res);
            return res.data.distribucion
        } catch (error) {
            return error.response.data
        }
    }


    const putDisPresupuesto = async (id, data) => {
        try {
            let res = await axios.put(`disPresupues/modificar/${id}`, data);
            return res
        } catch (error) {
            return error.response.data
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`disPresupues/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del lote");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let r = await axios.put(`disPresupues/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del lote");
        }
    }

    return {
        disPresupuesto,
        obtenerInfodisPresupues, postDisPresupuesto, putDisPresupuesto, putInactivar, putActivar
    };
});