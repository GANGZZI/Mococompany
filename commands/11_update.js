const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, } = require("discord.js");
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.Database);
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("갱신").setDescription("보유 캐릭터의 레벨을 갱신하여 숙제 리스트를 업데이트합니다")
    .addStringOption(option => option.setName('닉네임')
      .setDescription('캐릭터 닉네임을 입력하세요. 닉네임을 입력하지 않으면 보유 캐릭터 전체 업데이트를 진행합니다.')),
  async execute(interaction) {
    const userid = interaction.user.id;
    const username = interaction.user.username;
    try {
      await interaction.deferReply({ ephemeral: true });
      const charname = interaction.options.getString('닉네임');
      let result = await update(userid, charname)

      exampleEmbed = new MessageEmbed().setColor('#A6FF4D')
        .setTitle('[ 갱신 정보 ]')
        .addField(`아래 ${username}님의 캐릭터 레벨을 갱신했습니다.`, result.join("\n"))
        .setFooter('(참고) 매주 로요일에 자동 업데이트 됩니다.')

      await interaction.editReply({ embeds: [exampleEmbed] });
    } catch (err) {
      errorHandling(userid, '21_update 01 execute', err)
    }
  }
};


async function update(userid, charname) {
  let item = [];

  try {
    await client.connect();

    const database = client.db('mococompany');
    const col = database.collection('adventurer');

    var query;

    if (charname == null) {
      query = { userid: userid };
    } else {
      query = { _id: charname };
    }
    const cursor = col.find(query);
    await cursor.forEach(function(myDoc) {
      item.push([myDoc._id, myDoc.level])
    });

    var i = 0;
    for (var adv of item) {
      const codename = encodeURI(adv[0]);
      const beforeLevel = adv[1];

      const url = `https://lostark.game.onstove.com/Profile/Character/${codename}`
      const html = await axios.get(url)
      const $ = cheerio.load(html.data);
      const level = $(".level-info2__item span:nth-of-type(2)").text().substring(3).replace(',', '');

      console.log(`${adv[0]} : before ${beforeLevel} / level ${level}`)
      if (beforeLevel >= level) {
        console.log('갱신 불필요 level:' + level)
        item[i][1] += ' (변동없음)';
        i++;
        continue;
      }
      item[i][1] += ' > ' + level;
      i++;

      if (level < 1385) {
        levValtan = '레벨제한'
        levBkiss = '레벨제한'
        levKouku = '레벨제한'
        levAbrel = '레벨제한'
        levIllak = '레벨제한'
      } else if (level < 1415) {
        levValtan = '레벨제한'
        levBkiss = '레벨제한'
        levKouku = '리허설'
        levAbrel = '레벨제한'
        levIllak = '레벨제한'
      } else if (level < 1430) {
        levValtan = '노말'
        levBkiss = '레벨제한'
        levKouku = '리허설'
        levAbrel = '레벨제한'
        levIllak = '레벨제한'
      } else if (level < 1445) {
        levValtan = '노말'
        levBkiss = '노말'
        levKouku = '리허설'
        levAbrel = '데자뷰'
        levIllak = '레벨제한'
      } else if (level < 1460) {
        levValtan = '하드'
        levBkiss = '노말'
        levKouku = '리허설'
        levAbrel = '데자뷰'
        levIllak = '레벨제한'
      } else if (level < 1475) {
        levValtan = '하드'
        levBkiss = '하드'
        levKouku = '리허설'
        levAbrel = '데자뷰'
        levIllak = '레벨제한'
      } else if (level < 1490) {
        levValtan = '하드'
        levBkiss = '하드'
        levKouku = '노말'
        levAbrel = '데자뷰'
        levIllak = '레벨제한'
      } else if (level < 1500) {
        levValtan = '하드'
        levBkiss = '하드'
        levKouku = '노말'
        levAbrel = '노말12'
        levIllak = '레벨제한'
      } else if (level < 1520) {
        levValtan = '하드'
        levBkiss = '하드'
        levKouku = '노말'
        levAbrel = '노말14'
        levIllak = '에피데믹'
      } else if (level < 1540) {
        levValtan = '하드'
        levBkiss = '하드'
        levKouku = '노말'
        levAbrel = '노말16'
        levIllak = '에피데믹'
      } else if (level < 1550) {
        levValtan = '하드'
        levBkiss = '하드'
        levKouku = '노말'
        levAbrel = '하드12노말36'
        levIllak = '에피데믹'
      } else if (level < 1560) {
        levValtan = '하드'
        levBkiss = '하드'
        levKouku = '노말'
        levAbrel = '하드14노말56'
        levIllak = '에피데믹'
      } else if (level < 1580) {
        levValtan = '하드'
        levBkiss = '하드'
        levKouku = '노말'
        levAbrel = '하드16'
        levIllak = '에피데믹'
      } else if (level < 1600) {
        levValtan = '하드'
        levBkiss = '하드'
        levKouku = '노말'
        levAbrel = '하드16'
        levIllak = '노말'
      } else {
        levValtan = '하드'
        levBkiss = '하드'
        levKouku = '노말'
        levAbrel = '하드16'
        levIllak = '하드'
      }

      if (level < 1325) {
        levAbs0 = '레벨제한'
        levAbs1 = '레벨제한'
        levAbs2 = '레벨제한'
      } else if (level < 1355) {
        levAbs0 = '노말'
        levAbs1 = '레벨제한'
        levAbs2 = '레벨제한'
      } else if (level < 1370) {
        levAbs0 = '하드'
        levAbs1 = '레벨제한'
        levAbs2 = '레벨제한'
      } else if (level < 1385) {
        levAbs0 = '하드'
        levAbs1 = '1페이즈'
        levAbs2 = '레벨제한'
      } else if (level < 1400) {
        levAbs0 = '하드'
        levAbs1 = '2페이즈'
        levAbs2 = '레벨제한'
      } else if (level < 1415) {
        levAbs0 = '골드보상X'
        levAbs1 = '3페이즈'
        levAbs2 = '레벨제한'
      } else if (level < 1475) {
        levAbs0 = '골드보상X'
        levAbs1 = '골드보상X'
        levAbs2 = '레벨제한'
      } else if (level < 1520) {
        levAbs0 = '골드보상X'
        levAbs1 = '골드보상X'
        levAbs2 = '노말'
      } else if (level < 1560) {
        levAbs0 = '골드보상X'
        levAbs1 = '골드보상X'
        levAbs2 = '하드1'
      } else if (level < 1580) {
        levAbs0 = '골드보상X'
        levAbs1 = '골드보상X'
        levAbs2 = '하드2'
      } else {
        levAbs0 = '골드보상X'
        levAbs1 = '골드보상X'
        levAbs2 = '하드3'
      }

      const filter = { '_id': adv[0] };
      await col.updateOne(filter, {
        $set: {
          "valtan.0": levValtan,
          "bkiss.0": levBkiss,
          "kouku.0": levKouku,
          "abrel.0": levAbrel,
          "illak.0": levIllak,
          "abyssus0.0": levAbs0,
          "abyssus1.0": levAbs1,
          "abyssus2.0": levAbs2,
          "level": level,
        }
      });
    }
  } catch (err) {
    console.log(`FAILURER: inserting a document. error: ${err}`);
    errorHandling(userid, '21_update 02 adventurer select or update', err)
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