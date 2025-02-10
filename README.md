# Sigma Boy Bot
## Objectif
Créer un bot Discord en groupe ainsi qu’une extension Chrome permettant le partage d’informations / veille
## Fonctionnalités
### Modération
1. `!kick @user [reason]` - Kicks the mentioned user
2. `!ban @user [reason]` - Bans the mentioned user
3. `!clear [number]` - Clears specified number of messages
4. `!help` - Shows available moderation commands

**Features and safety measures:**
- Only users with moderator permissions can use these commands
- Reason logging for kicks and bans
- Error handling for all commands
- Message cleanup after bulk delete
- Help command with embedded message
- Permission checking
- Input validation

**To use these commands:**
1. The bot must have appropriate permissions in the server
2. The user must have moderator permissions
3. Commands must start with the prefix `!`

**Example usage:**
```
!kick @user Breaking rules
!ban @user Continuous harassment
!clear 50
!help
```

---

## Contraintes du projet
### NodeJS
Créer une application
Avoir des fonctionnalité pertinentes et un code maintenable / scalable
### BDD
Gérer des données utilisateur, traiter des fonctions plus avancées (ex: Gamification, stats, etc)
## Critères d'évaluation
### Interactions
- Modulabilité Extension
- Qualité de l’UX
- Fonctionnalités Bot
### Base de Données
- Pertinence du stock
- Impact de la BDD
- Features bonus
### API
- Qualité du code
- Propreté / scalabilité
- Maintenabilité
### Git & Doc
- Propreté du Git
- Organisation
- Qualité de la Doc
