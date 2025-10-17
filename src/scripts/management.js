import { api_endpoints } from "./config/config.js";
import { onQuery } from "./fetch.js";
import { table_type_list } from "./objects/table.js";
import { variation_list } from "./sale.js";
import { onCoupledDialog } from "./test.js";

const onCreateDefaultTableHeaderAction = (title)=>{
    const default_header_title = document.createElement("th");
    default_header_title.innerHTML = title;
    return default_header_title
}

const onCreateTableHeaderAction = (type)=>{
    const valid_type = {

        "edit":()=>{
            return onCreateDefaultTableHeaderAction("Edição")
        },
        "delete":()=>{
            return onCreateDefaultTableHeaderAction("Remoção")
        },
        "expand":()=>{
            return onCreateDefaultTableHeaderAction("Expanção")
        },
        "select":()=>{
            return onCreateDefaultTableHeaderAction("Selecionar")
        }

    }
    return valid_type[type]()
}

const onCreateCheckBoxTableDataAction = (onclick)=>{
    const default_data_column = document.createElement('td');
    const default_data_check = document.createElement("input");
    default_data_check.setAttribute("type","checkbox")
    default_data_check.onclick = ()=>onclick();
    default_data_column.append(default_data_check)
    return default_data_column
}

const onCreateDefaultTableDataAction = (id,title,onclick)=>{
    const default_data_column = document.createElement('td');
    const default_data_button = document.createElement("button");
    const default_data_button_icon = document.createElement("img")
    default_data_button.append(default_data_button_icon)
    const default_data_title = document.createElement("span")
    default_data_title.textContent = title
    default_data_button_icon.setAttribute("src","../../assets/imgs/Other008.ico")
    default_data_button.append(default_data_title);
    default_data_button.setAttribute("id",id)
    default_data_button.onclick = ()=>onclick();
    default_data_column.append(default_data_button)
    return default_data_column
}


const onCreateTableDataAction = (type,params)=>{
    
    const valid_type = {
        "edit":()=>{
            return onCreateDefaultTableDataAction(
                "data-edit-button",
                "Editar",
                    ()=>onCoupledDialog(
                    'form',
                    params.table,
                    'put',
                    params.id
                    )
            )
        },
        "delete":()=>{
            return onCreateDefaultTableDataAction(
                "data-delete-button",
                "Deletar",
                    ()=>{console.log(params.id)
                        onCoupledDialog("delete_confirm",params.table,"delete",params.id)
                    }
            )
        },
        "expand":()=>{
             let button_toggle = false;
            return onCreateDefaultTableDataAction(
                "data-expand-button",
                "Expandir",
                    ()=>{
                        params.sub_table.parentElement.parentElement.style.display = "table-row"
                        const table_head = params.sub_table.querySelector("thead");
                        const table_body = params.sub_table.querySelector("tbody");
                        const table_body_selected_list = table_body.querySelectorAll("input[type=checkbox]")
                        let checkout = (
                            !!table_body_selected_list
                            ? !Array.from(table_body_selected_list).find((item)=>item.checked)
                            : true
                        )    
                        
                        if(checkout){
                        button_toggle = !button_toggle
                        if(button_toggle){
                            console.log(button_toggle)
                            
                            const current_table = table_type_list[
                                    table_type_list.findIndex((table_item)=>table_item.type === params.table)
                                ]
                            const table_of_expansion = table_type_list[
                                table_type_list.findIndex((table_item)=>table_item.type === current_table.expansion.expasive_table_type)
                            ]

                            onQuery({
                                url:current_table.expansion.onExpand(params.id),
                                method:"get"
                            },{
                                onThen(data){
                                    onCreateTable({
                                        head:table_head,
                                        body:table_body
                                    },data.header,data.data,table_of_expansion)
                                }
                            })
                            return
                        }
                        
                        table_head.innerHTML = "";
                        table_body.innerHTML = "";
                         params.sub_table.parentElement.parentElement.style.display = "none"
                        return
                        }
                        return
                    }
            )
        },
        "select":()=>{
            let select_toggle = false
            return onCreateCheckBoxTableDataAction(
                ()=>{
                    select_toggle = !select_toggle
                    const current_table = table_type_list[
                        table_type_list.findIndex((table_item)=>table_item.type === params.table)
                    ]
                    current_table.selection.onSelect(params.id,select_toggle)
                }
            )

        }
    }

    return valid_type[type](params)

}


const onCreateTableTitle = (title)=>{
     const table_title_container = document.querySelector(".table-title-container")
    
    table_title_container.children[0].textContent = title
}

