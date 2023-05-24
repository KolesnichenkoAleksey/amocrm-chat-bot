import { RootState } from '../index';

export const getPipelines = (state:RootState) => state.amoConstants.PIPELINES;
export const getSubdomain = (state:RootState) => state.amoConstants.SUBDOMAIN
