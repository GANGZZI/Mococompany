const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.Database);
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder().setName("등록").setDescription("캐릭터 정보를 등록합니다.")
    .addStringOption(option => option.setName('닉네임')
      .setDescription('캐릭터 닉네임을 입력하세요.').setRequired(true)),
  async execute(interaction) {
    const userid = interaction.user.id;
    try {
      await interaction.deferReply();

      const charname = interaction.options.getString('닉네임');
      const codename = encodeURI(charname);
      const username = interaction.user.username;

      const url = `https://lostark.game.onstove.com/Profile/Character/${codename}`
      const html = await axios.get(url)

      const $ = cheerio.load(html.data);
      const warn = $(".profile-attention span:nth-of-type(2)").text();
      const level = $(".level-info2__item span:nth-of-type(2)").text().substring(3).replace(',', '');
      const job = $("img.profile-character-info__img").attr("alt");
      const thum = $("img.profile-character-info__img").attr("src");

      if (warn === '캐릭터명을 확인해주세요.') {
        item = null;
      } else {
        item = connection(charname, userid, level, job);
      }

      if (item == null) {
        const exampleEmbed = new MessageEmbed()
          .setColor('#A6FF4D')
          .setTitle('[ 등록 정보 ]')
          .addField('결과', username + '님의 모험가 리스트에 [' + charname + '] 을/를 등록하지 못했습니다. 이미 등록되어있는지 확인해보세요.')

        await interaction.editReply({ embeds: [exampleEmbed] });
      } else {
        const exampleEmbed = new MessageEmbed()
          .setColor('#A6FF4D')
          .setTitle('[ 등록 정보 ]')
          .setImage(thum)
          .addField('결과', username + '님의 모험가 리스트에 [' + charname + '] 을/를 등록했습니다.')

        await interaction.editReply({ embeds: [exampleEmbed] });
        setTimeout(() => interaction.deleteReply(), 3000);
      }
    } catch (err) {
      errorHandling(userid, '02_adventurer 01 execute', err)
    }
  }
}

