const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("가자")
    .setDescription("주머니 사정을 고려한 루트 제공 #로웬 업데이트 예정")
    .addStringOption(option => option.setName('출발지')
      .setDescription('출발지를 선택하세요.')
      .setRequired(true)
      .addChoices({ name: '루테란동부', value: '0' },
        { name: '토토이크', value: '1' },
        { name: '애니츠', value: '2' },
        { name: '아르데타인', value: '3' },
        { name: '베른북부', value: '4' },
        { name: '슈샤이어', value: '5' },
        { name: '로헨델', value: '6' },
        { name: '욘', value: '7' },
        { name: '페이튼', value: '8' },
        { name: '파푸니카', value: '9' },
        { name: '베른남부', value: '10' },
        { name: '로웬', value: '11' }))
    .addStringOption(option => option.setName('도착지')
      .setDescription('도착지를 선택하세요.')
      .setRequired(true)
      .addChoices({ name: '루테란동부', value: '0' },
        { name: '토토이크', value: '1' },
        { name: '애니츠', value: '2' },
        { name: '아르데타인', value: '3' },
        { name: '베른북부', value: '4' },
        { name: '슈샤이어', value: '5' },
        { name: '로헨델', value: '6' },
        { name: '욘', value: '7' },
        { name: '페이튼', value: '8' },
        { name: '파푸니카', value: '9' },
        { name: '베른남부', value: '10' },
        { name: '로웬', value: '11' })),
  async execute(interaction) {
    const userid = interaction.user.id;
    try {
      const result = getResult(interaction.options.getString("출발지"), interaction.options.getString("도착지"))
      var info = result.split(",")
      
      if (info.length == 5) {
        const exampleEmbed = new MessageEmbed().setColor('#A6FF4D')
          .setTitle('[ 정기선 최저가 루트 정보 ]')
          .addFields(
            { name: '출 발 지', value: info[0], inline: true },
            { name: '~', value: '^0^/', inline: true },
            { name: '도 착 지', value: info[1], inline: true },
            { name: '추천 루트', value: info[2] + " 추천!!", inline: true },
            { name: '요    금', value: info[3] + " 실링", inline: true },
            { name: '경 유 지', value: info[4], inline: true },
          )
          .setFooter("#엘가시아는 천공의 노래나 파푸니카를 통해 가주세요.");
        await interaction.reply({ embeds: [exampleEmbed] })
      } else {
        const exampleEmbed = new MessageEmbed()
          .setColor('#A6FF4D')
          .setTitle('[ 정기선 최저가 루트 정보 ]')
          .addFields(
            { name: '출 발 지', value: info[0], inline: true },
            { name: '~', value: '^0^/', inline: true },
            { name: '도 착 지', value: info[1], inline: true },
            { name: '추천 루트', value: info[2] + " 추천!!", inline: true },
            { name: '요    금', value: info[3] + " 실링", inline: true }
          )
          .setFooter("#엘가시아는 천공의 노래나 파푸니카를 통해 가주세요.");
        await interaction.reply({ embeds: [exampleEmbed] })
      }
    } catch (err) {
      errorHandling(userid, '90_direction 01 execute', err)
    }
  }
}

function getResult(departure, arrival) {
  //대륙 배열
  const continent_arr = ['루테란동부', '토토이크', '애니츠', '아르데타인', '베른북부', '슈샤이어', '로헨델', '욘', '페이튼', '파푸니카', '베른남부', '로웬'];
  //정기선 가격
  const price_arr = [[1000000, 1100, 2000, 3400, 2100, 5000, 1000000, 10000, 11000, 7600, 5500, 9600],
  [1100, 1000000, 1100, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000],
  [2000, 1100, 1000000, 1600, 2000, 4200, 1000000, 13000, 13000, 11000, 6900, 8900],
  [3400, 1000000, 1600, 1000000, 2100, 2900, 1000000, 14000, 12000, 12000, 7000, 7000],
  [2100, 1000000, 2000, 2100, 1000000, 2600, 5700, 9500, 8400, 7600, 3000, 5600],
  [5000, 1000000, 4200, 2900, 2600, 1000000, 6000, 11000, 6800, 10000, 4800, 2100],
  [1000000, 1000000, 1000000, 1000000, 7000, 7300, 1000000, 4400, 4100, 4900, 5500, 9700],
  [13000, 1000000, 17000, 18000, 13000, 14000, 4900, 1000000, 10000, 6100, 13000, 20000],
  [17000, 1000000, 19000, 18000, 13000, 10000, 5200, 12000, 1000000, 15000, 12000, 12000],
  [12000, 1000000, 18000, 20000, 12000, 17000, 6500, 7400, 16000, 1000000, 12000, 25000],
  [8900, 1000000, 11000, 11000, 3000, 7700, 7300, 16000, 13000, 12000, 1000000, 12000],
  [15000, 1000000, 14000, 11000, 9100, 3400, 13000, 24000, 13000, 25000, 12000, 1000000]];

  //출발지 가격
  const departure_arr = price_arr[departure];
  const arrival_arr = [];
  for (var i = 0; i < price_arr[departure].length; i++) {
    arrival_arr[i] = price_arr[i][arrival];
  }

  //직항 가격
  const directPrice = arrival_arr[departure];

  //경유 가격
  const indirect_arr = [];

  for (var i = 0; i < price_arr[departure].length; i++) {
    indirect_arr[i] = departure_arr[i] + arrival_arr[i];
  }
  const totalPrice = Math.min.apply(Math, indirect_arr);

  if (directPrice < totalPrice) {
    return `${continent_arr[departure]},${continent_arr[arrival]},직행,${directPrice}`
  } else if (continent_arr[indirect_arr.indexOf(totalPrice)] === '베른남부' ||
    continent_arr[indirect_arr.indexOf(totalPrice)] === '베른북부') {
    return `${continent_arr[departure]},${continent_arr[arrival]},경유,${totalPrice},${continent_arr[indirect_arr.indexOf(totalPrice)]}(스퀘어홀 이용)`;
  } else {
    console.log(`${continent_arr[departure]},${continent_arr[arrival]},경유,${totalPrice},${continent_arr[indirect_arr.indexOf(totalPrice)]}`)
    return `${continent_arr[departure]},${continent_arr[arrival]},경유,${totalPrice},${continent_arr[indirect_arr.indexOf(totalPrice)]}`;
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