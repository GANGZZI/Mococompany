const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, } = require("discord.js");
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.Database);
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("숙제").setDescription("본인 캐릭터들의 숙제 현황을 출력합니다.")
    .addIntegerOption(option => option.setName('옵션')
      .setDescription('심플: 남은 숙제만(골드O 리허설X 데자뷰X) / 수입: 노말,하드 숙제(골드O 리허설X 데자뷰X) / 상세: 전체 숙제(골드X 리허설 데자뷰 포함) / 어비스 / 군단장')
      .addChoices(
        { name: '심플', value: 0 },
        { name: '수입', value: 1 },
        { name: '상세', value: 2 },
        { name: '어비스', value: 3 },
        { name: '군단장', value: 4 },
      ).setRequired(true)),
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const userid = interaction.user.id;
      const option = interaction.options.getInteger("옵션")

      let reply = await connection(userid, option);
      interaction.editReply(reply);
    } catch (err) {
      errorHandling(userid, '10_homework 01 execute', err)
    }
  }
};

async function connection(userid, option) {
  let username = null;

  try {
    await client.connect();

    const database = client.db("mococompany");
    const col = database.collection("mococo");

    const query = { _id: userid };
    const result = await col.findOne(query);

    console.log(`[mococo] SUCCESS: selecting a document with the _id: ${userid}`);
    if (result != null) {
      username = result.username;
    }
  } catch (err) {
    console.log(`[mococo] FAILURER: selecting a document. error: ${err}`);
    errorHandling(userid, '10_homework 01 mococo select', err)
  } finally {
    await client.close();

    if (username == null) {
      const embed = new MessageEmbed()
        .setTitle("[ 숙제 현황 정보 / 조회 불가 ]")
        .setColor('#B22222')
        .setDescription(`🤔 ${userid} : 사원 등록을 먼저 진행해주세요.`)
        .setFooter("/입사 명령어로 모코콤퍼니 멤버가 될 수 있습니다.")
      return { embeds: [embed] }
    }
  }

  let embed = new MessageEmbed()
    .setColor('#A6FF4D')
    .setFooter('/어비스, /군단장 명령어로 숙제 관리를 할 수 있습니다.')
  switch (option) {
    case 0:
      embed.setTitle("[ 숙제 현황 정보 : 심플 ]")
      embed.setDescription(username + "님의 골드 수입이 가능한 남은 숙제 현황")
      break;
    case 1:
      embed.setTitle("[ 숙제 현황 정보 : 수입 ]")
      embed.setDescription(username + "님의 골드 수입이 가능한 숙제 현황")
      break;
    case 2:
      embed.setTitle("[ 숙제 현황 정보 : 상세 ]")
      embed.setDescription(username + "님의 전체 숙제 현황")
      break;
    case 3:
      embed.setTitle("[ 숙제 현황 정보 : 어비스 ]")
      embed.setDescription(username + "님의 어비스 던전/레이드 숙제 현황")
      break;
    case 4:
      embed.setTitle("[ 숙제 현황 정보 : 군단장 ]")
      embed.setDescription(username + "님의 군단장 레이드 숙제 현황")
      break;
  }

  try {
    await client.connect();

    const database = client.db("mococompany");
    const col = database.collection("adventurer");

    const query = { userid: userid };
    const cursor = col.find(query).sort({ "level": -1 });
    console.log(cursor.toString())

    await cursor.forEach(function(myDoc) {
      embedName = `:ballot_box_with_check: ${myDoc._id}(${myDoc.job})`
      embedValue = ""
      //new 심플:0 / 수입:1 / 상세:2 / 어비스:3 / 군단장:4
      embedValue += check(0, myDoc, option);
      if (embedValue != '') embedValue += "\n"
      embedValue += check(1, myDoc, option);
      if (embedValue == '') embedValue = '(해당 사항 없음)'
      embed.addField(embedName, embedValue)
    });

    console.log(`[adventurer] SUCCESS: selecting a document with the userid: ${userid}`);
  } catch (err) {
    console.log(`[adventurer] FAILURER: selecting a document. error: ${err}`);
    errorHandling(userid, '10_homework 02 adventurer select', err)
  } finally {
    await client.close();
  }

  return { embeds: [embed] }
}

