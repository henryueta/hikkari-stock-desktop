import { size_form } from "./size.js"

const variation_form = [
    {
        id:"identifier_id",
        registerId:"identifier",
        tag:"input",
        title:"",
        type:"hidden",
    },
    {
        id:"name_id",
        registerId:"name",
        tag:"input",
        title:"Variação",
        type:"text",
    },
    {
        id:"quantity_id",
        registerId:"quantity",
        tag:"input",
        title:"Quantidade",
        type:"number",
    },
    // {
    //     id:"size_id",
    //     registerId:"size",
    //     tag:"",
    //     title:"Tamanhos",
    //     type:"text",
    //     table:"size",
    //     isFromFieldArray:true
    // }
]

export {
    variation_form
}