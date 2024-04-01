

import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useProductoStore = defineStore('producto', () => {
    const productos = ref([]);

    const obtenerInfoProducto = async () => {
        try {
            let responseProducto = await axios.get('producto/ver');
            console.log (responseProducto);
            // lotes.value = responseLotes.data; 
            return responseProducto.data
            console.log(productos)
        } catch (error) {
            throw error
        }
    };

    const postProducto = async (data) =>{
        try {
            console.log('a');
            let res = await axios.post("producto/agregar", data);
            console.log('a', res);
            return res.data.productos
        } catch (error) {
            throw error
        }
    }

    const putProducto = async (id, data) => {
        try {
            let res = await axios.put(`producto/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`producto/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del lote");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let r = await axios.put(`producto/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del lote");
        }
    } 

    return {
        productos,
        obtenerInfoProducto, postProducto, putProducto, putInactivar, putActivar
    };
});