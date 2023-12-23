export namespace PoolService {
  let base_url = 'nexa1';
  export const setApi = (value:string) => {
    base_url = value
  }
  export const getapi = () => {
    return base_url;
  }
}
