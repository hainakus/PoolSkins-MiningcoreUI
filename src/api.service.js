const   axios  = require("axios");
const { defer, map, of } = require("rxjs");




axios.defaults.baseURL = 'http://hydranetwork.online:4000/api/pools/nexa1';

 const minerList = () => defer( () => axios.get('/miners')).pipe(map( (axiosResponse) => axiosResponse.data ))

 const poolStats = () => defer( () => axios.get('/performance')).pipe(map( (axiosResponse) => axiosResponse.data ))

 const miner = (wallet) => defer( () => axios.get('/miners/'+ wallet)).pipe(map( (axiosResponse) => axiosResponse.data ))

 const statistics = () => defer( () => axios.get('/performance')).pipe(map( (axiosResponse) => axiosResponse.data ))

 const blocks = () => defer( () => axios.get('/blocks')).pipe(map( (axiosResponse) => axiosResponse.data ))

 const payments = () => defer(() => axios.get('/payments')).pipe(map( (axiosResponse) => axiosResponse.data ))




module.exports = { minerList,poolStats, miner, statistics, blocks }
