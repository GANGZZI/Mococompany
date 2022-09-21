const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.Database);
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder().setName("삭제")
      .setDescription("사원 정보 및 캐릭터 정보를 삭제합니다.")
      .addStringOption(option => option.setName('닉네임')
        .setDescription('캐릭터 닉네임을 입력하세요.').setRequired(true)),
    async execute(interaction){
      const userid = interaction.user.id;
      try{
        await interaction.deferReply();
        const username = interaction.user.username;
        const charname = interaction.options.getString('닉네임');
        
        const row = new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId("select")
            .setPlaceholder('귀찮아서 롤백같은 건 없습니다. 신중하게!')
            .addOptions([
              {
                label: '네',
                description: '해당 캐릭터 정보를 삭제합니다.',
                value: "0",
              },
              {
                label: '아니요',
                description: '삭제 요청을 취소합니다.',
                value: "1",
              },
            ])
        );
  
        await interaction.editReply(
        { content: "⚠ 진짜진짜 캐릭터를 삭제하시겠습니까?\n", components: [row] });
  
      const filter = (interaction) => {
        return interaction.customId === "select";
      };
  
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 60 * 1000,
      });
  
      let isSuccess;
      let message;
  
      collector.on("collect", async (interaction1) => {
        if (interaction1.customId === "select") {
          const selectedValue = interaction1.values[0];
          console.log("selection:"+selectedValue)
          if (selectedValue === "0") {
            interaction.deleteReply()
            interaction1.deferReply()
            
            isSuccess = await deleteAdv(charname, userid);
            console.log('isSuccess:'+isSuccess)
            message = `👋 ${username}님의 캐릭터 목록에서 ${charname} 을/를 삭제했습니다.`;
            
            embed = await makeEmbed(isSuccess, message)
            
            interaction1.editReply(embed);
            setTimeout(() => interaction1.deleteReply(), 6000);
          } else if(selectedValue === "1"){
            interaction.deleteReply()
            interaction1.deferReply()
            
            embed = new MessageEmbed()
              .setTitle("[ 삭제 처리 취소 ]")
              .setColor('#B22222')
              .setImage('https://upload3.inven.co.kr/upload/2021/08/27/bbs/i16186153027.png?MW=800')
            
            interaction1.editReply({ content: '👋', embeds: [embed], components: [] });
            setTimeout(() => interaction1.deleteReply(), 6000);
          }
        } 
      });
        
      collector.on("end", async (collect) => {
        console.log("시간초과!");
      });
    } catch(err){
      errorHandling(userid, '20_delete 01 execute', err)  
    }
  }
}

async function makeEmbed(isSuccess, message){
  if(isSuccess){
    embed = new MessageEmbed()
      .setTitle("[ 삭제 처리 완료 ]")
      .setColor('#A6FF4D')
      .setDescription(message)
      .setFooter("/등록 명령어로 다시 캐릭터를 등록할 수 있습니다.")
  } else {
    embed = new MessageEmbed()
      .setTitle("[ 삭제 처리 실패 ]")
      .setColor('#B22222')
      .setDescription(`🤔 문의 남겨주시면 담당자가 해결할 수 있도록 하겠습니다.\n삭제하고자 하는 정보를 포함하여 문의 남겨주세요.`)
      .setFooter("/문의 명령어로 담당자에게 문의사항을 전달할 수 있습니다.")
  }
  
  return { embeds: [embed] }
}

async function deleteAdv(charname, userid) {
  let isSuccess = true;

  console.log(`DB CONNECT : ADVENTURER`);
  console.log(charname)
  
  try {
    await client.connect();
    
    const database = client.db('mococompany');
    const col = database.collection('adventurer');
    const query = { _id : charname, userid : userid };
    const result = await col.deleteOne(query);

    if (result.deletedCount === 1) {
      console.log(`Successfully deleted one document. _id: ${charname}`);
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }
  } catch (err) {
    console.log(err.stack);
    errorHandling(userid, '20_delete 02 adventurer delete', err)
    isSuccess = false;
  } finally {
    await client.close();
  }
  
  return isSuccess;
}

function errorHandling(userid, exp, error) {
  const today = new Date(+new Date() + 3240 * 10000)
  const date = today.toISOString().split("T")[0];
  const ts = today.toISOString().replace("T", " ").replace(/\..*/, '');

  const filePath = `./log/log_${date}.csv`;
  !fs.existsSync(filePath) ? fs.writeFileSync(filePath, 'timestamp,userid,exp,error') : null;
  fs.appendFileSync(filePath, `\r\n${ts},${userid},${exp},${error.stack.replace(/\n|\r/g, '\t')}`);
}