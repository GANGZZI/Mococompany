const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.Database);
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder().setName("멤버").setDescription("멤버 리스트를 보여드립니다."),
    async execute(interaction){
      const userid = interaction.user.id;
      try{
        await interaction.deferReply();
        let result = await connection(userid);
        
        const exampleEmbed = new MessageEmbed()
          .setColor('#A6FF4D')
          .setTitle('[ 모코콤퍼니 멤버 리스트 ]')
          .addField('인턴부터 사장까지', result.join(" / "))
        
        await interaction.editReply({ embeds: [exampleEmbed] })
      } catch (err){
        errorHandling(userid, '03_member 01 execute', err)
      }
    }
}

async function connection(userid) {
  let item = [];

  try {
    await client.connect();
    
    const database = client.db('mococompany');
    const col = database.collection('mococo');

    const projection = { _id: 0, username: 1 };
    const cursor = col.find().project(projection);
    await cursor.forEach(function(myDoc){ item.push(myDoc.username); } );
  } catch (err) {
    console.log(err.stack);
    errorHandling(userid, '03_member 02 mococo select', err)
  }
  
  client.close();

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