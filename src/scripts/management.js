import { api_endpoints } from "./config/config.js";
import { onQuery } from "./fetch.js";
import { table_type_list } from "./objects/table.js";
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

const onCreateDefaultTableDataAction = (title,onclick)=>{
    const default_data_column = document.createElement('td');
    const default_data_button = document.createElement("button");
    default_data_button.innerHTML = title;
    default_data_button.onclick = ()=>onclick();
    default_data_column.append(default_data_button)
    return default_data_column
}


const onCreateTableDataAction = (type,params)=>{
    
    const valid_type = {
        "edit":()=>{
            return onCreateDefaultTableDataAction(
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
                "Deletar",
                    ()=>console.log(params.id)
            )
        },
        "expand":()=>{
             let button_toggle = false;
            return onCreateDefaultTableDataAction(
                "Expandir",
                    ()=>{
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
                            const sub_table_data = document.createElement("td")
                            sub_table_data.setAttribute("class","expand-data")
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
                            params.sub_table.append(sub_table_data)
                            return
                        }
                        table_head.innerHTML = "";
                        table_body.innerHTML = "";
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

const onCreateTable = (document_structure,header,data,table)=>{

    const table_header_row = document.createElement("tr");

    for(const title of header){
        if(title !== 'id' && !title.includes("_id")){
            const table_header = document.createElement("th");
            table_header.innerHTML = title
            table_header_row.append(table_header)
        }
    }
    

    document_structure.head.append(table_header_row)

    if(table.default_actions.edit){
        const edit_header_column = onCreateTableHeaderAction('edit')
        table_header_row.append(edit_header_column)
    }

    if(table.default_actions.delete){
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
            const sub_table_head = document.createElement("thead");
            const sub_table_body = document.createElement("tbody");
            sub_table.append(sub_table_head)
            sub_table.append(sub_table_body)
            table_expand_row.append(sub_table)
            document_structure.body.append(table_expand_row)
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

        if(table.default_actions.delete){
            const delete_column = onCreateTableDataAction('delete',{
                id:table_id
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
    setTimeout(()=>{
        onQueryTableStructure()
    },1000)
    return
}

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
    onResetTable
}

