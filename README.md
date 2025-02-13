# Sigma Boy Bot
## Objective
Create a group Discord bot as well as a Chrome extension allowing information sharing / monitoring.

---

## Installation
### Clone the repository
```bash
git clone https://github.com/yohann-prx/Discord-Bot.git
```
### Install the dependencies
If you don't have the correct dependencies installed. Move to the Bot folder and run this command.
```bash
npm install discord.js cheerio node-fetch
```
### Run the bot
Add the bot in your Discord server and get the token.
Move to the Bot folder and run this command.
```bash
node index.js
```

---

## Features
### Help Command
1. `!help` - Shows available commands
### Moderation
1. `!kick @user [reason]` - Kicks the mentioned user
2. `!ban @user [reason]` - Bans the mentioned user
3. `!unban @userID [reason]` - Unbans the mentioned user
4. `!banlist` - Shows the list of banned users
3. `!clear [number]` - Clears specified number of messages
### Sending URL link
1. `!share <url>` - Shares a link with rich preview in the current channel. Only works with Youtube, Github & Medium links.
### Random Emojis response
1. `!!!` in your comments - Responds with a sentence & a random emoji
### The "Quoi" "Feur" joke
1. `quoi` in your comments - Responds with "Feur !"
### Tic Tac Toe Game
1. `!tictactoe-help` - Shows available commands
2. `!tictactoe` - Starts a game of Tic Tac Toe

---

## Project constraints
### NodeJS
Create an application
Have relevant features and maintainable / scalable code
### BDD
Manage user data, process more advanced functions (eg: Gamification, stats, etc.)
## Evaluation criteria
### Interactions
- Modulability Extension
- UX quality
- Bot features
### Database
- Relevance of the stock
- Impact of the BDD
- Bonus features
### API
- Code quality
- Cleanliness / scalability
- Maintainability
### Git & Doc
- Git cleanliness
- Organization
- Quality of the Doc
