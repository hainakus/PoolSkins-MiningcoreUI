export namespace PoolService {
  let base_url = 'Pool-Neoxa';
  export const setApi = (value:string) => {
    base_url = value
  }
  export const getapi = () => {
    return base_url;
  }
}