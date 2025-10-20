const helper = require('./helper');
const { mustCatch, teamName } = require('./config.json');

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
const legendaryList = ["Suicune"];

const rareSet = new Set(rareList.map(x => x.toLowerCase()));
const superRareSet = new Set(superRareList.map(x => x.toLowerCase()));
const legendarySet = new Set(legendaryList.map(x => x.toLowerCase()));
// end for function catchFish

let todayBall = ''
let teamLogoId = ''

function safeSend(channel, content) {
  return channel.send(content).catch(err => {
    helper.msgLogger(`❌ Failed to send "${content}" to channel ${channel.id}:`);
    helper.msgLogger(err);
  });
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

async function checkMessageCreate(message, client){
  let [title, desc, embedAuthor, footer] = helper.messageExtractor(message);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  if (message.type == 'REPLY' && message.mentions.repliedUser?.username == client.user.username) {
    if (desc.includes("found a wild")){
      const [rarity, streak] = helper.extractWildPokemonInfoByFooter(footer)
      const [pokemonName, hasHeldItem, hasTeamLogo] = helper.extractWildPokemonInfoByDesc(desc, teamLogoId)
      helper.msgLogger(`Rarity wild pokemon is ${rarity}`)
      await delay(800);
      catchPokemon(message, rarity, streak, pokemonName, hasHeldItem, hasTeamLogo)
    }
    // Faction 
    if (embedAuthor.includes(`Team ${teamName} — Headquarters`)) {
      [teamLogoId, todayBall] = helper.parseFaction(desc);
      helper.msgLogger(`Team's ID is ${teamLogoId}`)
      helper.msgLogger(`Today's ball is ${todayBall}`)
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
      await delay(800);
      const [pokemonName, , ] = helper.extractWildPokemonInfoByDesc(desc, teamLogoId)
      catchFish(message, pokemonName)
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
          break; // ✅ 防止同時買多種球
        }
      }
    }
  }
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

module.exports = { tryClickButton, checkMessageCreate, checkMessageUpdate };