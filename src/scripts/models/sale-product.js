const sale_product_form = [
    {
        id:"identifier_id",
        registerId:"identifier",
        tag:"input",
        title:"",
        type:"hidden",
    },
    {
        id:"product_id",
        registerId:"product_id",
        tag:"select",
        title:"Produto",
        type:"text",
        needQuery:true
    },
    {
        id:"variations_id",
        registerId:"variations_id",
        tag:"",
        title:"Variações",
        type:"text",
        table:"sale_variation"
    }
]

export {
    sale_product_form
}
