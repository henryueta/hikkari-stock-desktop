import { api_endpoints } from "./config/config.js";
import { Dialog } from "./dialog.js";
import { onQuery } from "./fetch.js";
import { onCreateForm, onDeleteForm } from "./form.js";
import { dialog_valid_type_list } from "./objects/dialog.js";
import { onValidateProduct } from "./validation/product-validation.js";

const onCoupledDialog = async (type,table,method,id,defaultValues)=>{
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
    let table_default_values = (
        !!defaultValues
        ? defaultValues
        : null 
    ); 
        
    if(!!id){
        
       await onQuery({
            url:api_endpoints[table].get_id
            +"&id="+id,
            method:'get',
        },{
            onThen(data){
                console.log(data)
                table_default_values = data
            }
        })
    }
        onCreateForm(table,tag,async (data)=>{

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
                            .replace("variation_","")
                            .replace("_"+i,"")
                            .replace("_id","")
                            ]:variation_item[1]
                        }
                    }
                    )


                    variation_formated_data.push(Object.assign({},...formated_variation_items))
                console.log(formated_variation_items)

                }

                // for(let i=0;i < (variation_data_items.length / 3); i++){
                //     console.log(variation_item[0].includes(i))
                // }
                
                return variation_formated_data
                })()
            }

            await onQuery({
                url:api_endpoints[table][method]+(
                    method === 'put'
                    ? "&id="+id
                    : ""
                ),
                method:method,
                body:{
                    data:product_data
                }
            },{
                onThen(data){
                    console.log(data)
                }
            })

        },false,(
            table_default_values
        ))
    }

    dialog_content.append(tag);


    dialog.onShowModal()
   
}

const product_register_button = document.querySelector("#product_register_button")
product_register_button.onclick = ()=>onCoupledDialog("form","product","post")




export {
    onCoupledDialog
}