const { Client } = require('discord.js-selfbot-v13');
const { token, guildId, ownChannelId, boostChannelId } = require('./config.json');
const { checkMessageCreate, checkMessageUpdate } = require('./task');
const helper = require('./helper');

const client = new Client();
client.on('ready', async () => {
  let welcomeMsg = `
                                                 
    ___            _                                   
   | _ \\   ___    | |__    ___    _ __     ___    _ _    
   |  _/  / _ \\   | / /   / -_)  | '  \\   / _ \\  | ' \\   
  _|_|_   \\___/   |_\\_\\   \\___|  |_|_|_|  \\___/  |_||_|  
_| """ |_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""| 
"\`-0-0-'"\`-0-0-'"\`-0-0-'"\`-0-0-'"\`-0-0-'"\`-0-0-'"\`-0-0-' 
                                                                                     
 `
  console.log(welcomeMsg);
  console.log(client.user.username);
  ownChannel = client.channels.cache.get(ownChannelId);
})

client.on('messageCreate', async (message) => {
  if (message.channelId != boostChannelId && message.guildId != guildId) return;
  checkMessageCreate(message, client);

})

client.on('messageUpdate', async (oldMessage, newMessage) => {
  if (newMessage.channelId != boostChannelId && newMessage.guildId != guildId) return;

  // 把舊的和新的 embed description 抓出來
  const oldDesc = oldMessage.embeds?.[0]?.description ?? "";
  const newDesc = newMessage.embeds?.[0]?.description ?? "";

  // 只有在 desc 改變時才處理
  if (oldDesc === newDesc) return;
  
  checkMessageUpdate(newMessage, client);
});


client.login(token).catch(reason => { console.log(reason); process.exit(0); });