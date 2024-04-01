import { it, describe } from "mocha";
import { expect } from 'chai';
import { suma } from "./validador.js";

describe("prueba de suma", function(){
    it("el resultado de la suma debe ser => 6", function (){
        const result = suma(3,3);
        expect(result).to.be.equal(6);
    })
})
