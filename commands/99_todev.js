const { SlashCommandBuilder } = require('@discordjs/builders');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.Database);
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder().setName("개발")
    .setDescription("-")
    .addStringOption(option => option.setName('닉네임')
      .setDescription('캐릭터 닉네임을 입력하세요.')
      .setRequired(true).setAutocomplete(true)),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const userid = interaction.user.id;
    if (userid != '830415397521850388') {
      await interaction.editReply('⚠ 관리자 명령어입니다.');
      setTimeout(() => interaction.deleteReply(), 3000);
    }

    try {
      let item = await connection();
      await interaction.user.send("'" + item.join("','") + "'")
        .then(console.log).catch(console.error);
      await interaction.editReply('전 캐릭터 정보 추출 성공');
    } catch (err) {
      console.log(err)
      await interaction.editReply('전 캐릭터 정보 추출 실패');
    }
  }
}

async function connection() {
  let item = [];

  try {
    await client.connect();

    const database = client.db('mococompany');
    const col = database.collection('adventurer');
    const cursor = col.find();

    await cursor.forEach(async function(myDoc) {
      item.push(myDoc._id)
    });
  } catch (err) {
    console.log(`FAILURER: inserting a document. error: ${err}`);
    errorHandling('auto', '-', err)
  } finally {
    await client.close();
  }

  return item;
}