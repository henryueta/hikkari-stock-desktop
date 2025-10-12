
const onValidateSale = (data)=>{
    console.log(data)

    const product_data_items = data
    .filter((data_item)=>data_item[0].includes('sale_product'))
    const product_formated_data = [];
        for(let i=0;i < (product_data_items.length / 3); i++){
            const formated_product_items = product_data_items
            .filter((product_item)=>
            {   
                return (product_item[0].includes(i))
            })
            .map((product_item)=>
            {
                let formated_product_item = product_item[0]
                    .replace("sale_product_","")
                    .replace("_"+i,"");
                if(product_item[0].includes("quantity")){
                    formated_product_item = formated_product_item.replace("_id","")
                }

                return {
                    [
                    formated_product_item
                    ]:product_item[1]
                }
            }
            )


            product_formated_data.push(Object.assign({},...formated_product_items))

        }

    const sale_data = {
        sale_type:data
        .find((data_item)=>data_item[0].includes('type_id'))[1],
        sale_delivery_type: data
        .find((data_item)=>data_item[0].includes('delivery_type_id'))[1],
        initial_price:data
        .find((data_item)=>data_item[0].includes('initial_price_id'))[1],
        final_price:data
        .find((data_item)=>data_item[0].includes('final_price_id'))[1],
        client_name:data
        .find((data_item)=>data_item[0].includes('client_name_id'))[1],
        client_location:data
        .find((data_item)=>data_item[0].includes('client_location_id'))[1],
        products:product_formated_data
    };

    return sale_data;
}

export {
    onValidateSale
}