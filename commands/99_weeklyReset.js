const { SlashCommandBuilder } = require('@discordjs/builders');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.Database);
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const today = new Date(+new Date() + 3240 * 10000)
const date = today.toISOString().split("T")[0];

module.exports = {
  data: new SlashCommandBuilder().setName("주간리셋")
    .setDescription("주간 리셋 수동 실행"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const userid = interaction.user.id;
    if (userid != '830415397521850388') {
      await interaction.editReply('⚠ 관리자 명령어입니다.');
      setTimeout(() => interaction.deleteReply(), 3000);
    }

    try {
      let item = await connection();
      await update(item);

      await interaction.user.send({
        files: [{
          attachment: `./log/autoReset_${date}.csv`,
          name: 'autoReset.csv',
          description: 'the file of the exception logs'
        }]
      }).then(console.log).catch(console.error);

      await interaction.editReply('주간 리셋 수동 실행 완료');
    } catch (err) {
      errorHandling('auto', '99_schedule_test 01 execute', err)
      await interaction.editReply('주간 리셋 수동 실행 실패');
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
    errorHandling('auto', '99_schedule_test 02 adventurer select', err)
  } finally {
    await client.close();
  }

  return item;
}

async function update(item) {
  try {
    await client.connect();

    const database = client.db('mococompany');
    const col = database.collection('adventurer');

    for (var adv of item) {
      const codename = encodeURI(adv);
      const url = `https://lostark.game.onstove.com/Profile/Character/${codename}`
      const html = await axios.get(url)
      const $ = cheerio.load(html.data);
      const level = $(".level-info2__item span:nth-of-type(2)").text().substring(3).replace(',', '');

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

      const filter = { '_id': adv };
      await col.updateOne(filter,
        {
          $set:
          {
            "level": level,
            "valtan": levValtan,
            "bkiss": levBkiss,
            "kouku": levKouku,
            "abrel": levAbrel,
            "illak": levIllak,
            "abyssus0": levAbs0,
            "abyssus1": levAbs1,
            "abyssus2": levAbs2
          }
        });
      makeLog(`${adv},${level},${levValtan.join('/')},${levBkiss.join('/')},${levKouku.join('/')},${levAbrel.join('/')},${levIllak.join('/')},${levAbs0},${levAbs1.join('/')},${levAbs2.join('/')}`)
    }
  } catch (err) {
    console.log(`FAILURER: updating a document. error: ${err}`);
    errorHandling('auto', 'schedule 02 adventurer update', err)
  } finally {
    await client.close();
  }
}

function errorHandling(userid, exp, error) {
  const ts = today.toISOString().replace("T", " ").replace(/\..*/, '');

  const filePath = `./log/log_${date}.csv`;
  !fs.existsSync(filePath) ? fs.writeFileSync(filePath, 'timestamp,userid,exp,error') : null;
  fs.appendFileSync(filePath, `\r\n${ts},${userid},${exp},${error.stack.replace(/\n|\r/g, '\t')}`);
}

function makeLog(message) {
  const today = new Date(+new Date() + 3240 * 10000)
  const date = today.toISOString().split("T")[0];
  const ts = today.toISOString().replace("T", " ").replace(/\..*/, '');

  const filePath = `./log/autoReset_${date}.csv`;
  !fs.existsSync(filePath) ? fs.writeFileSync(filePath, '캐릭터명,레벨,발탄,비아키스,쿠크세이튼,아브렐슈드,일리아칸,오레하,아르고스,카양겔,timestamp') : null;
  fs.appendFileSync(filePath, `\r\n${message},${ts}`);
}