const sale_form = [
    {
        id:"client_name_id",
        registerId:"client_name",
        tag:"input",
        title:"Nome do cliente",
        type:"text",
    },
    {
        id:"type_id",
        registerId:"type",
        tag:"select",
        title:"Tipo de venda",
        type:"text",
        options:[
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
        id:"products_id",
        tag:"",
        type:"form",
        title:"Produtos",
        table:"sale_product"
    }
]

export {
    sale_form
}