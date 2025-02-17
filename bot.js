
const { 
  Client, 
  GatewayIntentBits, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require('discord.js');

require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

const BOT_TOKEN = process.env.BOT_TOKEN;
const VERIFY_CHANNEL_ID = process.env.VERIFY_CHANNEL_ID;

client.on('guildMemberAdd', async (member) => {
  try {
    const channel = member.guild.channels.cache.get(VERIFY_CHANNEL_ID);
    if (channel) {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('verify')
          .setLabel('Verify')
          .setStyle(ButtonStyle.Primary)
      );
      await channel.send({
        content: `Welcome ${member}, please verify yourself by clicking the button below.`,
        components: [row],
      });
    }
  } catch (error) {
    console.error('Error sending verification message:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId === 'verify') {
    const verificationUrl = `http://localhost:3000/verify?userId=${interaction.user.id}&guildId=${interaction.guild.id}`;
    await interaction.reply({
      content: `Click this link to verify: ${verificationUrl}`,
      ephemeral: true,
    });
  }
});

client.login(BOT_TOKEN);
