// @ts-check
const { config } = require("seyfert");

module.exports = config.bot({
  token: process.env.BOT_TOKEN ?? "",
  intents: ["Guilds", "MessageContent", "GuildMessages"],
  locations: {
    base: "src",
    output: process.env.NODE_ENV === 'dev' ? "src" : "dist",
    commands: "commands",
  },
});
