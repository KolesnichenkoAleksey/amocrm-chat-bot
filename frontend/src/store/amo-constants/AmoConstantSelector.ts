import { RootState } from '../index';

export const getPipelines = (state:RootState) => state.amoConstants.pipelines;
export const getSubdomain = (state:RootState) => state.amoConstants.subdomain;
