import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useFichaStore = defineStore('ficha', () => {
    const fichas = ref([]);

    const obtenerInfoFichas = async () => {
        try {
            let responFichas = await axios.get('ficha/ver');
            console.log(responFichas)
            return responFichas.data
            
        } catch (error) {
            console.log(error);
            throw error
        }
    };

    const postFicha = async (data) =>{
        try {
            let res = await axios.post('ficha/agregar', data);
            console.log('a', res);
            return res.data.fichas
        } catch (error) {
            return error.response.data
        }
    }

    const putFicha = async (id, data) => {
        try {
            let res = await axios.put(`ficha/modificar/${id}`, data);
            return res
        } catch (error) {
            return error.response.data
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`ficha/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la ficha");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let r = await axios.put(`ficha/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la ficha");
        }
    }

    return {
        fichas,
        obtenerInfoFichas, postFicha, putFicha, putInactivar, putActivar
    };
});