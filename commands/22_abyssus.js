const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed, } = require("discord.js");
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.Database);
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("어비스").setDescription("어비스 던전/레이드 체크 메뉴를 호출합니다!")
    .addStringOption(option => option.setName('닉네임')
      .setDescription('캐릭터 닉네임을 입력하세요.')
      .setRequired(true)),
  async execute(interaction) {
    const userid = interaction.user.id;
    try {
      await interaction.deferReply({ ephemeral: true });
      const charname = interaction.options.getString('닉네임');

      const buttons = [
        // 각 버튼을 배열(array) 자료구조로 만들어요
        {
          customId: "0",
          label: "🟢",
          style: "SECONDARY",
        },
        {
          customId: "1",
          label: "🟡",
          style: "SECONDARY",
        },
        {
          customId: "2",
          label: "🔴",
          style: "SECONDARY",
        },
      ];

      let reply = await connection(charname, buttons, userid);
      interaction.editReply(reply);

      // 이하 반응 수집
      const filter = (interaction) => {
        return buttons.filter(
          (button) => button.customId === interaction.customId
        );
      };

      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 60 * 1000, // 몇초동안 반응할 수 있는지, ms단위라서 3초면 3000으로 입력
      });

      collector.on("collect", async (interaction) => {
        const button = buttons.find(
          (button) => button.customId === interaction.customId
        );
        await buttonAction(interaction, button.customId, charname, userid)
      });
    } catch (err) {
      errorHandling(userid, '11_abyssus 01 execute', err)
    }
  }
};

async function connection(charname, buttons, userid) {
  let item = null;

  try {
    await client.connect();

    const database = client.db("mococompany");
    const col = database.collection("adventurer");

    const query = { _id: charname };
    const result = await col.findOne(query);

    console.log(`[adventurer] SUCCESS: selecting a document with the _id: ${charname}`);
    item = result;

  } catch (err) {
    console.log(`[adventurer] FAILURER: selecting a document. error: ${err}`);
    errorHandling(userid, '11_abyssus 02 adventurer select', err)
  } finally {
    await client.close();

    if (item == null) {
      const embed = new MessageEmbed()
        .setTitle("[ 어비스 던전/레이드 / 조회 불가 ]")
        .setColor('#B22222')
        .setDescription(`🤔 ${charname} : 등록된 닉네임이 맞는 지 확인해주세요.`)
        .setFooter("/등록 명령어로 캐릭터를 등록할 수 있습니다.")
      return { embeds: [embed] }
    }
  }

  const row = new MessageActionRow().addComponents(
    buttons.map((button) => {
      return new MessageButton()
        .setCustomId(button.customId)
        .setLabel(button.label)
        .setStyle(button.style);
    })
  );

  const embed = new MessageEmbed()
    .setTitle("[ 어비스 던전/레이드 ]")
    .setColor('#A6FF4D')
    .setDescription(charname + "의 어비스 던전/레이드 현황")
    .addFields(
      { name: "🟢오레하", value: item.abyssus0.toString(), inline: true },
      { name: "🟡아르고스", value: item.abyssus1.toString(), inline: true },
      { name: "🔴카양겔", value: item.abyssus2.toString(), inline: true })
    .setFooter('상호작용 오류라고 표시되도 정상처리 됩니다. (왜그러는지모르겠음)')

  return { embeds: [embed], components: [row] }
}

async function buttonAction(interaction, customId, charname, userid) {
  let raid = "";
  let needUpt = true;
  let change = null;
  let uptContent = ""

  try {
    await client.connect();

    const database = client.db("mococompany");
    const col = database.collection("adventurer");

    const query = { _id: charname };
    const result = await col.findOne(query);

    console.log(`[adventurer] SUCCESS: selecting a document with the _id: ${charname}`);
    item = result;

    switch (customId) {
      case "0":
        raid = "🟢오레하";
        if (item.abyssus0[1] == "가능") {
          item.abyssus0[1] = "완료"
          change = { "abyssus0.1": "완료" }
        } else if (item.abyssus0[1] == "완료") {
          item.abyssus0[1] = "가능"
          change = { "abyssus0.1": "가능" }
        } else { needUpt = false; }
        break;
      case "1":
        raid = "🟡아르고스";
        if (item.abyssus1[1] == "가능") {
          item.abyssus1[1] = "완료"
          change = { "abyssus1.1": "완료" }
        } else if (item.abyssus1[1] == "완료") {
          item.abyssus1[1] = "가능"
          change = { "abyssus1.1": "가능" }
        } else { needUpt = false; }
        break;
      case "2":
        raid = "🔴카양겔";
        if (item.abyssus2[1] == "가능") {
          item.abyssus2[1] = "완료"
          change = { "abyssus2.1": "완료" }
        } else if (item.abyssus2[1] == "완료") {
          item.abyssus2[1] = "가능"
          change = { "abyssus2.1": "가능" }
        } else { needUpt = false; }
        break;
    }

    if (needUpt) {
      const options = { upsert: true };
      const result = await col.updateOne(query, { $set: change }, options);
      console.log(`updated ${result.modifiedCount} document(s)`);

      uptContent = raid + " 어비스 던전/레이드 상태정보를 업데이트 했습니다."
    } else {
      uptContent = raid + " 어비스 던전/레이드 상태정보는 입장불가 등의 이유로 업데이트 할 수 없습니다."
    }
  } catch (err) {
    console.log(`[adventurer] FAILURER: selecting a document. error: ${err}`);
    errorHandling(userid, '11_abyssus 03 adventurer select or update', err)
    return
  } finally {
    await client.close();
  }

  const embed = new MessageEmbed()
    .setTitle("[ 어비스 던전/레이드 ]")
    .setColor('#A6FF4D')
    .setDescription(charname + "의 어비스 던전/레이드 현황")
    .addFields(
      { name: "🟢오레하", value: item.abyssus0.toString(), inline: true },
      { name: "🟡아르고스", value: item.abyssus1.toString(), inline: true },
      { name: "🔴카양겔", value: item.abyssus2.toString(), inline: true })
    .setFooter('상호작용 오류라고 표시되도 정상처리 됩니다. (왜그러는지모르겠음)')

  try {
    await interaction.update({
      content: uptContent,
      embeds: [embed],
      components: [],
    });
  } catch (err) {
    errorHandling(userid, '11_abyssus 04 interaction update', err)
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