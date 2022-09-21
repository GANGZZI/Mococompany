const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder().setName("명령어").setDescription("명령어 리스트를 보여드립니다."),
  async execute(interaction) {
    const userid = interaction.user.id;

    try {
      const exampleEmbed = new MessageEmbed()
        .setColor('#A6FF4D')
        .setTitle('[ 명령어 리스트 ]')
        .addField('🧡', '모코콤퍼니 관련 명령어')
        .addFields(
          { name: '/정보', value: '사원의 정보 제공', inline: true },
          { name: '/갱신', value: '사원의 캐릭터 레벨정보를 갱신(레이드 목록 갱신)', inline: true },
          { name: '/삭제', value: '사원의 캐릭터 목록에서 특정 캐릭터 삭제', inline: true })
        .addField('💛', '캐릭터 관리 명령어')
        .addFields(
          { name: '/숙제', value: '사원의 캐릭터별 숙제 현황 출력', inline: true },
          { name: '/군단장', value: '군단장 레이드 체크 기능', inline: true },
          { name: '/어비스', value: '어비스 던전/레이드 체크 기능', inline: true },
          { name: '/갱신', value: '사원의 캐릭터 레벨정보를 갱신(레이드 목록 갱신)', inline: true })
        .addField('💚', '정보 관련 명령어')
        .addFields(
          { name: '/신고', value: '모코콤퍼니 대나무숲', inline: true },
          { name: '/시너지', value: '시너지 정보를 알려줍니다.', inline: true },
          { name: '/컨닝', value: '레이드 컨닝페이퍼를 띄워줍니다.', inline: true },
          { name: '/가자', value: '정기선 최저가 루트를 찾아줍니다.', inline: true })
        .setFooter("/명령어 후 탭을 누르면 안정적으로 명령어를 실행합니다.");
      await interaction.reply({ embeds: [exampleEmbed] })
    } catch (err) {
      errorHandling(userid, '00_info 01 execute', err)
    }
  }
}

function errorHandling(userid, exp, error) {
  const today = new Date(+new Date() + 3240 * 10000)
  const date = today.toISOString().split("T")[0];
  const ts = today.toISOString().replace("T", " ").replace(/\..*/, '');

  const filePath = `./log/log_${date}.csv`;
  !fs.existsSync(filePath) ? fs.writeFileSync(filePath, 'timestamp,userid,exp,error') : null;
  fs.appendFileSync(filePath, `\r\n${ts},${userid},${exp},${error.stack.replace(/\n|\r/g, '\t')}`);
}