const { ownchannelId } = require('./config.json')
const { msgLogger } = require('./helper');
const { startAutoCatch } = require('./task');

function boot(client) {
	ownchannel = client.channels.cache.get(ownchannelId);


	const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  (async () => {
    try {
    	msgLogger("auto start!!")
      startAutoCatch(client);

      await delay(1000);
      await ownchannel.send(";fa");

    } catch (err) {
      console.error("❌ 發送指令失敗:", err);
    }
  })();

}

module.exports = { boot };