import { product_form } from "../models/product.js"
import { sale_product_form } from "../models/sale-product.js"
import { sale_variation_form } from "../models/sale-variation.js"
import { sale_form } from "../models/sale.js"
import { size_form } from "../models/size.js"
import { variation_form } from "../models/variation.js"


const table_type_list = [
    {
        title:"Produto",
        type:'product',
        havePage:true,
        form:product_form
    },
    {
        title:"Variação",
        type:"variation",
        havePage:false,
        form:variation_form
    },
    {
        title:"Tamanho",
        type:"size",
        havePage:false,
        form:size_form
    },
    {
        title:"Venda",
        type:'sale',
        havePage:true,
        form:sale_form
    },
    {
        title:"",
        type:"sale_product",
        havePage:false,
        form:sale_product_form
    },
    {
        title:"",
        type:"sale_variation",
        havePage:false,
        form:sale_variation_form
    }
]

export {
    table_type_list
}