import { product_form } from "../models/product.js"
import { onValidateDefault } from "./default-validation.js"



const onValidateProduct = (data)=>{
    console.log(data)
    const product_data = {

                description:data
                .find((data_item)=>data_item[0].includes('description_id'))[1],

                cod:data
                .find((data_item)=>data_item[0].includes('cod'))[1],

                variations:(()=>{

                const variation_data_items = data
                .filter((data_item)=>data_item[0].includes('variation'))
                const variation_formated_data = [];
                for(let i=0;i < (variation_data_items.length / 3); i++){

                    const formated_variation_items = variation_data_items
                    .filter((variation_item)=>
                    {   
                        return (variation_item[0].includes(i))
                    })
                    .map((variation_item)=>
                    {
                        return {
                            [variation_item[0]
                            .replace("variation_","")
                            .replace("_"+i,"")
                            .replace("_id","")
                            ]:variation_item[1]
                        }
                    }
                    )


                    variation_formated_data.push(Object.assign({},...formated_variation_items))
                console.log(formated_variation_items)

                }

                // for(let i=0;i < (variation_data_items.length / 3); i++){
                //     console.log(variation_item[0].includes(i))
                // }
                
                return variation_formated_data
                })()
            }

    return product_data

}
export {
    onValidateProduct
}