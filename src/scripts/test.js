import { api_endpoints } from "./config/config.js";
import { Dialog } from "./dialog.js";
import { onQuery } from "./fetch.js";
import { onCreateForm, onDeleteForm, onDisableFormFields } from "./form.js";
import { onResetTable } from "./management.js";
import { dialog_valid_type_list } from "./objects/dialog.js";
import { table_type_list } from "./objects/table.js";
import { variation_list } from "./sale.js";

const onCoupledDialog = async (type,table,method,id,defaultValues,maxNumberValues)=>{
    const dialog = new Dialog(".dialog")
    
    const close_dialog_button = Array
    .from(dialog.header.children)
    .find((dialog_item)=>dialog_item.className == "close-container").children[0];

    const dialog_title = Array
    .from(dialog.header.children)
    .find((dialog_item)=>dialog_item.className == "title-container").children[1]

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
    
    if(type === 'list_view'){
        let current_list = [];
        await onQuery({
            url:api_endpoints[table].get_list,
            method:"post",
            body:{
                ids:variation_list
            }
        },{
            onThen(data){
                current_list = data.list;
                 for(const item of current_list){

                    const item_view_container = document.createElement("div")
                    item_view_container.setAttribute("class","item-view-container")
                    item_view_container.innerHTML = 
                    `
                    <label>
                    <p>Produto</p>
                    <input disabled value="${item.product}"/>
                    </label>

                    <label>
                    <p>Variação</p>
                    <input disabled value="${item.variation}"/>
                    </label>

                    <label>
                    <p>Quantidade</p>
                    <input disabled value="${item.quantity}"/>
                    </label>
                    `
                    tag.append(item_view_container)
                }
            }
        })

       

    }   

    if(type === 'delete_confirm'){
        
        const confirm_ask_container = document.createElement("div")
        confirm_ask_container.setAttribute("class","confirm-ask-container")
        const confirm_ask = document.createElement("h2")
        confirm_ask.textContent = "Deseja deletar o registro?"
        confirm_ask_container.append(confirm_ask)
        tag.append(confirm_ask_container)

        const current_table = table_type_list.find((item)=>item.type === table)
        if(!!current_table && current_table.type === 'sale'){

            const stock_devolution_ask_container = document.createElement("div");
            stock_devolution_ask_container.setAttribute("class","stock-devolution-ask-container");
            const stock_devolution_ask = document.createElement("span");
            stock_devolution_ask.textContent = "Devolver produtos ao estoque";
            const stock_devolution_check = document.createElement("input");
            stock_devolution_check.setAttribute("type","checkbox");
            stock_devolution_check.setAttribute("id","stock_devolution_id");

            stock_devolution_ask_container.append(stock_devolution_check)
            stock_devolution_ask_container.append(stock_devolution_ask)
            tag.append(stock_devolution_ask_container)
        }

        const confirm_actions_container = document.createElement("div")
        confirm_actions_container.setAttribute("class","confirm-actions-container")
        const confirm_button = document.createElement("button")
        confirm_button.innerHTML = "Confirmar"
        confirm_button.setAttribute("id","confirm-button")
        const cancel_button = document.createElement("button")
        cancel_button.innerHTML = "Cancelar"
        cancel_button.setAttribute("id","cancel-button")

        confirm_actions_container.append(cancel_button)
        cancel_button.onclick = ()=>{dialog.onCloseModal()}

        confirm_actions_container.append(confirm_button)
        confirm_button.onclick = async ()=>{
            await onQuery({
                url:api_endpoints[table].delete
                +"&id="+id
                +(
                    current_table.type === 'sale'
                    ? "&stock_devolution="+(()=>{

                        const stock_devolution = document.querySelector("stock_devolution_id")
                        return stock_devolution.value
                    })()
                    : ""
                ),
                method:'delete',
            },{
                onThen(data){
                    console.log(data)
                    onResetTable({
                        head:document.querySelector(".table-head"),
                        body:document.querySelector(".table-body")
                    })
                    dialog.onCloseModal()
                }
            })
        }

        tag.append(confirm_actions_container)

   
    }

    if(!!table && !!id){
        
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
        if(!!table && type === 'form'){
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
    }

    dialog_content.append(tag);


    dialog.onShowModal()
   
}



export {
    onCoupledDialog
}