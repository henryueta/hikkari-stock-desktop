import { variation_form } from "./variation.js"

const product_form = [
    {
        id:"description_id",
        tag:"input",
        type:"text",
        title:"Descrição",
    },
    {
        id:"cod_id",
        tag:"input",
        type:"text",
        title:"Código"
    },
    {
        id:"variations_id",
        tag:"",
        type:"form",
        title:"Variações",
        table:"variation"
    }
]



export {
    product_form
}