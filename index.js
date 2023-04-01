const { Client, TextInputStyle, ButtonStyle, ButtonBuilder, TextInputBuilder, ModalBuilder, ActionRowBuilder, SelectMenuBuilder, EmbedBuilder, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [ Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember]});
const { readdirSync } = require("fs")
const moment = require("moment");
const config = require("./config.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const db = require("croxydb")


module.exports = client;

require("./events/message.js")
require("./events/ready.js")




const row1 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('kabulet')
          .setEmoji("✅")
          .setDisabled(true)
					.setLabel('Kabul Et')
					.setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
					.setCustomId('reddet')
          .setEmoji("❌")
          .setDisabled(true)
					.setLabel('Reddet')
					.setStyle(ButtonStyle.Primary),
			);  

const embed1 = new EmbedBuilder()
  .setColor("Random")
  .setDescription("😎 **|** Kullanıcıyı onaylılarak başarıyla abone rolü vermiş oldunuz.")

client.on("messageCreate", async(message) => {
  const sorumlu = db.fetch(`abonesorumlu_${message.guild.id}`)
  const rol = db.fetch(`abonerol_${message.guild.id}`)
  const log = db.fetch(`abonelog_${message.guild.id}`)
  const kanal = db.fetch(`abonekanal_${message.guild.id}`)
  

  if(message.channel.id === kanal) {
  if(message.author.bot) return;
  if(message.member.roles.cache.has(rol)) return message.delete();
  if(message.member.roles.cache.has(sorumlu)) return;
    
  if(!message.attachments.first()) return message.delete()
  
  const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('kabulet')
          .setEmoji("✅")
					.setLabel('Kabul Et')
					.setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
					.setCustomId('reddet')
          .setEmoji("❌")
					.setLabel('Reddet')
					.setStyle(ButtonStyle.Primary),
			);
    
  const embed = new EmbedBuilder()
  .setColor("Random")
  .setTitle(`${client.user.username} - Abone Sistemi`)
  .setDescription("• `Kabul et` butonuna basarak kullanıcıya rolü vermiş olursunuz, `Reddet` butonuna basarak kullanıcının ssini reddetmiş olursunuz.")
  .setFooter({ text: "GamerBros Abone sistemi" })
  
  message.channel.send({ embeds: [embed], components: [row] }).then(async(msg) => {
    
    const collector = message.channel.createMessageComponentCollector({  time: 60000 * 10 });
    
    collector.on('collect', async i => {
      if(!i.member.roles.cache.has(sorumlu)) return;
      
      if(i.customId === "kabulet") {
        let kabul = new EmbedBuilder()
        .setTitle(`${message.guild.name} | Abone Sistemi`)
        .setDescription(`**Abone Rolü Veren;**\n<@${i.user.id}>\n**Abone Rollü Verilen Kişi;**\n<@${message.author.id}>`)
       client.channels.cache.get(db.fetch(`abonelog_${message.guild.id}`)).send({ content: `<@${message.author.id}>`, embeds: [kabul]})
        
       message.member.roles.add(rol)
       await i.update({ embeds: [embed1], components: [row1] })
      }
      
  });
    
  });
  }  
});

client.on("interactionCreate", async(interaction) => {
  const sorumlu = db.fetch(`abonesorumlu_${interaction.guild.id}`)

  if(!interaction.member.roles.cache.has(sorumlu)) return;
  if(interaction.isButton()) {
    if(interaction.customId === "reddet") {
      
      const modal = new ModalBuilder().setCustomId('myModal').setTitle("GamerBros Abone sistemi");
      
      const favoriteColorInput = new TextInputBuilder().setCustomId('favoriteColorInput').setLabel("Reddetme mesajınızı giriniz.").setStyle(TextInputStyle.Short);
      const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
      
      modal.addComponents(firstActionRow)
      
      await interaction.showModal(modal);
      
    }
  }
});

client.on('interactionCreate', interaction => {
	if (!interaction.isModalSubmit()) return;

	const favoriteColor = interaction.fields.getTextInputValue('favoriteColorInput');
	
  interaction.update({ embeds: [embed1.setDescription(`• Abone rolü alırken **${favoriteColor}** sebebiyle red edildiniz.`)], components: [row1] })
});








client.login(config.token).catch(e => {
console.log("Tokeninde Hatan Var Bota bağlanamadı | Airfax")
})


