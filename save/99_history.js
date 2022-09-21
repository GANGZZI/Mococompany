const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName("기록").setDescription("회사 히스토리"),
  async execute(interaction) {
    await interaction.deferReply();

    const userid = interaction.user.id;
    if (userid != '830415397521850388') {
      await interaction.editReply('⚠ 관리자 명령어입니다.');
      setTimeout(() => interaction.deleteReply(), 3000);
    }

    const exampleEmbed = new MessageEmbed()
      .setColor('#A6FF4D')
      .setTitle('[ 모코콤퍼니 제 1회 워크샵 ]')
      .addField('Groot 사장 외 직원 일동', '*#우리 #이제 #56관문 #빡숙*')
      .setImage('https://cdn.discordapp.com/attachments/945656560447795226/1008612207011057694/-1.jpg')
      .setFooter("2022.08.14~15");

    await interaction.editReply({ embeds: [exampleEmbed] })
  }
}