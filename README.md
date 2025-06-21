# custom-bot-wrapper-2

A modular, extensible Discord.js bot framework with built-in command, event, hook, and store management.

## Features

- **Easy command, event, and hook registration**
- **Cooldown management** for commands
- **Extensible store system** (in-memory and MongoDB)
- **Type support** via JSDoc and TypeScript declarations
- **Customizable logging** (Winston-based)
- **Lifecycle hook points** for advanced extension

## Installation

```sh
npm install cbw2
```

## Usage

```js
import { Bot, CommandHandler, EventHandler, MongoStore, ObjectStore, HookHandler } from "cbw2";

// Example: Create a bot instance
const bot = new Bot({
  options: {
    token: "YOUR_DISCORD_BOT_TOKEN",
    clientId: "YOUR_CLIENT_ID",
    mongoUri: "mongodb://localhost:27017/yourdb" // optional
  }
});

// Add a command
bot.addCommandHandler(new CommandHandler({
  cName: "ping",
  builder: /* your SlashCommandBuilder instance */,
  handler: async (ctx, interaction) => {
    await interaction.reply("Pong!");
  }
}));

// Start the bot
bot.start();
```

## API Overview

### Classes

- **Bot**  
  Main bot manager. Handles Discord client, commands, events, hooks, and database.

- **CommandHandler**  
  Represents a slash command.

- **EventHandler**  
  Represents a Discord event handler.

- **HookHandler**  
  Represents a lifecycle hook handler.

- **HandlerManager**  
  Manages collections of handlers.

- **CooldownManager**  
  Handles per-user, per-command cooldowns.

- **Logger**  
  Winston-based logger.

### Stores

- **Store**  
  Abstract base class for data storage.

- **ObjectStore**  
  In-memory store for session data.

- **MongoStore**  
  MongoDB-backed store using Mongoose.

### Hook Points

See [`src/hook_points.js`](src/hook_points.js) for all available lifecycle hook points (e.g., `preCommand`, `postEvent`, etc.).

## Type Support

- Full type support via JSDoc and generated TypeScript declarations.
- Works out-of-the-box in TypeScript and modern editors.

## License

[GPL-3.0](LICENSE)  
Copyright (C) vyduck

---
*This project is not affiliated with Discord or Discord Inc.*
