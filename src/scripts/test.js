import { api_endpoints } from "./config/config.js";
import { Dialog } from "./dialog.js";
import { onQuery } from "./fetch.js";
import { onCreateForm, onDeleteForm, onDisableFormFields } from "./form.js";
import { onChangeTableType, onResetTable } from "./management.js";
import { dialog_valid_type_list } from "./objects/dialog.js";
import { table_type_list } from "./objects/table.js";

const onCoupledDialog = async (type,table,method,id,defaultValues,maxNumberValues)=>{
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
    tag.setAttribute("class",content.tag.className)

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

            // if(!onValidateProduct(data).isValid){
            //     return
            // }
            
            const formated_data_items = data.map((data_item)=>Object.entries(data_item)[0])
            const current_table = (()=>{
                const table_index = table_type_list.findIndex((table_item)=>
                table_item.type === table
                )
                return table_type_list[table_index]
            })()
            
            const formated_data = current_table.validator(formated_data_items)
            
            await onQuery({
                url:api_endpoints[table][method]+(
                    method === 'put'
                    ? "&id="+id
                    : ""
                ),
                method:method,
                body:{
                    data:formated_data
                }
            },{
                onThen(data){
                    console.log(data);
                    dialog.onCloseModal();
                    onResetTable({
                        head:document.querySelector(".table-head"),
                        body:document.querySelector(".table-body")
                    })
                },
                onCatch(error){
                    console.log(error)
                    const current_form = document.querySelector(".form")
                    onDisableFormFields(current_form,false)
                }
            })

        },false,table_default_values,maxNumberValues)
    }

    dialog_content.append(tag);


    dialog.onShowModal()
   
}



export {
    onCoupledDialog
}