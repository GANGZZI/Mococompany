const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

const info = [
  ['아브렐슈드', '하드 [12관문]',
    'https://upload3.inven.co.kr/upload/2022/03/31/bbs/i15984978082.jpg'],
  ['아브렐슈드', '하드 [34관문]',
    'https://upload3.inven.co.kr/upload/2022/03/31/bbs/i13928165465.jpg'],
  ['아브렐슈드', '하드 [5관문]',
    'https://upload3.inven.co.kr/upload/2022/04/01/bbs/i16395458077.jpg'],
  ['아브렐슈드', '하드 [6관문]',
    'https://upload3.inven.co.kr/upload/2022/04/01/bbs/i13747124221.jpg'],
  ['아브렐슈드', '노말 [12관문]',
    'https://upload3.inven.co.kr/upload/2022/01/25/bbs/i15151764498.jpg'],
  ['아브렐슈드', '노말 [34관문]',
    'https://upload3.inven.co.kr/upload/2022/01/25/bbs/i15195826235.jpg'],
  ['아브렐슈드', '노말 [56관문]',
    'https://upload3.inven.co.kr/upload/2022/01/25/bbs/i15132968633.jpg'],
  ['카양겔', '천공의 요람',
    'https://upload3.inven.co.kr/upload/2022/05/03/bbs/i13281187293.jpg'],
  ['일리아칸', '노말',
    'https://upload3.inven.co.kr/upload/2022/08/31/bbs/i15390546418.jpg'],
  ['일리아칸', '하드 [12관문]',
    'https://upload3.inven.co.kr/upload/2022/08/28/bbs/i15659597443.jpg'],
  ['일리아칸', '하드 [3관문+]',
    'https://upload3.inven.co.kr/upload/2022/08/28/bbs/i15608513312.jpg'],
  // ['쿠크세이튼', '노말 [13관문]',
  //   'https://upload3.inven.co.kr/upload/2022/01/05/bbs/i13411451557.jpg'],
  // ['비아키스', '노말/하드 [13관문]',
  //   'https://upload3.inven.co.kr/upload/2022/01/05/bbs/i16216326567.jpg'],
  // ['발탄', '노말/하드 [12관문]',
  //   'https://upload3.inven.co.kr/upload/2022/01/05/bbs/i13464248708.jpg']
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("컨닝")
    .setDescription("레이드 컨닝 페이퍼를 제공합니다. # 발비쿠 삭제")
    .addSubcommand(subcommand =>
      subcommand.setName('하브').setDescription('아브렐슈드 하드')
        .addIntegerOption(option => option.setName('관문')
          .setDescription('관문을 선택해주세요.')
          .setRequired(true)
          .addChoices({ name: '12관문', value: 0 },
            { name: '34관문', value: 1 },
            { name: '5관문', value: 2 },
            { name: '6관문', value: 3 })))
    .addSubcommand(subcommand =>
      subcommand.setName('노브').setDescription('아브렐슈드 노말')
        .addIntegerOption(option => option.setName('관문')
          .setDescription('관문을 선택해주세요.')
          .setRequired(true)
          .addChoices({ name: '12관문', value: 4 },
            { name: '34관문', value: 5 },
            { name: '56관문', value: 6 })))
    .addSubcommand(subcommand =>
      subcommand.setName('양갱').setDescription('카양겔')
        .addIntegerOption(option => option.setName('관문')
          .setDescription('관문을 선택해주세요.')
          .setRequired(true)
          .addChoices({ name: '요람', value: 7 })))
    .addSubcommand(subcommand =>
      subcommand.setName('노칸').setDescription('일리아칸 노말')
        .addIntegerOption(option => option.setName('관문')
          .setDescription('관문을 선택해주세요.')
          .setRequired(true)
          .addChoices({ name: '13관문', value: 8 })))
    .addSubcommand(subcommand =>
      subcommand.setName('하칸').setDescription('일리아칸 하드')
        .addIntegerOption(option => option.setName('관문')
          .setDescription('관문을 선택해주세요.')
          .setRequired(true)
          .addChoices({ name: '12관문', value: 9 },
            { name: '3관문+', value: 10 }))),
  async execute(interaction) {
    const userid = interaction.user.id;
    try {
      const selection = interaction.options.getInteger("관문")

      let exampleEmbed = new MessageEmbed()
        .setColor('#A6FF4D')
        .setTitle('[ 레이드 컨닝 페이퍼 ]')
        .addField(info[selection][0], info[selection][1])
        .setImage(info[selection][2]);
      await interaction.reply({ embeds: [exampleEmbed] })
    } catch (err) {
      errorHandling(userid, '33_paper 01 execute', err)
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