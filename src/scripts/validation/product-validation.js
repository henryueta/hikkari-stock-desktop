import { product_form } from "../models/product.js"
import { onValidateDefault } from "./default-validation.js"



const onValidateProduct = (data)=>{

    // if(!data['description']){
    //     return {
    //         isValid:true,
    //         message:"Campo"
    //     }
    // }

    const default_validate = onValidateDefault(data)

    if(!default_validate.isValid){
        
        const teste =product_form.find((product_item)=>
        {   

            return product_item.id.includes(default_validate.field)
        }
        )


    }

    return {
        isValid:true,
        message:""
    }

}
export {
    onValidateProduct
}