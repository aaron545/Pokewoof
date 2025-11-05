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

[2.3.4](#v234) | [2.3.3](#v233) | [2.3.2](#v232) | [2.3.1](#v231) | [2.3.0](#v230)

[2.2.0](#v220)

[2.1.0](#v210)

[2.0.1](#v201) | [2.0.0](#v200) 

[1.8.5](#v185) | [1.8.4](#v184) | [1.8.3](#v183) | [1.8.2](#v182) | [1.8.1](#v181) | [1.8.0](#v180)

[1.7.1](#v171) | [1.7.0](#v170)

[1.6.4](#v164) | [1.6.3](#v163) | [1.6.2](#v162) | [1.6.1](#v161) | [1.6.0](#v160)

[1.5.0](#v150)

[1.4.0](#v140)

[1.3.0](#v130)

[1.2.0](#v120)

### [v2.3.4] - 2025-11-03 <a id="v234"></a>

#### Fixed
- 😴 **Resolved Post-CAPTCHA Idle Issue**  
  Fixed an issue where the bot would stop functioning after solving a CAPTCHA instead of resuming normal catching behavior.  

#### Updated
- 🥚 **Extended Egg Hatching Delay**  
  Increased the delay duration during egg hatching to ensure reliable completion and prevent missed hatches.

---

### [v2.3.3] - 2025-11-03 <a id="v233"></a>

#### Fixed
- 🧩 **Restored Auto States After CAPTCHA Solve**  
  After completing CAPTCHA verification, the bot now correctly restores the previous states of both `autoCatch` and `autoFish`, ensuring continuity of automated actions.

---

### [v2.3.2] - 2025-11-03 <a id="v232"></a>

#### Changed
- ⚙️ **Modified Auto-Fish Behavior**  
  The bot will **no longer automatically enable Auto-Fish** when the daily catch (`autoCatch`) limit is reached.  
  Users must now manually activate `autoFish` via command if desired.

---

### [v2.3.1] - 2025-11-01 <a id="v231"></a>

#### Fixed
- 🐞 **Fixed Auto-Fish Activation Bug**  
  Resolved an issue where the bot would occasionally enable `autoFish` unexpectedly without user command or trigger.

---

### [v2.3.0] - 2025-10-31 <a id="v230"></a>

#### Added
- 🎣 **Added Auto-Fish System**  
  Introduced an automated fishing system. When the daily catch (`autoCatch`) limit is reached, the bot will automatically switch to fishing mode, or users can manually enable it with a command.  

- 🥚 **Added Auto-Egg Hatching**  
  The bot now records the states of both `autoCatch` and `autoFish`, temporarily disables them while hatching an egg, and restores their previous states afterward.  

#### Updated
- 🐋 **Updated Legendary Pokémon List**  
  Added **Kyogre** to the Legendary Pokémon list.

---

### [v2.2.0] - 2025-10-29 <a id="v220"></a>

#### Added
- 🧾 **Added `authorWhiteList` to config.json**  
  Introduced a new configuration field `authorWhiteList`, which defines a list of allowed message authors.  
  ✅ This helps the bot identify trusted message sources and prevent unintended actions triggered by other users.

---

### [v2.1.0] - 2025-10-29 <a id="v210"></a>

#### Added
- 🎯 **Added Auto-Catch System**  
  Introduced an automated Pokémon catching feature. Users can now enable or disable auto-catch using specific commands.  
- ⏱️ **Added randomDelay Utility**  
  Added a delay function with random bias for more human-like interactions.  
- ⚙️ **Updated config.json**  
  Added a new parameter `autoCatchchannelId`, used for defining the channel where the bot performs automatic Pokémon catching.

---

### [v2.0.1] - 2025-10-28 <a id="v201"></a>

#### Fixed
- 🤖 **Fixed captchaSolve logic**  
  Corrected the `captchaSolve` function — it now properly executes CAPTCHA prediction and sends the result to the target channel.

---

### [v2.0.0] - 2025-10-20 <a id="v200"></a>

#### Added
- 🧠 **Added ONNX model for CAPTCHA verification**  
  Integrated a new `.onnx` model to automatically verify CAPTCHA.
---

### [v1.8.5] - 2025-10-20 <a id="v185"></a>

#### Changed
- ⚙️ **Updated rarity-to-ball mapping logic**
  Adjusted which Poké Ball is used for each rarity level to improve catch success rate.

---

### [v1.8.4] - 2025-10-20 <a id="v184"></a>

#### Fixed
- 🐞 **Fix naming error** 
  naming error `mappedTeamBall -> ballNameWithTeamLogoMap[todayBall]`

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
  Resolved an issue where the bot occasionally failed to correctly detect the remaining number of Pokéballs

---

### [v1.8.0] - 2025-10-16 <a id="v180"></a>

#### Added
- 🛒 **Automatic Pokéball purchasing system**  
  The bot now automatically detects when your Pokéballs are running low and purchases more based on predefined thresholds.  
  🪄 Configuration includes Pokéball, Greatball, and Ultraball 
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
  The bot now verifies the player's faction/team logo. If the team logo matches the required faction, the bot will use the day's designated target Pokéball automatically — **except** it will always ignore `prb` and `mb` (these are never auto-selected by the target-ball logic).

- ⚙️ **Auto faction & target-ball detection on startup**  
  When the bot starts, it now automatically checks the faction/team content and determines what today's target Pokéball is. This ensures the bot knows the correct default ball to use before any encounters occur.

---

### [v1.6.4] - 2025-10-14 <a id="v164"></a>

#### Fixed
- 🧩 **Fixed major Pokéball selection logic issue**  
  Previously, even if a Pokémon was included in the `mustCatch` list, the bot would continue checking for held items or streak bonuses afterward, which could result in the wrong Pokéball being used.  
  The logic has been corrected to use `else if`, ensuring that once a must-catch Pokémon is detected, the bot **always uses the Master Ball (`mb`)** and skips further checks.

---

### [v1.6.3] - 2025-10-09 <a id="v163"></a>

#### Changed
- ⚙️ Adjusted the Pokéball selection logic when fishing.  
  - **Shiny** and **Golden** Pokémon now use **Master Ball**.  
  - **Legendary** Pokémon now use **Dive Ball**. 

---

### [v1.6.2] - 2025-10-09 <a id="v162"></a>

#### Fixed
- 🐛 Fixed a minor bug where the bot would stop acting if the target Pokéball button could not be found.  
  It now safely defaults to the regular Pokéball (`pb`) instead of taking no action.

---

### [v1.6.1] - 2025-10-08 <a id="v161"></a>

#### Fixed
- 🐛 Fixed a bug where the number of Pokéballs was printed twice in the fishing log.

---

### [v1.6.0] - 2025-10-08 <a id="v160"></a>

#### Added
- 🎣 **Fishing rarity detection**  
  When using the fishing feature, the bot can now detect the rarity of the Pokémon (R / SR / L) and automatically select the appropriate Pokéball based on its rarity:  
  - Shiny / Golden / Legendary → use `Diveball`  
  - Rare → use `Greatball`  
  - Super Rare → use `Ultraball`  
  - Others → use the basic Pokéball `Pokeball`  
  This allows the bot to automatically use the most suitable ball for higher rarity Pokémon, increasing your chances of a successful catch 🎯.

---

### [v1.5.0] - 2025-10-07 <a id="v150"></a>

#### Added
- ⚪ **Channel Whitelist (`channelWhiteList`)**  
  A new `channelWhiteList` option has been added to `config.json`.  
  You can now specify which channels the bot is allowed to operate in.  
  Simply add channel IDs to this list to whitelist them 🧾.  

---

### [v1.4.0] - 2025-10-03 <a id="v140"></a>

#### Added
- 🆕 **Detect Pokémon's Name**  
  The bot can now recognize and extract the Pokémon's name directly from wild encounter messages ✨.  
- 🎯 **mustCatch in config.json**  
  A new `mustCatch` variable has been added to `config.json`.  
  You can specify which Pokémon must always be caught (commonly used for special or event Pokémon) 🎉.

---

### [v1.3.0] - 2025-10-03 <a id="v130"></a>

#### Added
- 🔍 **Detect Held-Item**  
  The bot can now detect whether a Pokémon has a held item.  
  This can help you use more appropriate balls to catch Pokémon ⚔️🎒.

---

### [v1.2.0] - 2025-10-02 <a id="v120"></a>

#### Added
- 📌 **Auto-Buy Pokeballs**  
  A brand new function has been added that allows the bot to automatically purchase Pokeballs when your stock runs out 🛒.  
  No more worrying about running out of Pokeballs during your adventure — the bot’s got you covered ✅
