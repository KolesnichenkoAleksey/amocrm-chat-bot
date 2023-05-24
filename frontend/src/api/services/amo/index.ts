import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import IPipeline from './../../../types/Pipeline';

export const Points = {
    GetPipelines: '/v4/leads/pipelines',
}

const AmoServices = {
    getPipelines: createAsyncThunk('pipelines/getAll', async (subdomain: string) => {
        const $api = axios.create({    
            baseURL: `https://${subdomain}.amocrm.ru/api`,
        })
        const response = await $api.get(Points.GetPipelines);
        return response.data._embedded.pipelines as IPipeline[];
    }),
}

export default AmoServices