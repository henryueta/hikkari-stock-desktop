import { onAuth } from "./auth.js"
import { onCheckToken } from "./token.js"

onCheckToken()

document.querySelector("#authSubmitButton").addEventListener('click',()=>{
    onAuth()
})