function messageExtractor(message) {
  let embedTitle = message.embeds[0]?.title ?? 'empty_title';
  let embedDesc = message.embeds[0]?.description ?? 'empty_description';
  let embedAuthor = message.embeds[0]?.author?.name ?? 'empty_author';
  let embedFooter = message.embeds[0]?.footer?.text ??'empty_footer';
  let image_url = message.embeds[0]?.image?.url ?? 'empty_image';

  return [embedTitle, embedDesc, embedAuthor, embedFooter, image_url]
}

function msgLogger(msg) {
  const now = new Date();
  const formattedTime = now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" }); // 轉成 "YYYY-MM-DD HH:MM:SS"
  // console.log("----------");
  console.log(`[${formattedTime}] --normal-- ${msg}`);
  // console.log("----------");
}
function msgDebugger(msg) {
  const now = new Date();
  const formattedTime = now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" }); // 轉成 "YYYY-MM-DD HH:MM:SS"
  console.log(`[${formattedTime}] --Debug-- ${msg}`);
}

function extractPokemonRarity(footer) {
  if (footer.includes("Common")){
    rarity = "Common"
  } else if (footer.includes("Uncommon")) {
    rarity = "Uncommon"
  } else if (footer.includes("Super Rare")) {
    rarity = "SuperRare"
  } else if (footer.includes("Rare")) {
    rarity = "Rare"
  } else if (footer.includes("Legendary")) {
    rarity = "Legendary"
  } else if (footer.includes("Shiny")) {
    rarity = "Shiny"
  }
  return rarity;
}

function extractStreak(footer) {
  match = footer.match(/streak:\s*(\d+)/i);
  return match[1];
}

function extractWildPokemonInfoByFooter(footer) {
  // rarity
  if (footer.includes("Common")){
    rarity = "Common"
  } else if (footer.includes("Uncommon")) {
    rarity = "Uncommon"
  } else if (footer.includes("Super Rare")) {
    rarity = "SuperRare"
  } else if (footer.includes("Rare")) {
    rarity = "Rare"
  } else if (footer.includes("Legendary")) {
    rarity = "Legendary"
  } else if (footer.includes("Shiny")) {
    rarity = "Shiny"
  }

  // Streak
  match = footer.match(/streak:\s*(\d+)/i);
  streak = match[1];

  return [rarity, streak];
}

function extractWildPokemonInfoByDesc(desc, teamLogoId) {
  // Pokemon's name
  let pokemonName = ''
  const nameMatch = desc.match(/a wild .*?\*\*(.+?)\*\*!/);
  if (nameMatch) {
    pokemonName = nameMatch[1];
  }

  // Held item
  const hasHeldItem = desc.includes(":held_item:");

  // Team logo

  // const hasTeamLogo = desc.includes(`:team_logo:${teamLogoId}`)
  const hasTeamLogo = desc.includes(`:team_logo:`)

  return [pokemonName, hasHeldItem, hasTeamLogo];
}

function parseBalls(footer) {
  // 這個正則會抓到類似 "Pokeballs: 92"
  const regex = /(Pokeballs|Greatballs|Ultraballs|Masterballs|Premierballs)\s*:\s*(\d+)/g;
  
  const result = {};
  for (const match of footer.matchAll(regex)) {
    // 去掉最後一個 s
    const ballName = match[1].replace(/s$/, '');
    const count = Number(match[2]); 
    result[ballName] = count;
  }

  return result;
}

function parseFaction(desc) {
  // Team logo ID
  const idLine = desc.split('\n').find(l => /Points/.test(l));
  if (!idLine) return;
  const idMatch = idLine.match(/<:team_logo:(\d+)>/i);
  if (!idMatch) return;
  teamLogoId = idMatch[1];

  // Today ball
  const ballLine = desc.split('\n').find(l => /Today's target Pokemon are/i.test(l));
  if (!ballLine) return;
  const todayBallMatch = ballLine.match(/<:(.+):\d+/i);
  if (!todayBallMatch) return;
  todayBall = todayBallMatch[1];

  return [teamLogoId, todayBall];
}

module.exports = { 
  messageExtractor,
  msgLogger,
  msgDebugger,
  extractWildPokemonInfoByFooter,
  extractWildPokemonInfoByDesc,
  parseBalls,
  parseFaction,
};