function check(cont, myDoc, option) {
  var result = ""
  const done = ['완료'];

  if (cont == 0) {
    // 어비스 던전/레이드
    const value0 = ['골드보상X', '레벨제한'];

    switch (option) {
      case 0: // 심플
      case 1: // 수입
        abyssus = [myDoc.abyssus1, myDoc.abyssus0, myDoc.abyssus2];
        tf = [value0.includes(abyssus[0][0]), value0.includes(abyssus[1][0]), value0.includes(abyssus[2][0])];
        title = ['🔸 아르고스', '🔸 오레하', '🔸 카양겔'];
        if (tf[0] && tf[1] && tf[2]) {
          break;
        } else {
          result = `**어비스 던전/레이드**\n`
          cnt = 0;
          for (var i = 0; i < 3; i++) {
            if (option == 0) {
              // 심플: 완료인 경우도 패스
              doornot = !tf[i] && !done.includes(abyssus[i][1])
            } else {
              doornot = !tf[i]
            }
            if (doornot) {
              if (i > 0 && cnt % 2 == 1) {
                result += '\n'
              }
              result += `${title[i]}(${abyssus[i][0]}) **[${abyssus[i][1]}]**`;
              cnt++;
            }
          }
          if (cnt == 0) {
            result = ''
          }
        }
        break;
      case 2: // 상세
        result = `**어비스 던전/레이드**`
      case 3: // 어비스
        result += `\n🔸 아르고스(${myDoc.abyssus1[0]}) **[${myDoc.abyssus1[1]}]**`
        result += `\n🔸 오레하(${myDoc.abyssus0[0]}) **[${myDoc.abyssus0[1]}]** 🔸 카양겔(${myDoc.abyssus2[0]}) **[${myDoc.abyssus2[1]}]**`
        break;
    }
  } else {
    // 군단장 레이드
    const value0 = ['리허설', '데자뷰', '에피데믹', '레벨제한'];

    switch (option) {
      case 0: // 심플
      case 1: // 수입
        raid = [myDoc.valtan, myDoc.bkiss, myDoc.kouku, myDoc.abrel, myDoc.illak];
        tf = [value0.includes(raid[0][0]), value0.includes(raid[1][0]),
        value0.includes(raid[2][0]), value0.includes(raid[3][0]), value0.includes(raid[4][0])];
        title = ['🔸 발탄', '🔸 비아', '🔸 쿠크', '🔸 아브', '🔸 일리'];
        if (tf[0] && tf[1] && tf[2] && tf[3] && tf[4]) {
          break;
        } else {
          result = `**군단장 레이드**`
          doneCnt = 0;
          cnt = 0;
          for (var i = 0; i < 5; i++) {
            if (option == 0) {
              // 심플: 완료인 경우도 패스
              doornot = !tf[i] && !done.includes(raid[i][1])
              if (done.includes(raid[i][1]))
                doneCnt++;
            } else {
              doornot = !tf[i]
            }
            if (doornot) {
              if (i == 0 || cnt % 2 == 0) {
                result += '\n'
              }
              result += `${title[i]} ${raid[i][0]} **[${raid[i][1]}]** `;
              cnt++;
            }
          }
          if (cnt == 0 || (option == 0 && doneCnt >= 3)) {
            result = ''
          }
        }
        break;
      case 2: // 상세
        result = `**군단장 레이드**`
      case 4: // 군단장
        result += `\n🔸 발탄 ${myDoc.valtan[0]} **[${myDoc.valtan[1]}]**`
        result += ` 🔸 비아 ${myDoc.bkiss[0]} **[${myDoc.bkiss[1]}]**`
        result += ` 🔸 쿠크 ${myDoc.kouku[0]} **[${myDoc.kouku[1]}]**`
        result += `\n🔸 아브 ${myDoc.abrel[0]} **[${myDoc.abrel[1]}]**`
        result += ` 🔸 일리 ${myDoc.illak[0]} **[${myDoc.illak[1]}]**`
        break;
    }
  }

  return result;
}

function errorHandling(userid, exp, error) {
  const today = new Date(+new Date() + 3240 * 10000)
  const date = today.toISOString().split("T")[0];
  const ts = today.toISOString().replace("T", " ").replace(/\..*/, '');

  const filePath = `./log/log_${date}.csv`;
  !fs.existsSync(filePath) ? fs.writeFileSync(filePath, 'timestamp,userid,exp,error') : null;
  fs.appendFileSync(filePath, `\r\n${ts},${userid},${exp},${error.stack.replace(/\n|\r/g, '\t')}`);
}