const onCreateTable = (document_structure,header,data,table)=>{

    const table_header_row = document.createElement("tr");

    for(const title of header){
        if(title !== 'id' && !title.includes("_id")){
            const table_header = document.createElement("th");
            table_header.innerHTML = title
            table_header_row.append(table_header)
        }
    }
    onCreateTableTitle("Gerenciamento de "+table.title+"s")

    document_structure.head.append(table_header_row)

    if(table.default_actions.edit){
        const edit_header_column = onCreateTableHeaderAction('edit')
        table_header_row.append(edit_header_column)
    }

    if(table.default_actions.delete && !!table.expansion.expansive){
        const delete_header_column = onCreateTableHeaderAction('delete')    
        table_header_row.append(delete_header_column)
    }
    
    if(table.expansion.expansive){
        const expand_header_column = onCreateTableHeaderAction("expand")
        table_header_row.append(expand_header_column)
    }

    if(table.selection.selectable){
        const select_header_column = onCreateTableHeaderAction("select")
        table_header_row.append(select_header_column)
    }

    for(const info of data){
        const table_data_row = document.createElement("tr");
        info.forEach((data_info)=>
            {
                if(!data_info.toString().includes("_decode")){
                    const table_data = document.createElement("td");                
                    table_data.innerHTML = data_info
                    table_data_row.append(table_data)
                }
            }
        )
        let sub_table = null;
        document_structure.body.append(table_data_row)
        if(table.expansion.expansive){
            const table_expand_row = document.createElement("tr");
            table_expand_row.setAttribute("class","expand-row")
            sub_table = document.createElement("table")
            sub_table.setAttribute("class","sub-table")
            const sub_table_caption = document.createElement("caption")
            const sub_table_type = table_type_list.find((table_item)=>
                table_item.type === table.expansion.expasive_table_type
            )
            sub_table_caption.textContent = "Tabela de "+sub_table_type.title;
            const sub_table_head = document.createElement("thead");
            const sub_table_body = document.createElement("tbody");
            sub_table.append(sub_table_caption)
            sub_table.append(sub_table_head)
            sub_table.append(sub_table_body)
            const table_expand_row_td = document.createElement("td")
            table_expand_row_td.append(sub_table)
            table_expand_row.append(table_expand_row_td)
            table_expand_row_td.setAttribute("colspan",7)
            document_structure.body.append(table_expand_row)
            table_expand_row.style.display = "none"
        }

        const table_id = info.find((data_info)=>
            data_info.includes('_decode')
        ).replace("_decode","")

        if(table.default_actions.edit){
            const edit_column = onCreateTableDataAction('edit',{
                id:table_id,
                table:table.type
            }) 
            table_data_row.append(edit_column)
        }

        if(table.default_actions.delete && !!table.expansion.expansive){
            const delete_column = onCreateTableDataAction('delete',{
                id:table_id,
                table:table.type
            })
            table_data_row.append(delete_column)
        }

        if(table.expansion.expansive){
            const expand_column = onCreateTableDataAction('expand',{
                id:table_id,
                sub_table:sub_table,
                table:table.type
            }) 
            
            table_data_row.append(expand_column)
        }

        if(table.selection.selectable){
            const select_column = onCreateTableDataAction("select",{
                id:table_id,
                table:table.type
            })
            table_data_row.append(select_column)
        }

    }

    

}

const onDeleteTable = (document_structure)=>{

    document_structure.head.innerHTML = "";
    document_structure.body.innerHTML = "";
    return

}

const onResetTable = (document_structure)=>{
    onDeleteTable(document_structure);
    variation_list.length = 0;
    const variation_quantity_container = document.querySelector(".sale-product-quantity-container>.quantity-container>span")

    variation_quantity_container.textContent = variation_list.length
    setTimeout(()=>{
        onQueryTableStructure()
    },1000)
    
    return
}

const onToggleTableType = (type)=>{
    if(type === 'sale'){
        product_table_type_button.classList.add("icon_button_container_disabled")
        sale_table_type_button.classList.remove("icon_button_container_disabled")
        return 
    } 
    if(type === 'product'){
        product_table_type_button.classList.remove("icon_button_container_disabled")
        sale_table_type_button.classList.add("icon_button_container_disabled")
        return 
    }

}

const onChangeTableType = (type)=>{
    const current_url = new URL(window.location.href);
    current_url.searchParams.set('table',type)
    onCreateTableTitle("")

      product_register_button.disabled = (type === 'sale');
    //   product_register_button.classList.toggle("default_button_disabled")
        const sale_register_button = document.querySelector("#sale_register_button");
        sale_register_button.disabled = true;
        // sale_register_button.style.display = 'none';
        // sale_register_button.classList.toggle("default_button_disabled")
    window.history.replaceState({},'',current_url);
    onResetTable({
        head:document.querySelector(".table-head"),
        body:document.querySelector(".table-body")
    })
    return
}
const product_register_button = document.querySelector("#product_register_button")
product_register_button.onclick = ()=>onCoupledDialog("form","product","post")

const sale_product_quantity_container = document.querySelector(".sale-product-quantity-container>button")

sale_product_quantity_container.onclick = ()=>{
    if(variation_list.length){
        onCoupledDialog("list_view","sale_product")
    }
}

const product_table_type_button  = document.querySelector("#product_type_button_container");
const sale_table_type_button  = document.querySelector("#sale_type_button_container");

product_table_type_button.onclick = ()=>{onChangeTableType("product");}
sale_table_type_button.onclick = ()=>{onChangeTableType("sale");}

const onQueryTableStructure = ()=>{

    const url_value = window.location.search;
    const url_params = new URLSearchParams(url_value);

    const table = url_params.get("table")
    
    const table_type = table_type_list.find((table_item)=>
        table_item.type === table
    )

      

    if(!table_type){
        return
    }

    onToggleTableType(table)


    onQuery({
        url:api_endpoints[table].get,
        method:"get"
    },{
        onThen(data){

            onCreateTable({
                head:document.querySelector(".table-head"),
                body:document.querySelector(".table-body")
            },data.header,data.data,table_type)
        }
    })


}

onQueryTableStructure()



export {
    onCreateTable,
    onDeleteTable,
    onResetTable,
    onChangeTableType
}

