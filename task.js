const helper = require('./helper');

function safeSend(channel, content) {
  return channel.send(content).catch(err => {
    helper.msgLogger(`❌ Failed to send "${content}" to channel ${channel.id}:`);
    helper.msgLogger(err);
  });
}

async function tryClickButton(message, pos = {X: 0, Y: 0}, retries = 5, delayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      await message.clickButton(pos);
      helper.msgLogger(`✅ Do button click success on try #${i + 1}`);
      return true;
    } catch (err) {
      helper.msgLogger(`⚠️ Do button click failed on try #${i + 1}`);
      helper.msgLogger(err);

      // 若錯誤為 Unknown Message，可立即跳出重試
      if (err.code === 10008) {
        helper.msgLogger("⛔ Message 已不存在，停止重試");
        return false;
      }
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs)); // 等待一下再重試
      }
    }
  }
  helper.msgLogger('❌ All retries for button click failed');
  return false;
}

async function checkMessageCreate(message, client){
  let [title, desc, embedAuthor, footer] = helper.messageExtractor(message);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  let rarity = ''
  let streak = ''

  if (message.type == 'REPLY' && message.mentions.repliedUser?.username == client.user.username) {
    if (desc.includes("found a wild")){
      rarity = helper.extractPokemonRarity(footer)
      streak = helper.extractStreak(footer)
      helper.msgLogger(`Rarity wild pokemon is ${rarity}`)
      await delay(1000);
      catchPokemon(message, rarity, streak)
    }
  }
}

async function checkMessageUpdate(message, client){
  let [title, desc, embedAuthor, footer] = helper.messageExtractor(message);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  if (message.type == 'REPLY' && message.mentions.repliedUser?.username == client.user.username) {
    if (desc.includes("Oh! A bite!")) {
      helper.msgLogger("Oh! A bite!!")
      await delay(400);
      tryClickButton(message);
    }
    if (desc.includes("fished a wild")){
      await delay(1000);
      catchFish(message)
    }
    if (footer.includes("Balls left")) {
      ballsLeft = helper.parseBalls(footer)
      Object.entries(ballsLeft).forEach(([ball, count]) => {
        helper.msgDebugger(`${ball}: ${count}`)
      });
      if (ballsLeft["Pokeball"] <= 10) {
        helper.msgLogger("Pokeball is already used up, will buy balls automatically")
        await delay(2500);
        const channel = client.channels.cache.get(message.channelId);
        safeSend(channel, ";s b 1 100")
      }
    }
  }
}

async function catchPokemon(message, rarity, streak) {
  const rarityBallMap = {
    Common: 'pb',
    Uncommon: 'pb',
    Rare: 'pb',
    SuperRare: 'ub',
    Legendary: 'mb',
    Shiny: 'mb',
  };
  const rarityBallWithStreakMap = {
    Common: 'gb',
    Uncommon: 'gb',
    Rare: 'gb',
    SuperRare: 'prb',
    Legendary: 'mb',
    Shiny: 'mb',
  };
  const rarityStreakMap = {
    Common: 15,
    Uncommon: 10,
    Rare: 5,
    SuperRare: 5,
  }

  let buttons = message.components?.[0]?.components ?? [];

  helper.msgDebugger(`${rarity} streak = ${streak}`)

  let bIndex = ''
  if (streak % rarityStreakMap[rarity] == rarityStreakMap[rarity]-1) {
    bIndex = buttons.findIndex(b => b.customId === rarityBallWithStreakMap[rarity]);
  } else {
    bIndex = buttons.findIndex(b => b.customId === rarityBallMap[rarity]);
  }
  helper.msgDebugger(`bIndex = ${bIndex}`)

  if (bIndex !== -1) {
    const posY = Math.floor(bIndex / 5); // 行
    const posX = bIndex % 5;             // 列
    const pos = {X: posX, Y: posY}
    tryClickButton(message, pos)
  } else {

  }
}

async function catchFish(message) {
  let buttons = message.components?.[0]?.components ?? [];
  let bIndex = ''
  bIndex = buttons.findIndex(b => b.customId === 'pb_fish');
  helper.msgDebugger(`bIndex = ${bIndex}`)

  if (bIndex !== -1) {
    const posY = Math.floor(bIndex / 5); // 行
    const posX = bIndex % 5;             // 列
    const pos = {X: posX, Y: posY}
    tryClickButton(message, pos)
  }
}

module.exports = { tryClickButton, checkMessageCreate, checkMessageUpdate };