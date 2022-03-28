import axios, { AxiosResponse } from "axios";
import { defer, map, of } from "rxjs";

axios.defaults.baseURL = 'https://marketcloudis.ml/api';

export const minerList = () => defer( () => axios.get('/pools/clo1/miners')).pipe(map( (axiosResponse: AxiosResponse) => axiosResponse.data ))

export const poolStats = () => defer( () => axios.get('/pools/clo1/performance')).pipe(map( (axiosResponse: AxiosResponse) => axiosResponse.data ))

export const miner = (wallet: string) => defer( () => axios.get('/pools/clo1/miners/'+ wallet)).pipe(map( (axiosResponse: AxiosResponse) => axiosResponse.data ))

export const statistics = () => defer( () => axios.get('/pools')).pipe(map( (axiosResponse: AxiosResponse) => axiosResponse.data ))



export const getErgoPrice = () => {
  const headers = {
    'Content-Type': 'application/json',
    "X-CoinAPI-Key": "5A157120-8DB8-49B4-8A4D-1225B8F24EF4",
  }

  return defer(() => axios.get('https://rest.coinapi.io/v1/exchangerate/ERG/USD ', { headers })).pipe(map ((axiosResponse: AxiosResponse) => axiosResponse.data ))


}
