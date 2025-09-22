import { Client, GatewayIntentBits, Partials } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Read chance from env (default 0.3 = 30%)
const reactionChance = parseFloat(process.env.REACTION_CHANCE) || 0.3;

// Keyword → emoji mappings
const keywordReactions = {
  gm: ["👋", "☀️"],
  gn: ["🌙", "😴"],
  lol: ["😂"],
  lmao: ["🤣"],
  win: ["🏆", "🔥"],
  profit: ["💰", "📈"],
  loss: ["💀", "😢"],
  rip: ["🪦"],
  w: ["👑", "🔥"]
};

// Channel defaults (always react)
const channelDefaults = {
  signals: ["✅", "🔔"],
  premium: ["💎", "🚀"]
};

// Utility: pick random element
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Listener
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const channelName = message.channel.name.toLowerCase();

  // 1. Channel default reactions (always applied if matched)
  if (channelDefaults[channelName]?.length) {
    for (const emoji of channelDefaults[channelName]) {
      await message.react(emoji).catch(() => {});
    }
  }

  // 2. Keyword-based reactions (randomized for natural feel)
  const msgContent = message.content.toLowerCase();
  for (const keyword in keywordReactions) {
    if (msgContent.includes(keyword)) {
      if (Math.random() < reactionChance) {
        await message.react(pick(keywordReactions[keyword])).catch(() => {});
      }
    }
  }
});

client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
