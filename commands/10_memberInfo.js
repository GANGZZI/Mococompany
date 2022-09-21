const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.Database);
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder().setName("정보").setDescription("사원 정보를 보여드립니다."),
  async execute(interaction) {
    const userid = interaction.user.id;
    try {
      await interaction.deferReply();
      const username = interaction.user.username;

      let result = await connection(userid);
      let advList;
      if (Array.isArray(result[1]) && result[1].length === 0) {
        advList = "등록된 캐릭터가 없습니다. /등록 명령어로 캐릭터를 등록하세요."
      } else {
        advList = result[1].join("\n")
      }

      if (result[0] != null) {
        exampleEmbed = new MessageEmbed().setColor('#A6FF4D')
          .setTitle('[ 사원 정보 ]')
          .addField(`💚 ${result[0].username}`, "- - - - - - - - - -")
          .addField(result[0].userposition, '사번 [' + userid.substring(0, 14).replace(/[0-9a-zA-Z]/g, "*") + userid.substring(14) + "]")
          .addField('보유 캐릭터', advList)
      } else {
        exampleEmbed = new MessageEmbed().setColor('#A6FF4D')
          .setTitle('[ 사원 정보 ]')
          .addField(`💚 ${username}`, "- - - - - - - - - - - - - - - - - - - - - - - - - - - - -")
          .addFields(
            { name: '⚠ 사원 정보를 찾을 수 없습니다.', value: '/입사 명령어로 사원 정보를 등록해주세요.', inline: true }
          );
      }
      await interaction.editReply({ embeds: [exampleEmbed] });
    } catch (err) {
      errorHandling(userid, '04_memberInfo 01 execute', err)
      console.log(error)
      await interaction.editReply("error!");
    }
  }
}

async function connection(userid) {
  let item;

  try {
    await client.connect();

    const database = client.db("mococompany");
    const col = database.collection("mococo");

    const query = { _id: userid };
    const result = await col.findOne(query);

    item = result
    console.log(`SUCCESS: selecting a document with the _id: ${userid}`);
  } catch (err) {
    console.log(`FAILURER: selecting a document. error: ${err}`);
    errorHandling(userid, '04_memberInfo 02 mococo select', err)
  } finally {
    await client.close();
  }

  if (item == null) return [item]

  let item2 = [];

  try {
    await client.connect();

    const database = client.db("mococompany");
    const col = database.collection("adventurer");

    const query = { userid: userid };
    const cursor = col.find(query).sort({ "level": -1 });
    await cursor.forEach(function(myDoc) { item2.push(`${myDoc.job} **${myDoc._id}**(Lv.${myDoc.level})`); });

    console.log(`SUCCESS: selecting a document with the userid: ${userid}`);
  } catch (err) {
    console.log(`FAILURER: selecting a document. error: ${err}`);
    errorHandling(userid, '04_memberInfo 03 adventurer select', err)
  } finally {
    await client.close();
  }

  return [item, item2]
}

function errorHandling(userid, exp, error) {
  const today = new Date(+new Date() + 3240 * 10000)
  const date = today.toISOString().split("T")[0];
  const ts = today.toISOString().replace("T", " ").replace(/\..*/, '');

  const filePath = `./log/log_${date}.csv`;
  !fs.existsSync(filePath) ? fs.writeFileSync(filePath, 'timestamp,userid,exp,error') : null;
  fs.appendFileSync(filePath, `\r\n${ts},${userid},${exp},${error.stack.replace(/\n|\r/g, '\t')}`);
}