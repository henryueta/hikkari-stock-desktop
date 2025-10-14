
const storage = {

    onGet(key){
        return sessionStorage.getItem(key)
    },
    onSet(key,value){
        return sessionStorage.setItem(key,value)
    },
    onRemove(key){
        return sessionStorage.removeItem(key)
    }

}

export {
    storage
}