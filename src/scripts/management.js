import { api_endpoints } from "./config/config.js";
import { onQuery } from "./fetch.js";
import { table_type_list } from "./objects/table.js";
import { onCoupledDialog } from "./test.js";

const onCreateTableHeaderAction = (type)=>{

    const valid_type = {

        "edit":()=>{
            const edit_header_title = document.createElement("th");
            edit_header_title.innerHTML = "Edição";
            return edit_header_title
        },
        "delete":()=>{
            const delete_header_title = document.createElement("th");
            delete_header_title.innerHTML = "Remoção";
            return delete_header_title
        }

    }

    return valid_type[type]()

}

const onCreateTableDataAction = (type,params)=>{

    const valid_type = {
        "edit":(id)=>{
            const edit_data_column = document.createElement('td')
            const edit_data_button = document.createElement("button")
            edit_data_button.innerHTML = "Editar"
            edit_data_button.onclick = ()=>onCoupledDialog(
                'form',
                params.table,
                'put',
                params.id
            )
            edit_data_column.append(edit_data_button)
            return edit_data_column
        },
        "delete":(id)=>{
            const delete_data_column = document.createElement('td')
            const delete_data_button = document.createElement("button")
            delete_data_button.innerHTML = "Deletar"
            delete_data_button.onclick = ()=>console.log(params.id)
            delete_data_column.append(delete_data_button)
            return delete_data_column
        }
    }

    return valid_type[type](params)

}

const onCreateTable = (header,data,table)=>{

    const table_head = document.querySelector(".table-head");
    const table_body = document.querySelector(".table-body");

    const table_header_row = document.createElement("tr");

    for(const title of header){
        if(title !== 'id'){
            const table_header = document.createElement("th");
            table_header.innerHTML = title
            table_header_row.append(table_header)
        }
    }
    const edit_header_column = onCreateTableHeaderAction('edit')
    const delete_header_column = onCreateTableHeaderAction('delete')

    table_head.append(table_header_row)
    table_header_row.append(edit_header_column)
    table_header_row.append(delete_header_column)


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
        table_body.append(table_data_row)

        const table_id = info.find((data_info)=>
            data_info.includes('_decode')
        ).replace("_decode","")

        const edit_column = onCreateTableDataAction('edit',{
            id:table_id,
            table:table
        }) 
        table_data_row.append(edit_column)
        const delete_column = onCreateTableDataAction('delete',{
            id:table_id
        })
        table_data_row.append(delete_column)

    }

    

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
            onCreateTable(data.header,data.data,table)
        }
    })


}

onQueryTableStructure()


