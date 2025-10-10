
const onValidateDefault = (data)=>{

        for(const data_item of data){

        const current_data_item = Object.entries(data_item)
        if(!current_data_item[0][1]){
            return {
                isValid:false,
                field:current_data_item[0][0]
            }
        }

        return {
            isValid:true,
            field:null
        }
    }

}

export {
    onValidateDefault
}