async function connection(charname, userid, level, job) {
  let item = null;
  try {
    await client.connect();

    const database = client.db("mococompany");
    const col = database.collection("adventurer");

    console.log(`DB CONNECTION : adventurer`);

    if (level < 1385) {
      levValtan = ['레벨제한', '입장불가']
      levBkiss = ['레벨제한', '입장불가']
      levKouku = ['레벨제한', '입장불가']
      levAbrel = ['레벨제한', '입장불가']
      levIllak = ['레벨제한', '입장불가']
    } else if (level < 1415) {
      levValtan = ['레벨제한', '입장불가']
      levBkiss = ['레벨제한', '입장불가']
      levKouku = ['리허설', '가능']
      levAbrel = ['레벨제한', '입장불가']
      levIllak = ['레벨제한', '입장불가']
    } else if (level < 1430) {
      levValtan = ['노말', '가능']
      levBkiss = ['레벨제한', '입장불가']
      levKouku = ['리허설', '가능']
      levAbrel = ['레벨제한', '입장불가']
      levIllak = ['레벨제한', '입장불가']
    } else if (level < 1445) {
      levValtan = ['노말', '가능']
      levBkiss = ['노말', '가능']
      levKouku = ['리허설', '가능']
      levAbrel = ['데자뷰', '가능']
      levIllak = ['레벨제한', '입장불가']
    } else if (level < 1460) {
      levValtan = ['하드', '가능']
      levBkiss = ['노말', '가능']
      levKouku = ['리허설', '가능']
      levAbrel = ['데자뷰', '가능']
      levIllak = ['레벨제한', '입장불가']
    } else if (level < 1475) {
      levValtan = ['하드', '가능']
      levBkiss = ['하드', '가능']
      levKouku = ['리허설', '가능']
      levAbrel = ['데자뷰', '가능']
      levIllak = ['레벨제한', '입장불가']
    } else if (level < 1490) {
      levValtan = ['하드', '가능']
      levBkiss = ['하드', '가능']
      levKouku = ['노말', '가능']
      levAbrel = ['데자뷰', '가능']
      levIllak = ['레벨제한', '입장불가']
    } else if (level < 1500) {
      levValtan = ['하드', '가능']
      levBkiss = ['하드', '가능']
      levKouku = ['노말', '가능']
      levAbrel = ['노말12', '가능']
      levIllak = ['레벨제한', '입장불가']
    } else if (level < 1520) {
      levValtan = ['하드', '가능']
      levBkiss = ['하드', '가능']
      levKouku = ['노말', '가능']
      levAbrel = ['노말14', '가능']
      levIllak = ['에피데믹', '가능']
    } else if (level < 1540) {
      levValtan = ['하드', '가능']
      levBkiss = ['하드', '가능']
      levKouku = ['노말', '가능']
      levAbrel = ['노말16', '가능']
      levIllak = ['에피데믹', '가능']
    } else if (level < 1550) {
      levValtan = ['하드', '가능']
      levBkiss = ['하드', '가능']
      levKouku = ['노말', '가능']
      levAbrel = ['하드12노말36', '가능']
      levIllak = ['에피데믹', '가능']
    } else if (level < 1560) {
      levValtan = ['하드', '가능']
      levBkiss = ['하드', '가능']
      levKouku = ['노말', '가능']
      levAbrel = ['하드14노말56', '가능']
      levIllak = ['에피데믹', '가능']
    } else if (level < 1580) {
      levValtan = ['하드', '가능']
      levBkiss = ['하드', '가능']
      levKouku = ['노말', '가능']
      levAbrel = ['하드16', '가능']
      levIllak = ['에피데믹', '가능']
    } else if (level < 1600) {
      levValtan = ['하드', '가능']
      levBkiss = ['하드', '가능']
      levKouku = ['노말', '가능']
      levAbrel = ['하드16', '가능']
      levIllak = ['노말', '가능']
    } else {
      levValtan = ['하드', '가능']
      levBkiss = ['하드', '가능']
      levKouku = ['노말', '가능']
      levAbrel = ['하드16', '가능']
      levIllak = ['하드', '가능']
    }

    if (level < 1325) {
      levAbs0 = ['레벨제한', '입장불가']
      levAbs1 = ['레벨제한', '입장불가']
      levAbs2 = ['레벨제한', '입장불가']
    } else if (level < 1355) {
      levAbs0 = ['노말', '가능']
      levAbs1 = ['레벨제한', '입장불가']
      levAbs2 = ['레벨제한', '입장불가']
    } else if (level < 1370) {
      levAbs0 = ['하드', '가능']
      levAbs1 = ['레벨제한', '입장불가']
      levAbs2 = ['레벨제한', '입장불가']
    } else if (level < 1385) {
      levAbs0 = ['하드', '가능']
      levAbs1 = ['1페이즈', '가능']
      levAbs2 = ['레벨제한', '입장불가']
    } else if (level < 1400) {
      levAbs0 = ['하드', '가능']
      levAbs1 = ['2페이즈', '가능']
      levAbs2 = ['레벨제한', '입장불가']
    } else if (level < 1475) {
      levAbs0 = ['골드보상X', '가능']
      levAbs1 = ['3페이즈', '가능']
      levAbs2 = ['레벨제한', '입장불가']
    } else if (level < 1520) {
      levAbs0 = ['골드보상X', '가능']
      levAbs1 = ['골드보상X', '가능']
      levAbs2 = ['노말', '가능']
    } else if (level < 1560) {
      levAbs0 = ['골드보상X', '가능']
      levAbs1 = ['골드보상X', '가능']
      levAbs2 = ['하드1', '가능']
    } else if (level < 1580) {
      levAbs0 = ['골드보상X', '가능']
      levAbs1 = ['골드보상X', '가능']
      levAbs2 = ['하드2', '가능']
    } else {
      levAbs0 = ['골드보상X', '가능']
      levAbs1 = ['골드보상X', '가능']
      levAbs2 = ['하드3', '가능']
    }

    const doc = {
      _id: charname, userid: userid, job: job, level: level,
      valtan: levValtan, bkiss: levBkiss, kouku: levKouku,
      abrel: levAbrel, illak: levIllak,
      abyssus0: levAbs0, abyssus1: levAbs1, abyssus2: levAbs2
    };
    const result = await col.insertOne(doc);

    console.log(`SUCCESS: inserting a document with the _id: ${result.insertedId}`);
    item = result.insertedId;
  } catch (err) {
    console.log(`FAILURER: inserting a document. error: ${err}`);
    errorHandling(userid, '02_adventurer 01 adventurer insert', err)
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