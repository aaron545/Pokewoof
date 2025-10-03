# How to use this bot

## Config
Edit content of sampleconfig.json and rename it as config.json.

## Config detail
- token: please refer to this [video](https://youtu.be/_4s2DpUhLGQ?si=Y_SXTWQzs9s-n6D8&t=180) to get your discord token.
- guildId: the guild on which you want the bot to spam.
- ownChannelId: the channel on which you want the bot to spam.
- boostChannelId: the **boost** channel on which you want the bot to spam.
- mustCatch: an array of Pokémon names that the bot **must catch** (commonly used for event Pokémon).  
  Example:  
  ```json
  "mustCatch": ["Iron-Valiant", "Pikachu-Partner"]
  ```


## 📜 Changelog

### [v1.4.0] - 2025-10-03

#### Added
- 🆕 **Detect Pokémon's Name**  
  The bot can now recognize and extract the Pokémon's name directly from wild encounter messages ✨.  
- 🎯 **mustCatch in config.json**  
  A new `mustCatch` variable has been added to `config.json`.  
  You can specify which Pokémon must always be caught (commonly used for special or event Pokémon) 🎉.

---

### [v1.3.0] - 2025-10-03

#### Added
- 🔍 **Detect Held-Item**  
  The bot can now detect whether a Pokémon has a held item.  
  This can help you use more appropriate balls to catch Pokémon ⚔️🎒.

---

### [v1.2.0] - 2025-10-02

#### Added
- 📌 **Auto-Buy Pokeballs**  
  A brand new function has been added that allows the bot to automatically purchase Pokeballs when your stock runs out 🛒.  
  No more worrying about running out of Pokeballs during your adventure — the bot’s got you covered ✅
