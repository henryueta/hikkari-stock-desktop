
import { html } from "./document.js"
import {onQuery} from "./fetch.js"
import { storage } from "./session-storage.js"
import { onCheckToken } from "./token.js"


const onAuth = ()=>{

    const username_field = document.querySelector("#username")
    const password_field = document.querySelector("#password")

    onQuery({
        url:"http://localhost:2050/auth/post",
        method:"post",
        body:{
            username:username_field.value,
            password:password_field.value
        }
    },{
        onThen(data){
            if(data){
                storage.onSet("token",data.token)

               onCheckToken()
            }
        }
    })

}



export {
    onAuth
}




