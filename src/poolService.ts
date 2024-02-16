import axios from "axios";
import { environment } from "./environment.prod";

export namespace PoolService {
  let base_url = 'kaspa';
  export const setApi = (value:string) => {
    base_url = value
    axios.defaults.baseURL = environment.apiUrl + '/api/pools/' + PoolService.getapi();
  }
  export const getapi = () => {
    return base_url;
  }
}
