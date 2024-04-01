/* 
import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const usePedidoStore = defineStore('pedido', () => {
    const pedidos = ref([]);

    const obtenerInfoPedidos = async () => {
        try {
            let responsePedidos = await axios.get('pedido/ver');
            pedidos.value = responsePedidos.data.pedidos;
        } catch (error) {
            throw error
        }
    };

    const postPedido = async (data) =>{
        try {
            let res = await axios.post("pedido/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putPedido = async (id, data) => {
        try {
            let res = await axios.put(`pedido/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`pedido/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del pedido");
        }
    }
    const putActivar = async (id)=>{
        try {
            let r = await axios.put(`pedido/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del pedido");
        }
    }

    return {
        pedidos,
        obtenerInfoPedidos, postPedido, putPedido, putInactivar, putActivar
    };
}); */

import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const usePedidoStore = defineStore('pedido', () => {
    const pedidos = ref([]);

    const obtenerInfoPedido = async () => {
        try {
            let responsePedido = await axios.get('pedido/ver');
            console.log("ejecutando pedido");
            console.log (responsePedido);
            // lotes.value = responseLotes.data; 
            return responsePedido.data
        } catch (error) {
            throw error
        }
    };

    const postPedido = async (data) =>{
        try {
            console.log('a');
            let res = await axios.post("pedido/agregar", data);
            console.log('a', res);
            return res.data.pedidos
        } catch (error) {
            throw error
        }
    }

    const putPedido = async (id, data) => {
        try {
            let res = await axios.put(`pedido/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`pedido/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del lote");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let r = await axios.put(`pedido/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del lote");
        }
    }

    return {
        pedidos,
        obtenerInfoPedido, postPedido, putPedido, putInactivar, putActivar
    };
});