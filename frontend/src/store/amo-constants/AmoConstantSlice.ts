import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AmoServices from "../../api/services/amo";
import IAmoConstants from '../../types/AmoConstants';
import IPipeline from '../../types/Pipeline';

const initState: IAmoConstants = {
    subdomain: '',
    pipelines: [],
    accountId: 0,
}


export const AmoConstantSlice = createSlice({
    name: 'amoConstants',
    initialState: initState,
    reducers: {
        setSubdomain(state, action: PayloadAction<string>) {
            state.subdomain = action.payload
        },
        setPipelines(state, action: PayloadAction<IPipeline[]>) {
            state.pipelines = action.payload
        },
        setAccountId(state, action: PayloadAction<number>) {
            state.accountId = action.payload
        }
    },
    extraReducers(builder) {
        builder
            .addCase( AmoServices.getPipelines.fulfilled, (state, action) => {
                state.pipelines = action.payload;
            })
    },
})

export const { setSubdomain, setPipelines, setAccountId } = AmoConstantSlice.actions;

export default AmoConstantSlice.reducer;