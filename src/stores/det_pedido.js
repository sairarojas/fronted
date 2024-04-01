/* import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useDet_pedidoStore = defineStore('det_pedido', () => {
    const det_pedido = ref([]);

    const obtenerInfoDet_pedido = async () => {
        try {
            let responseDet_pedido= await axios.get('det_pedido/ver');
            det_pedido.value = responseDet_pedido.data.det_pedido; 
        } catch (error) {
            throw error
        }
    };

    const postDetPedido = async (data) =>{
        try {
            let res = await axios.post("det_pedido/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putDetPedido = async (id, data) => {
        try {
            let res = await axios.put(`det_pedido/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let res = await axios.put(`det_pedido/inactivar/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado del detalle de pedido");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let res = await axios.put(`det_pedido/activar/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado del detalle de pedido");
        }
    }

    return {
        det_pedido,
        obtenerInfoDet_pedido, postDetPedido,putDetPedido , putInactivar, putActivar
    };
});  */

import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const usedetPedidoStore = defineStore('detPedido', () => {
    const detPedidos = ref([]);

    const obtenerInfodetPedido = async () => {
        try {
            let responsedetPedidos = await axios.get('detPedido/ver');
            console.log (responsedetPedidos);
            // lotes.value = responseLotes.data; 
            return responsedetPedidos.data
            console.log(detPedidos)
        } catch (error) {
            throw error
        }
    };

    const postDetPedido = async (data) =>{
        try {
            console.log('a');
            let res = await axios.post("detPedido/agregar", data);
            console.log('a', res);
            return res.data.lotes
        } catch (error) {
            throw error
        }
    }

    const putDetPedido = async (id, data) => {
        try {
            let res = await axios.put(`detPedido/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`detPedido/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del lote");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let r = await axios.put(`detPedido/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del lote");
        }
    }

    return {
        detPedidos,
        obtenerInfodetPedido, postDetPedido, putDetPedido, putInactivar, putActivar
    };
});