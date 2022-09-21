const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.Database);
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder().setName("입사")
    .setDescription("모코콤퍼니에 입사를 요청합니다.")
    .addStringOption(option => option.setName('닉네임')
      .setDescription('본인 닉네임을 입력하세요.').setRequired(true)),
  async execute(interaction){
    const userid = interaction.user.id;
    try{
      await interaction.deferReply();
      const discordname = interaction.user.username;
      const username = interaction.options.getString('닉네임');
      
      let item = await connection(username, userid);
      
      if(item == 1){
        const exampleEmbed = new MessageEmbed()
          .setColor('#A6FF4D')
          .setTitle('[ 등록 정보 ]')
          .addField('결과', discordname + '님 입사 요청을 완료했습니다. 모코콤퍼니 정상 이용이 가능합니다.')
        
        await interaction.editReply({ embeds: [exampleEmbed] });
      }else{
        const exampleEmbed = new MessageEmbed()
          .setColor('#A6FF4D')
          .setTitle('[ 등록 정보 ]')
          .addField('결과', discordname + '님은 이미 입사 처리되어있을 수 있습니다. 문제시 관리자에 문의해주세요.')
        
        await interaction.editReply({ embeds: [exampleEmbed] });
      }
    } catch (err){
      errorHandling(userid, '01_mococo 01 execute', err)
    }
  }
}

async function connection(username, userid) {
  let item = 0;
  try {
    await client.connect();
    
    const database = client.db("mococompany");
    const col = database.collection("mococo");

    const doc = { _id : userid, username : username, userposition : '사원' };
    const result = await col.insertOne(doc);

    console.log(`SUCCESS: inserting a document with the _id: ${result.insertedId}`);
    item = 1;
  } catch (err) {
    console.log(`FAILURER: inserting a document. error: ${err}`);
    errorHandling(userid, '01_mococo 02 mococo insert', err)
    item = -1;
  } finally {
    await client.close();
  }

  return item;
}

function errorHandling(userid, exp, error) {
  const today = new Date(+new Date() + 3240 * 10000)
  const date = today.toISOString().split("T")[0];
  const ts = today.toISOString().replace("T", " ").replace(/\..*/, '');

  const filePath = `./log/log_${date}.csv`;
  !fs.existsSync(filePath) ? fs.writeFileSync(filePath, 'timestamp,userid,exp,error') : null;
  fs.appendFileSync(filePath, `\r\n${ts},${userid},${exp},${error.stack.replace(/\n|\r/g, '\t')}`);
}