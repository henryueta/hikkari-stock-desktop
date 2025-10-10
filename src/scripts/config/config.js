import { storage } from "../local-storage.js"

const main_endpoint = "http://localhost:2050/"

const token = storage.onGet("token")

const token_url_param = "?token="+token

const api_endpoints = {

    product:{
        post:main_endpoint+"product/post"+token_url_param,
        get:main_endpoint+"product/get"+token_url_param,
        get_id:main_endpoint+"product/get-id"+token_url_param,
        put:main_endpoint+"product/put"+token_url_param
    }

}

export {
    api_endpoints
}