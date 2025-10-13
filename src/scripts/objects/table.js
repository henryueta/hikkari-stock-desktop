import { api_endpoints } from "../config/config.js"
import { onQuery } from "../fetch.js"
import { product_form } from "../models/product.js"
import { sale_product_form } from "../models/sale-product.js"
import { sale_form } from "../models/sale.js"
import { variation_form } from "../models/variation.js"
import { variation_list } from "../sale.js"
import { onCoupledDialog } from "../test.js"
import { onValidateProduct } from "../validation/product-validation.js"
import { onValidateSale } from "../validation/sale-validation.js"


const table_type_list = [
    {
        title:"Produto",
        validator:onValidateProduct,
        type:'product',
        havePage:true,
        default_actions:{
            edit:true,
            delete:true
        },
        selection:{
            selectable:false,
            onSelect:null
        },
        expansion:{
            expansive:true,
            onExpand(id){
                return api_endpoints.variation.get+"&product_id="+id
            },
            expasive_table_type:"variation"  
        },
        form:product_form
    },
    {
        title:"Variação",
        validator:null,
        type:"variation",
        havePage:false,
        default_actions:{
            edit:false,
            delete:true
        },
        selection:{
            selectable:true,
            onSelect(id,selected){
                const sale_register_button = document.querySelector("#sale_register_button");
                if(selected){
                    variation_list.push(id);
                    
                } else{
                    variation_list.splice(variation_list.findIndex((variation_item)=>variation_item === id),1)
                }
                if(!!variation_list.length){
                    sale_register_button.style.display = "block";
                    sale_register_button.onclick = async ()=>{
                        
                        await onQuery({
                            url:api_endpoints.variation.get_id,
                            method:"post",
                            body:{
                                ids:variation_list
                            }
                        },{
                            onThen(data){
                                let max_number_values = {};
                                const formated_data = data.map((data_item)=>
                                    {
                                        const filtered_data = Object.entries(data_item)
                                        .filter((data_item_entrie)=>{
                                            if(data_item_entrie[0].includes("sale_product_quantity_id")){
                                                max_number_values = {[data_item_entrie[0]]:data_item_entrie[1],...max_number_values}
                                            }
                                            return !data_item_entrie[0].includes("sale_product_quantity_id")
                                        })
                                        
                                        return Object.fromEntries(filtered_data)
                                    })
                                 onCoupledDialog("form","sale","post",null,{products_id: formated_data},max_number_values)
                            }
                        })

                    }

                    return 
                }
                    sale_register_button.style.display = "none";
                return 
                
            }
        },
        expansion:{
            expansive:false,
            onExpand:null,
            expasive_table_type:null  
        },
        form:variation_form
    },
    {
        title:"Venda",
        validator:onValidateSale,
        type:'sale',
        havePage:true,
        default_actions:{
            edit:true,
            delete:true
        },
        selection:{
            selectable:false,
            onSelect:null
        },
        expansion:{
            expansive:false,
            onExpand:null,
            expasive_table_type:null  
        },
        form:sale_form
    },
    {
        title:"Produto de Venda",
        type:'sale_product',
        havePage:true,
        default_actions:{
            edit:false,
            delete:false
        },
        selection:{
            selectable:false,
            onSelect:null
        },
        expansion:{
            expansive:false,
            onExpand:null,
            expasive_table_type:null  
        },
        form:sale_product_form
    },
]

export {
    table_type_list
}