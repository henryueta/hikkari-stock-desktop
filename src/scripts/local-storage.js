
const storage = {

    onGet(key){
        return localStorage.getItem(key)
    },
    onSet(key,value){
        return localStorage.setItem(key,value)
    },
    onRemove(key){
        return localStorage.removeItem(key)
    }

}

export {
    storage
}