import { storage } from "./local-storage.js"

const onCheckToken = ()=>{

    const local_token = storage.onGet("token")

    if(!local_token){
        return  
    }

    return window.location.href = "./public/pages/management.html?table=product"

}

export {
    onCheckToken
}