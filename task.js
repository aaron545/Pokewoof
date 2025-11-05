const helper = require('./helper');
const { CaptchaAI } = require('./captcha.js');
const { mustCatch, teamName, autoCatchchannelId, authorWhiteList } = require('./config.json');

// for buying more balls automatically
const ballConfig = [
  { name: "Pokeball", id: 1, threshold: 10, amount: 100 },
  { name: "Greatball", id: 2, threshold: 6, amount: 60 },
  { name: "Ultraball", id: 3, threshold: 3, amount: 30 },
];
// end for buying more balls automatically

// for function catchPokemon

const ballPriority = {
  pb: 2,
  gb: 1,
  ub: 3,
  prb: 4,
  mb: 5,
};

const rarityBallMap = {
  Common: 'gb',
  Uncommon: 'gb',
  Rare: 'gb',
  SuperRare: 'ub',
  Legendary: 'mb',
  Shiny: 'mb',
};
const rarityBallWithStreakMap = {
  Common: 'gb',
  Uncommon: 'gb',
  Rare: 'ub',
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
const rarityBallWithHeldItemMap = {
  Common: 'ub',
  Uncommon: 'ub',
  Rare: 'ub',
  SuperRare: 'prb',
  Legendary: 'mb',
  Shiny: 'mb',
};
const ballNameWithTeamLogoMap = {
  pokeball: 'pb',
  greatball: 'gb',
  ultraball: 'ub',
  premierball: '',
  masterball: '',
};
// end for function catchPokemon

// for function catchFish
const rareList = [
  "Alomomola", "Azumarill", "Corsola", "Dewgong", "Floatzel", 
  "Gastrodon", "Gyarados", "Jellicent", "Kingler", "Lanturn",
  "Lumineon", "Mantine", "Octillery", "Palpitoad", "Seaking",
  "Sharpedo", "Slowbro", "Tentacruel",
];
const superRareList = [
  "Carracosta","Dracovish","Kabutops","Lapras","Omastar",
  "Seismitoad","Wailord","Walrein",
];
const legendaryList = ["Suicune","Kyogre"];

const rareSet = new Set(rareList.map(x => x.toLowerCase()));
const superRareSet = new Set(superRareList.map(x => x.toLowerCase()));
const legendarySet = new Set(legendaryList.map(x => x.toLowerCase()));
// end for function catchFish

let todayBall = '';
let teamLogoId = '';

let wasAutoCatch = false;
let wasAutoFish = false;
let autoCatch = false;
let autoFish = false;

function randomDelay(base, bias = 0) {
  const time = base + bias * (Math.random() * 2 - 1);
  helper.msgDebugger(`sleep time = ${time}`);
  return new Promise(resolve => setTimeout(resolve, time));
}

function safeSend(channel, content) {
  return channel.send(content).catch(err => {
    helper.msgLogger(`❌ Failed to send "${content}" to channel ${channel.id}:`);
    helper.msgLogger(err);
  });
}

async function startAutoCatch(client) {
  const channel = client.channels.cache.get(autoCatchchannelId);
  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  while (true) {
    // 若兩者都關閉，就每12秒檢查一次狀態
    if (!autoCatch && !autoFish) {
      await delay(12 * 1000);
      continue;
    }

    // 🪣 autoCatch 開啟（優先執行）
    if (autoCatch) {
      await safeSend(channel, ";p");
      await randomDelay(4500, 1500);

      if (!autoCatch) continue;

      await safeSend(channel, ";f");
      await randomDelay(10500, 1500);

      if (!autoCatch) continue;

      await safeSend(channel, ";p");
      await randomDelay(4500, 1500);

      await delay(12 * 1000); // 每12秒循環
      continue;
    }

    // 🎣 autoCatch 關閉但 autoFish 開啟
    if (autoFish) {
      await safeSend(channel, ";f");
      await randomDelay(70*1000, 35*1000);
      continue;
    }
  }
}

async function tryClickButton(message, pos = {X: 0, Y: 0}, retries = 5, delayMs = 300) {
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

async function catchPokemon(message, rarity, streak, pokemonName, hasHeldItem, hasTeamLogo) {
  let buttons = message.components?.[0]?.components ?? [];

  helper.msgLogger(`Pokemon's Name: ${pokemonName}`);
  helper.msgDebugger(`${rarity} Streak = ${streak}, HeldItem = ${hasHeldItem}, Teamlogo = ${hasTeamLogo}`)

  let bIndex = -1;
  let targetCustomId;

  const candidates = new Set();

  candidates.add(rarityBallMap[rarity]);

  if (mustCatch.includes(pokemonName)) {
    helper.msgLogger('Found event Pokémon !!');
    candidates.add('mb');
  } 

  if (hasHeldItem) {
    // helper.msgDebugger(`HeldItem = ${hasHeldItem}`)
    candidates.add(rarityBallWithHeldItemMap[rarity]);
  } 

  if (streak % rarityStreakMap[rarity] == rarityStreakMap[rarity]-1) {
    // helper.msgDebugger(`${rarity} Streak = ${streak}`);
    candidates.add(rarityBallWithStreakMap[rarity]);
  } 

  if (hasTeamLogo && ballNameWithTeamLogoMap[todayBall] != '') {
    // helper.msgDebugger(`Teamlogo = ${hasTeamLogo}`)
    candidates.add(ballNameWithTeamLogoMap[todayBall]);
  } 

  let candidateList = Array.from(candidates)

  if (candidateList.length > 0) {
    targetCustomId = candidateList.reduce((best, cur) => {
      const bestPriority = ballPriority[best] || 0;
      const curPriority = ballPriority[cur] || 0;
      return curPriority > bestPriority ? cur : best;
    }, candidateList[0]);
  }

  bIndex = buttons.findIndex(b => b.customId === targetCustomId);
  if (bIndex === -1) bIndex = buttons.findIndex(b => b.customId === 'pb');

  helper.msgDebugger(`bIndex = ${bIndex}`);

  if (bIndex !== -1) {
    const posY = Math.floor(bIndex / 5);          // 行
    const posX = bIndex % 5;                      // 列
    tryClickButton(message, { X: posX, Y: posY });
  }
}

async function catchFish(message, pokemonName) {
  let buttons = message.components?.[0]?.components ?? [];

  helper.msgLogger(`Pokemon's Name: ${pokemonName}`);

  const name = pokemonName.trim().toLowerCase();
  let bIndex = -1;
  let targetCustomId;

  if (name.includes("shiny") || name.includes("golden")){
    targetCustomId = 'mb_fish';
  } else if (legendarySet.has(name)) {
    targetCustomId = 'db_fish';
  } else if (rareSet.has(name)) {
    targetCustomId = 'gb_fish';
  } else if (superRareSet.has(name)) {
    targetCustomId = 'ub_fish';
  } else {
    targetCustomId = 'pb_fish';
  }
  bIndex = buttons.findIndex(b => b.customId === targetCustomId);
  if (bIndex === -1) bIndex = buttons.findIndex(b => b.customId === 'pb_fish');

  helper.msgDebugger(`bIndex = ${bIndex}`)

  if (bIndex !== -1) {
    const posY = Math.floor(bIndex / 5);
    const posX = bIndex % 5;
    tryClickButton(message, { X: posX, Y: posY });
  }
}

let captchaAIInstance = null;

async function getCaptchaAI() {
  if (!captchaAIInstance) {
    captchaAIInstance = new CaptchaAI("./model/captcha.onnx");
  }
  return captchaAIInstance;
}

async function captchaSolve(image_url) {
  const captchaAI = await getCaptchaAI();
  const result = await captchaAI.predict(image_url);
  return result;
}

async function checkMessageCreate(message, client){
  let [title, desc, embedAuthor, footer, image_url] = helper.messageExtractor(message);
  let channel = ''
  const mentionUser = `<@${client.user.id}>`;
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  if (message.type == 'REPLY' && message.mentions.repliedUser?.username == client.user.username) {
    if (desc.includes("found a wild")){
      const [rarity, streak] = helper.extractWildPokemonInfoByFooter(footer);
      const [pokemonName, hasHeldItem, hasTeamLogo] = helper.extractWildPokemonInfoByDesc(desc, teamLogoId);
      helper.msgLogger(`Rarity wild pokemon is ${rarity}`);
      await delay(800);
      catchPokemon(message, rarity, streak, pokemonName, hasHeldItem, hasTeamLogo);
    }
    // Faction 
    if (embedAuthor.includes(`Team ${teamName} — Headquarters`)) {
      [teamLogoId, todayBall] = helper.parseFaction(desc);
      helper.msgLogger(`Team's ID is ${teamLogoId}`);
      helper.msgLogger(`Today's ball is ${todayBall}`);
    }
    // Captcha
    if (title === "A wild Captcha appeared!") {
      wasAutoCatch = autoCatch; // 🔹記錄原本狀態
      wasAutoFish = autoFish;
      autoCatch = false;
      autoFish = false;
      helper.msgLogger("A wild Captcha appeared!");
      helper.msgDebugger(`wasAutoCatch = ${wasAutoCatch}, wasAutoFish = ${wasAutoFish}`);
      const result = await captchaSolve(image_url);
      channel = client.channels.cache.get(message.channelId);
      helper.msgLogger(`The captcha result = ${result}, will send in 5 seconds`);
      await delay(5000);
      safeSend(channel, result);
      await delay(1000);
    }
    if (desc.includes("reached the daily catch limit")) {
      autoCatch = false;
      helper.msgLogger(`Reach limit!!, autocatch will be set ${autoCatch}!!`);
    }
  }
  // Auto catch
  if (message.channelId === autoCatchchannelId && !authorWhiteList.includes(message.author.username) && message.author.username !== client.user.username) {
    autoCatch = false;
    autoFish = false;
    helper.msgLogger(`Someone comes, Autocatch will be set ${autoCatch}!!`);
  }
  if (message.channelId === autoCatchchannelId && message.author.username === client.user.username) {
    if (message.content.includes(";clan stats") || message.content.includes("repel")) {
      autoCatch = true;
      helper.msgLogger(`Autocatch will be set ${autoCatch}!!`);
    }
    if (message.content.includes(";wb") || message.content.includes(";i") ) {
      autoCatch = false;
      autoFish = false;
      helper.msgLogger(`Autocatch and Autofish will be set ${autoCatch}!!`);
    }
    if (message.content.includes(";f shop") ) {
      autoFish = true;
      helper.msgLogger(`Autofish will be set ${autoFish}!!`);
    }
  }
  // egg
  if (message.content.includes("your egg is ready to hatch!") && message.content.includes(mentionUser)) {
    wasAutoCatch = autoCatch; // 🔹記錄原本狀態
    wasAutoFish = autoFish;
    helper.msgLogger("Egg is ready to hatch!!");
    if (wasAutoCatch || wasAutoFish) {
      autoCatch = false;
      autoFish = false;
      helper.msgLogger(`Temporarily disabling autoCatch (${wasAutoCatch}) and autoFish (${wasAutoFish})`);
    }

    await delay(4000);
    const channel = client.channels.cache.get(message.channelId);
    safeSend(channel, ";egg hatch");

    await delay(4000);
    safeSend(channel, ";egg hold");

    helper.msgLogger("Egg is held again!!");

    // 🔹如果原本是開的才開回去
    if (wasAutoCatch || wasAutoFish) {
      autoCatch = wasAutoCatch;
      autoFish = wasAutoFish;
      helper.msgLogger(`Restoring autoCatch (${autoCatch}) and autoFish (${autoFish})`);
    }
  }
}

async function checkMessageUpdate(message, client){
  let [title, desc, embedAuthor, footer, image_url] = helper.messageExtractor(message);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  if (message.type == 'REPLY' && message.mentions.repliedUser?.username == client.user.username) {
    if (desc.includes("Oh! A bite!")) {
      helper.msgLogger("Oh! A bite!!");
      await delay(400);
      tryClickButton(message);
    }
    if (desc.includes("fished a wild")){
      await delay(800);
      const [pokemonName, , ] = helper.extractWildPokemonInfoByDesc(desc, teamLogoId);
      catchFish(message, pokemonName);
    }
    if (footer.includes("Balls left") && !desc.includes("fished a wild")) {
      ballsLeft = helper.parseBalls(footer)
      Object.entries(ballsLeft).forEach(([ball, count]) => {
        helper.msgDebugger(`${ball}: ${count}`)
      });
      for (const { name, id, threshold, amount } of ballConfig) {
        if (ballsLeft[name] <= threshold) {
          helper.msgLogger(`${name} is running low (${ballsLeft[name]} left), buying more automatically...`);
          await delay(2500);
          const channel = client.channels.cache.get(message.channelId);
          safeSend(channel, `;s b ${id} ${amount}`);
          break; // Prevent buying multiple balls at the same time
        }
      }
    }
    // Captcha
    if (title === "A wild Captcha appeared!"){
      autoCatch = false;
      autoFish = false;
      helper.msgLogger("A wild Captcha appeared!");
      helper.msgDebugger(`wasAutoCatch = ${wasAutoCatch}, wasAutoFish = ${wasAutoFish}`);
      const result = await captchaSolve(image_url);
      const channel = client.channels.cache.get(message.channelId);
      helper.msgLogger(`The captcha result = ${result}, will send in 5 seconds`);
      await delay(5000);
      safeSend(channel, result);
      await delay(1000);
    }
    // success to solve captcha
    if (message.content.includes("Thank you, you may continue playing!")) {
      helper.msgLogger("Success to solve captcha!!");
      helper.msgDebugger(`wasAutoCatch = ${wasAutoCatch}, wasAutoFish = ${wasAutoFish}`);
      if (wasAutoCatch || wasAutoFish) {
        autoCatch = wasAutoCatch;
        autoFish = wasAutoFish;
        helper.msgLogger(`Restoring autoCatch (${autoCatch}) and autoFish (${autoFish})`);
      }
    }
  }
}

module.exports = { 
  tryClickButton, 
  checkMessageCreate, 
  checkMessageUpdate, 
  safeSend, 
  startAutoCatch,
};