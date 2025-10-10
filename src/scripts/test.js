import { Dialog } from "./dialog.js";
import { onCreateForm, onDeleteForm } from "./form.js";
import { onValidateDefault } from "./validation/default-validation.js";
import { onValidateProduct } from "./validation/product-validation.js";

const dialog_valid_type_list = [
    {
        type:'form',
        title:"Cadastro",
        tag:{
            type:"form",
            className:"form"
        }
    },
    {
        type:"view",
        title:"Visualização",
        tag:{
            type:"",
            className:""
        }
    }
]

const onCoupledDialog = (type,table,method)=>{
    const dialog = new Dialog(".dialog")
    
    const close_dialog_button = Array
    .from(dialog.header.children)
    .find((dialog_item)=>dialog_item.className == "close-container").children[0];

    const dialog_title = Array
    .from(dialog.header.children)
    .find((dialog_item)=>dialog_item.className == "title-container").children[0]

    const dialog_content = dialog.content;
    dialog_content.innerHTML = "";
    
    const content = dialog_valid_type_list
    .find((type_item)=>
        type_item.type === type
    )

    dialog_title.textContent = content.title
    close_dialog_button.onclick = ()=>{
        dialog.onCloseModal()
        onDeleteForm()
    }

    const tag = document.createElement(content.tag.type)
    tag.setAttribute("class",content.tag.className  )

    if(!!tag){
        onCreateForm(table,tag,(data)=>{

            if(!onValidateProduct(data).isValid){
                return
            }
            
            const formated_data_items = data.map((data_item)=>Object.entries(data_item)[0])
            console.log(formated_data_items)
            const product_data = {

                description:formated_data_items
                .find((data_item)=>data_item[0].includes('description_id'))[1],

                cod:formated_data_items
                .find((data_item)=>data_item[0].includes('cod'))[1],

                variations:(()=>{

                const variation_data_items = formated_data_items
                .filter((data_item)=>data_item[0].includes('variation'))
                // .map((data_item)=>{
                //     return {
                //         [data_item[0]]:data_item[1]
                //     }
                // })
                const variation_formated_data = [];
                for(let i=0;i < (variation_data_items.length / 3); i++){

                    const formated_variation_items = variation_data_items
                    .filter((variation_item)=>
                    {   
                        return (variation_item[0].includes(i))
                    })
                    .map((variation_item,variation_index)=>
                    {
                        return {
                            [variation_item[0]
                            .replace("variation.","")
                            .replace("."+i,"")
                            ]:variation_item[1]
                        }
                    }
                    )

                    variation_formated_data.push(formated_variation_items)
                console.log(formated_variation_items)

                }

                // for(let i=0;i < (variation_data_items.length / 3); i++){
                //     console.log(variation_item[0].includes(i))
                // }
                
                return variation_formated_data
                })()
            }

            console.log(product_data)

        },false,(
            method === 'put'
            ? {
                description_id:"sasa",
                cod_id:"013",
                variations_id:[
                    {
                        variation_name_id_0:"aaaaaa",
                        variation_quantity_id_0:19
                    },
                    {
                        variation_name_id_1:"bbbbbb",
                        variation_quantity_id_1:20
                    }
                ]
            }
            : null
        ))
    }

    dialog_content.append(tag);


    dialog.onShowModal()
   
}

const product_register_button = document.querySelector("#product_register_button")
const sale_register_button = document.querySelector("#sale_register_button");

product_register_button.onclick = ()=>onCoupledDialog("form","product","post")
sale_register_button.onclick = ()=>onCoupledDialog("form","product","put")
