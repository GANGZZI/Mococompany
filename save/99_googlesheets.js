const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName("일지").setDescription("모코콤퍼니 근무일지(구글 시트)를 보여드립니다."),
  async execute(interaction) {
    const exampleEmbed = new MessageEmbed()
      .setColor('#A6FF4D')
      .setTitle('[ 모코콤퍼니 근무일지 ]')
      .addField(`💚근무일지`, '레이드 파티모집 및 개인 숙제 체크')
      .setURL('https://docs.google.com/spreadsheets/d/1hHEWEtFFivXp8PNHSAOP09Ng5r20EVp1VSu6N_tRFPQ')
      .setFooter('모코콤퍼니 봇 이용을 추천드립니다.\n/명령어 로 기능을 확인해보세요.')
      .setImage('https://media.discordapp.net/attachments/839120741919227954/973084427720724490/IMG_1195.png')

    await interaction.reply({ embeds: [exampleEmbed] })
  }
}