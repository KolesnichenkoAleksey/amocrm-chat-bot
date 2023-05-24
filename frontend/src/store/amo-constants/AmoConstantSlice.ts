import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AmoServices from "../../api/services/amo";
import IAmoConstants from '../../types/AmoConstants';
import IPipeline from '../../types/Pipeline';

const initState: IAmoConstants = {
    SUBDOMAIN: '',
    PIPELINES: []
}


export const AmoConstantSlice = createSlice({
    name: 'amoConstants',
    initialState: initState,
    reducers: {
        setSubdomain(state, action: PayloadAction<string>) {
            state.SUBDOMAIN = action.payload
        },
        setPipelines(state, action: PayloadAction<IPipeline[]>) {
            state.PIPELINES = action.payload
        },
    },
    extraReducers(builder) {
        builder
            .addCase( AmoServices.getPipelines.fulfilled, (state, action) => {
                state.PIPELINES = action.payload;
            })
    },
})

export const { setSubdomain, setPipelines } = AmoConstantSlice.actions;

export default AmoConstantSlice.reducer;