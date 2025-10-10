

const onQuery = async (params,treatment)=>{

    await fetch(params.url,{
        method:params.method.toUpperCase(),
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(params.body)
    })
    .then((res)=>res.json())
    .then(res=>{

        if(treatment &&  !!treatment.onThen){
            treatment.onThen(res.data)
        }
    })
    .catch((error)=>{

        if(treatment && !!treatment.onCatch){
            treatment.onCatch(error)
        }

        console.error(error)
    })
    .finally(()=>{

        if(treatment && !!treatment.onFinally){
            treatment.onFinally()
        }

    })

}

export {
    onQuery
}