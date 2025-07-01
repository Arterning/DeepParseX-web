
import axios from 'axios';
import qs from 'query-string';

export interface SysDocReq {
  name: string;
  title?: string;
  source?: string;
  desc?: string;
  content?: string;
  type?: string;
  file?: string;
  doc_data?: Record<string, any>[];
  tags?: string [];
}



export interface SysDocRes extends SysDocReq {
  id: number;
  created_time: string;
  created_user?: string;
  size: number;
  status?: number;
}


export interface SysDocListRes {
  items: SysDocRes[];
  total: number;
}

export interface SysDocParams {
  name?: string;
  title?: string;
  query?: string;
  tokens?: string;
  likeq?: string;
  content?: string;
  type?: string;
  page?: number;
  size?: number;
}


export function querySysDocList(params: SysDocParams): Promise<SysDocListRes> {
  return axios.get('/api/v1/sys/docs', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}