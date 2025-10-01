function messageExtractor(message) {
  let embedTitle = message.embeds[0]?.title ?? 'empty_title';
  let embedDesc = message.embeds[0]?.description ?? 'empty_description';
  let embedAuthor = message.embeds[0]?.author?.name ?? 'empty_author';
  let embedFooter = message.embeds[0]?.footer?.text ??'empty_footer'

  return [embedTitle, embedDesc, embedAuthor, embedFooter]
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

module.exports = { 
  messageExtractor,
  msgLogger,
  msgDebugger,
  extractPokemonRarity,
  extractStreak,
};