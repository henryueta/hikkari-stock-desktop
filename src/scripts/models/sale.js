const sale_form = [
    {
        id:"client_name_id",
        tag:"input",
        title:"Nome do cliente",
        type:"text",
    },
    {
        id:"client_location_id",
        tag:"input",
        title:"Localidade do cliente",
        type:"text"
    },
    {
        id:"sale_creation_date_id",
        tag:"input",
        title:"Dada de emissão",
        type:"date"
    },
    {
        id:"initial_price_id",
        tag:"input",
        title:"Preço inicial",
        type:"number"
    },
    {
        id:"final_price_id",
        tag:"input",
        title:"Preço final",
        type:"number"
    },
    {
        id:"type_id",
        tag:"select",
        title:"Tipo de venda",
        type:"text",
        options:[
            {
                label:"Selecione",
                value:""
            },
            {
                label:"Mercado livre",
                value:"ML"
            },
            {
                label:"Shopee",
                value:"SH"
            }
        ],
    },
    {
        id:"delivery_type_id",
        tag:"select",
        title:"Tipo de entrega",
        type:"text",
        options:[
            {
              label:"Selecione",
              value:""  
            },
            {
                label:"Comum",
                value:"COMMON"
            },
            {
                label:"Flex",
                value:"FLEX"
            }
        ]
    },
    {
        id:"products_id",
        tag:"",
        type:"form",
        title:"Produtos",
        table:"sale_product",
        table_actions:{
            insert:false,
            delete:true
        }
    }
]

export {
    sale_form
}