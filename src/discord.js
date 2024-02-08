const { blocks, minerList, poolStats } = require("./api.service");
const { firstValueFrom } = require( "rxjs");
const _formatter = (value, decimal, unit) => {
  if (value === 0) {
    return "0 " + unit;
  } else {
    var si = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" },
      { value: 1e21, symbol: "Z" },
      { value: 1e24, symbol: "Y" }
    ];
    for (var i = si.length - 1; i > 0; i--) {
      if (value >= si[i].value) {
        break;
      }
    }
    return ((value / si[i].value).toFixed(decimal).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + " " + si[i].symbol + unit);
  }
}

const {MessageBuilder} = require("discord-webhook-node");

const { Webhook } = require('discord-webhook-node');
const hook = new Webhook("https://discord.com/api/webhooks/1163050029028757515/3eTbC2kbHBS_7H1lis7-1FcZAT1jjTz17gQkJmbu0V_zKBrecEDE5dRkAwh9Nep1Omfm");

const IMAGE_URL = 'https://solopool.org/public/icons/alph.png';
hook.setUsername('ALPH Pool Bot');
hook.setAvatar(IMAGE_URL);

const sendPoolInfo = async () => {
  const poolHashrate = () => firstValueFrom(poolStats())
  const totalFoundBlocks = () => firstValueFrom(blocks())
  const totalActivePoolMiners = () => firstValueFrom(minerList())
  const poolHashString = _formatter((await poolHashrate()).stats.reverse()[0].poolHashrate, 5, "H/s")
  const blocksNumber = (await totalFoundBlocks()).length
  console.log(blocksNumber)
  const totalActiveMiners = (await totalActivePoolMiners()).reduce( (acc, value) => {
    return (value.hashrate > 0) ? acc + 1: acc;
  }, 0)
  const embed = new MessageBuilder()
    .setTitle('ALPH Pool Status')
    .addField('Pool HashRate', `${poolHashString}`, true)
    .addField('Total Blocks', `${blocksNumber ? blocksNumber : 0}`)
    .addField('Total Miners', `${totalActiveMiners}`)
    .setThumbnail(IMAGE_URL)
    .setDescription('Oh yeah Nexa!!!')
    .setTimestamp();

  hook.send(embed).then(console.log);
}


 const initDiscord = () =>
  setInterval( async () => {
    await sendPoolInfo()
  }, 1000 * 60 * 5 )


initDiscord()
