# How to use this bot

## Config
Edit content of sampleconfig.json and rename it as config.json.

## Config detail
- token: please refer to this [video](https://youtu.be/_4s2DpUhLGQ?si=Y_SXTWQzs9s-n6D8&t=180) to get your discord token.
- guildId: the guild on which you want the bot to spam.
- channelWhiteList: an array with channelId
- mustCatch: an array of Pokémon names that the bot **must catch** (commonly used for event Pokémon).  
  Example:  
  ```json
  "mustCatch": ["Iron-Valiant", "Pikachu-Partner"]
  ```


## 📜 Changelog

### [v1.6.4] - 2025-10-14

#### Fixed
- 🧩 **Fixed major Pokéball selection logic issue**  
  Previously, even if a Pokémon was included in the `mustCatch` list, the bot would continue checking for held items or streak bonuses afterward, which could result in the wrong Pokéball being used.  
  The logic has been corrected to use `else if`, ensuring that once a must-catch Pokémon is detected, the bot **always uses the Master Ball (`mb`)** and skips further checks.

### [v1.6.3] - 2025-10-09

#### Changed
- ⚙️ Adjusted the Pokéball selection logic when fishing.  
  - **Shiny** and **Golden** Pokémon now use **Master Ball**.  
  - **Legendary** Pokémon now use **Dive Ball**. 

### [v1.6.2] - 2025-10-09

#### Fixed
- 🐛 Fixed a minor bug where the bot would stop acting if the target Pokéball button could not be found.  
  It now safely defaults to the regular Pokéball (`pb`) instead of taking no action.

### [v1.6.1] - 2025-10-08

#### Fixed
- 🐛 Fixed a bug where the number of Pokéballs was printed twice in the fishing log.

### [v1.6.0] - 2025-10-08

#### Added
- 🎣 **Fishing rarity detection**  
  When using the fishing feature, the bot can now detect the rarity of the Pokémon (R / SR / L) and automatically select the appropriate Pokéball based on its rarity:  
  - Shiny / Golden / Legendary → use `Diveball`  
  - Rare → use `Greatball`  
  - Super Rare → use `Ultraball`  
  - Others → use the basic Pokéball `Pokeball`  
  This allows the bot to automatically use the most suitable ball for higher rarity Pokémon, increasing your chances of a successful catch 🎯.

---

### [v1.5.0] - 2025-10-07

#### Added
- ⚪ **Channel Whitelist (`channelWhiteList`)**  
  A new `channelWhiteList` option has been added to `config.json`.  
  You can now specify which channels the bot is allowed to operate in.  
  Simply add channel IDs to this list to whitelist them 🧾.  
  Example:  
  ```json
  "channelWhiteList": [
    "you can add channels",
    "with any numbers in this list"
  ]
  ```

---

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
