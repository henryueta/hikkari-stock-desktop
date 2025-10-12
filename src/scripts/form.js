import { table_type_list } from "./objects/table.js";



const onGetTableType = ()=>{
    const url_value = window.location.search;
    const url_params = new URLSearchParams(url_value);

    const table = url_params.get("table")
    return table
}

const onCreateFieldList = ()=>{

     const coupled_form_button  = document.createElement("button")
    coupled_form_button.setAttribute("type","button")
    coupled_form_button.innerHTML = 
    `Adicionar ${field_item.title}`
    field_container.append(coupled_form_button)

    coupled_form_button.addEventListener("click",()=>{
        onCreateForm(field_item.table,dialog)
    })

}


const onDeleteField = (field_container)=>{

    const delete_button = document.createElement('button');
    delete_button.innerHTML = "Deletar "+qnt
    delete_button.setAttribute("type","button")
    delete_button.setAttribute("value",qnt)
    delete_button.setAttribute("id","field_delete_button")
    field_container.append(delete_button)
            
    delete_button.addEventListener("click",()=>{
    const list_field_elements = field_container.parentElement.querySelectorAll("div") 

        field_container.parentElement
        .removeChild(list_field_elements[
           delete_button.value
        ])
        // field_container.querySelectorAll("input").forEach((field_input)=>field_input.value = "deletaod")
                
        list_field_elements.forEach((field_item)=>{
                    
            // list_field_elements.removeChild(list_field_elements.children[])
                    
            const field_button = field_item.querySelector("button")
            if(field_button.value > delete_button.value
                        &&
                        list_field_elements.length > 1
                ){
                        field_button.value -=1
                        field_button.innerHTML = (field_button.value)
                }
        })


        qnt--;
    })

}

let qnt = -1;

const onFormatDefaultListValue = (defaultValues,field_id)=>{

    const default_items = defaultValues[field_id].map((default_item)=>Object.entries(default_item))

    const formated_default_values = default_items.flatMap((item,index)=>item.reduce((default_acc,default_item)=>{
                    
        default_acc[default_item[0]] = default_item[1];
        return default_acc

    },{}))

    const acoupled_default_values = Object.assign({},...formated_default_values) 


    return acoupled_default_values

}

const onDeleteForm = ()=>{

    qnt = -1 ;

}

const onCreateForm = (
    table,
    field_container,
    handleSubmit,
    forList,
    defaultValues,
    maxNumberValues
)=>{
    const form = document.querySelector(".form-container>form")
    const form_title = document.querySelector(".form-container>.title-container")
    const dialog = document.querySelector(".dialog")
    const dialog_title = document.querySelector(".dialog>.title-container")

    if(!table){
        return
    }



    const table_form = table_type_list
    .find((table_item)=>table_item.type === table)
    table_form.form.forEach((field_item)=>{

        if(!field_item.tag && field_item.table && !field_item.isFromFieldArray){
            const coupled_field_list = document.createElement("div");
            coupled_field_list.setAttribute("class","coupled-field-list-container")
            field_container.append(coupled_field_list)
            
            if(!!field_item.table_actions.insert){

            const coupled_content = document.createElement("div");
            coupled_content.setAttribute("class","coupled-container")
            coupled_content.innerHTML = "Coupled"
            const coupled_form_button  = document.createElement("button")
            coupled_form_button.setAttribute("type","button")
            coupled_form_button.innerHTML = 
            `Adicionar ${field_item.title}`
            coupled_content.append(coupled_form_button)
            field_container.append(coupled_content)

                coupled_form_button.addEventListener("click",()=>{

                    qnt++; 
                    const list_item_container = document.createElement("div")
                    list_item_container.setAttribute("class","field-list-item-container")
                    coupled_field_list.append(list_item_container)
                    onCreateForm(
                        field_item.table,
                        list_item_container,
                        null,
                        true,
                        null)
                })
            }

            if(defaultValues) {

                for(const default_field_item of defaultValues[field_item.id]){
                qnt++;
                const list_item_container = document.createElement("div")
                list_item_container.setAttribute("class","field-list-item-container")
                coupled_field_list.append(list_item_container)

               onCreateForm(
                    field_item.table,
                    list_item_container,
                    null,
                    true,
                    (
                        !!defaultValues
                        ? default_field_item
                        : []
                    ),
                    (
                        !!maxNumberValues
                        ? maxNumberValues
                        :[]        
                    ))

                } 
            }

            return
        }

     

        if(field_item.isFromFieldArray){
            const coupled_form_button  = document.createElement("button")
            coupled_form_button.innerHTML = 
            `Adicionar ${field_item.title+(qnt)}`
            coupled_form_button.setAttribute("type","button")
            field_container.append(coupled_form_button)

            return
        }
        const table_field = document.createElement("label")
        const current_default_index = (
            !!defaultValues
            &&
            !!forList
            ? table+"_"+field_item.id+"_"+qnt
            : field_item.id
        )

        const current_default_value = (!!defaultValues 
        ? (!!defaultValues[current_default_index]
            ? defaultValues[current_default_index]
            : ""
            ) 
        : "");

        
        const current_number_max_value = (!!maxNumberValues
        ? (!!maxNumberValues[current_default_index]
            ? maxNumberValues[current_default_index]
            : ""
        )    
        : "")
        
        table_field.innerHTML = 
        `<p>
            ${field_item.title}
        </p>
        <${field_item.tag}
            ${
                field_item.tag !== 'p' || field_item.tag !== 'span'
                ?   (
                    `type=${field_item.type}
                    id=${table+"_"+field_item.id+"_"+qnt}
                    value="${current_default_value}"
                    max="${current_number_max_value}"
                    min="${0}"
                    placeholder="${(
                        current_number_max_value 
                        ? "Máx: "+current_number_max_value 
                        : ""
                    )}""`
                    )
                : ""
            }
        >
            ${(field_item.tag === 'p' || field_item.tag === 'span')
                ? 
                current_default_value
                :
                ""
            }
            ${(field_item.tag === 'select' && field_item.options)
                ?
                field_item.options.map((option_item)=>
                {
                    return `<option value=${option_item.value}>${option_item.label}</option>`
                }
                )
                :
                ""
            }
        </${field_item.tag}>`
        field_container.append(table_field)
        
    })

        if(forList){
            onDeleteField(field_container)
            return 
        }



        field_container.addEventListener("submit",(e)=>{
            e.preventDefault()
           if(handleSubmit){

            const form_input_data = field_container.querySelectorAll("input") 
            const form_select_data = field_container.querySelectorAll("select")
            const form_data_values = (()=>{
                const formated_input_data = Array.from(form_input_data).map((data_item)=>
                {
                    return {
                        [data_item.id]:data_item.value
                    }
                }
                )
                const formated_select_data = Array.from(form_select_data).map((data_item)=>
                {
                    return {
                        [data_item.id]:data_item.value
                    }
                }
                )
                return [...formated_input_data,...formated_select_data]
            })()
            handleSubmit(form_data_values)

           }
            
        })

        const submit_button = document.createElement("button");
        submit_button.setAttribute("type","submit");
        submit_button.innerHTML = "Enviar";
        field_container.append(submit_button)

}



export {
    onCreateForm,
    onDeleteForm
}