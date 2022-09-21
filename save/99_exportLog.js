const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

module.exports = {
  data: new SlashCommandBuilder().setName("로그")
    .setDescription("관리자 명령어 / 로그 출력")
    .addStringOption(option => option.setName('옵션')
      .setDescription('1 log / 2 autoReset').setRequired(true))
    .addStringOption(option => option.setName('날짜')
      .setDescription('YYYY-MM-DD').setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const userid = interaction.user.id;
    const option = interaction.options.getString('옵션');
    const dateStr = interaction.options.getString('날짜');
    if (userid != '830415397521850388') {
      await interaction.editReply('⚠ 관리자 명령어입니다.');
      setTimeout(() => interaction.deleteReply(), 3000);
    }

    try {
      if (option == '1') {
        filepath = `./log/log_${dateStr}.csv`
        filename = 'log.csv'
      } else {
        filepath = `./log/autoReset_${dateStr}.csv`
        filename = 'autoReset.csv'
      }
      await interaction.user.send({
        files: [{
          attachment: filepath,
          name: filename,
          description: 'the file of the exception logs'
        }]
      }).then(console.log).catch(console.error);

      await interaction.editReply("엑셀 파일로 추출이 완료되었습니다.");
    } catch (err) {
      await interaction.editReply("err");
      console.log(err)
    }
  }
}
