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

---

### [v1.8.2] - 2025-10-16

#### Changed
- 🎯 **Adjusted Pokeball mapping for Rare Pokémon**  
  Updated the `rarityBallMap` and `rarityBallWithStreakMap` configurations to refine Pokéball selection logic.  
  - `Rare` rarity now uses **Greatball (`gb`)** instead of **Pokeball (`pb`)** in normal mode.  
  - In streak mode, `Rare` now uses **Ultraball (`ub`)** instead of **Greatball (`gb`)**.  
  ⚙️ This change improves catch efficiency for rare Pokémon.

#### Fixed
- 🐞 **Fixed incorrect Pokeball override**  
  Resolved an issue where the bot would always fall back to using **Pokéball (`pb`)** when `todayBall` was set to **Premier Ball (`prb`)** or **Master Ball (`mb`)**.  
  ✅ The bot now correctly handles these cases without forcing a fallback.

### [v1.8.1] - 2025-10-16

#### Fixed
- 🐞 **Fix bug with detecting Pokéballs**  
  Resolved an issue where the bot occasionally failed to correctly detect the remaining number of Pokéballs

### [v1.8.0] - 2025-10-16

#### Added
- 🛒 **Automatic Pokéball purchasing system**  
  The bot now automatically detects when your Pokéballs are running low and purchases more based on predefined thresholds.  
  🪄 Configuration includes Pokéball, Greatball, and Ultraball 
  ✅ Ensures uninterrupted gameplay and prevents catching attempts from failing due to lack of balls.

---

### [v1.7.1] - 2025-10-16

#### Changed
- 🔄 **Simplified team logo detection logic**  
  Previously, the bot checked for a *specific* team logo ID. Now, it simply checks whether any team logo.
  ✅ This improves flexibility and prevents missed detections when multiple team logos are in play.

### [v1.7.0] - 2025-10-16

#### Added
- 🛡️ **Team logo check for target ball usage**  
  The bot now verifies the player's faction/team logo. If the team logo matches the required faction, the bot will use the day's designated target Pokéball automatically — **except** it will always ignore `prb` and `mb` (these are never auto-selected by the target-ball logic).

- ⚙️ **Auto faction & target-ball detection on startup**  
  When the bot starts, it now automatically checks the faction/team content and determines what today's target Pokéball is. This ensures the bot knows the correct default ball to use before any encounters occur.

---

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
