# How to use this bot

## Config
Edit content of `sampleconfig.json` and rename it as `config.json`.

## Config detail
- **token**: please refer to this [video](https://youtu.be/_4s2DpUhLGQ?si=Y_SXTWQzs9s-n6D8&t=180) to get your Discord token.  
- **guildId**: the guild on which you want the bot to spam.  
- **ownchannelId**: "please use private channel, don't use public channel."  
- **channelWhiteList**: an array with channelId.  
- **mustCatch**: an array of Pokémon names that the bot **must catch** (commonly used for event Pokémon).  
- **teamName**: your faction's name, like Rocket, Plasma, etc.

---

## 📜 Changelog

### 🔗 Versions
[1.8.3](#v183) | [1.8.2](#v182) | [1.8.1](#v181) | [1.8.0](#v180) | [1.7.1](#v171) | [1.7.0](#v170) | [1.6.x](#v164) | [1.5.0](#v150) | [1.4.0](#v140) | [1.3.0](#v130) | [1.2.0](#v120)

---

### [v1.8.3] - 2025-10-20 <a id="v183"></a>

#### Changed
- ⚙️ **Improved Pokéball selection logic**  
  Previously, when multiple conditions were met (e.g. streak bonus + held item), the bot would only choose the **first** matching Pokéball.  
  🧠 Now, it evaluates **all possible matches** and selects the one with the **highest priority** based on the following order:  
  `pokeball < greatball < ultraball < premierball < masterball`  
  ✅ This ensures the bot always uses the **most suitable and valuable** Pokéball for each situation.

---

### [v1.8.2] - 2025-10-16 <a id="v182"></a>

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

---

### [v1.8.1] - 2025-10-16 <a id="v181"></a>

#### Fixed
- 🐞 **Fix bug with detecting Pokéballs**  
  Resolved an issue where the bot occasionally failed to correctly detect the remaining number of Pokéballs.

---

### [v1.8.0] - 2025-10-16 <a id="v180"></a>

#### Added
- 🛒 **Automatic Pokéball purchasing system**  
  The bot now automatically detects when your Pokéballs are running low and purchases more based on predefined thresholds.  
  🪄 Configuration includes Pokéball, Greatball, and Ultraball.  
  ✅ Ensures uninterrupted gameplay and prevents catching attempts from failing due to lack of balls.

---

### [v1.7.1] - 2025-10-16 <a id="v171"></a>

#### Changed
- 🔄 **Simplified team logo detection logic**  
  Previously, the bot checked for a *specific* team logo ID. Now, it simply checks whether any team logo.  
  ✅ This improves flexibility and prevents missed detections when multiple team logos are in play.

---

### [v1.7.0] - 2025-10-16 <a id="v170"></a>

#### Added
- 🛡️ **Team logo check for target ball usage**  
  The bot now verifies the player's faction/team logo.  
  If the team logo matches the required faction, the bot will use the day's designated target Pokéball automatically —  
  **except** it will always ignore `prb` and `mb` (these are never auto-selected by the target-ball logic).

- ⚙️ **Auto faction & target-ball detection on startup**  
  When the bot starts, it now automatically checks the faction/team content and determines what today's target Pokéball is.  
  This ensures the bot knows the correct default ball to use before any encounters occur.

---

### [v1.6.x] - 2025-10-08~14 <a id="v164"></a>

#### Fixed
- 🧩 **Fixed major Pokéball selection logic issue**  
- 🐛 Fixed crash when button not found (default to pb).  
- 🐛 Fixed duplicated Pokéball number log.  

#### Changed
- ⚙️ Adjusted Pokéball selection when fishing.  
- 🎣 Added fishing rarity detection for automatic Pokéball choice.  

---

### [v1.5.0] - 2025-10-07 <a id="v150"></a>

#### Added
- ⚪ **Channel Whitelist (`channelWhiteList`)**  
  Added whitelist option to restrict bot activity to specific channels.

---

### [v1.4.0] - 2025-10-03 <a id="v140"></a>

#### Added
- 🆕 **Detect Pokémon's Name**  
- 🎯 **mustCatch in config.json**

---

### [v1.3.0] - 2025-10-03 <a id="v130"></a>

#### Added
- 🔍 **Detect Held-Item**  

---

### [v1.2.0] - 2025-10-02 <a id="v120"></a>

#### Added
- 📌 **Auto-Buy Pokéballs**  
  Automatically purchase Pokéballs when out of stock.
