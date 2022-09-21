const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
        .setName("떠상")
        .setDescription("떠돌이상인 위치 제공")
        .addSubcommand(subcommand =>
            subcommand.setName('아르테미스').setDescription('아르테미스의 떠돌이 상인 위치를 검색합니다.')
            .addIntegerOption(option => option.setName('위치')
                .setDescription('지역을 선택해주세요.')
                .setRequired(true)
                .addChoices({name : '로그힐', value : 0 },
                            {name : '안게모스산기슭', value : 1},
                            {name : '국경지대', value : 2})))
        .addSubcommand(subcommand =>
            subcommand.setName('유디아').setDescription('유디아의 떠돌이 상인 위치를 검색합니다.')
            .addIntegerOption(option => option.setName('위치')
                .setDescription('지역을 선택해주세요.')
                .setRequired(true)
                .addChoices({name : '살란드구릉지', value : 3 },
                            {name :  '오즈혼구릉지', value : 4})))
        .addSubcommand(subcommand =>
            subcommand.setName('루테란서부').setDescription('루테란 서부의 떠돌이 상인 위치를 검색합니다.')
            .addIntegerOption(option => option.setName('위치')
                .setDescription('지역을 선택해주세요.')
                .setRequired(true)
                .addChoices({name : '자고라스산', value : 5},
                            {name :  '레이크바', value : 6},
                            {name : '메드리닉수도원', value : 7},
                            {name : '빌브린숲', value : 8}, 
                            {name : '격전의평야', value : 9})))
        .addSubcommand(subcommand =>
            subcommand.setName('루테란동부').setDescription('루테란 동부의 떠돌이 상인 위치를 검색합니다.')
            .addIntegerOption(option => option.setName('위치')
                .setDescription('지역을 선택해주세요.')
                .setRequired(true)
                .addChoices({name : '디오프리카평원', value : 10},
                            {name :  '해무리언덕', value : 11},
                            {name : '배꽃나무재생지', value : 12},
                            {name : '흑장미교회당', value : 13}, 
                            {name : '라이아단구', value : 14}, 
                            {name : '보레아영지', value : 15}, 
                            {name : '크로커니스해변', value : 16})))
        .addSubcommand(subcommand =>
            subcommand.setName('토토이크').setDescription('토토이크의 떠돌이 상인 위치를 검색합니다.')
            .addIntegerOption(option => option.setName('위치')
                .setDescription('지역을 선택해주세요.')
                .setRequired(true)
                .addChoices({name : '바다향기숲', value : 17},
                            {name :  '달콤한숲', value : 18},
                            {name : '성큼바위숲', value : 19},
                            {name : '침묵하는거인의숲', value : 20})))
        .addSubcommand(subcommand =>
            subcommand.setName('애니츠').setDescription('애니츠의 떠돌이 상인 위치를 검색합니다.')
            .addIntegerOption(option => option.setName('위치')
                .setDescription('지역을 선택해주세요.')
                .setRequired(true)
                .addChoices({name :  '델파이현', value : 21},
                            {name : '등나무언덕', value : 22},
                            {name : '소리의숲', value : 23}, 
                            {name : '거울계곡', value : 24},
                           {name : '황혼의연무', value : 25})))
        .addSubcommand(subcommand =>
            subcommand.setName('아르데타인').setDescription('아르데타인의 떠돌이 상인 위치를 검색합니다.')
            .addIntegerOption(option => option.setName('위치')
                .setDescription('지역을 선택해주세요.')
                .setRequired(true)
                .addChoices({name : '메마른통로', value : 26},
                            {name :  '갈라진땅', value : 27},
                            {name : '네벨호른', value : 28},
                            {name : '바람결구릉지', value : 29}, 
                            {name : '토트리치', value : 30}, 
                            {name : '리제폭포', value : 31})))
        .addSubcommand(subcommand =>
            subcommand.setName('베른북부').setDescription('베른 북부의 떠돌이 상인 위치를 검색합니다.')
            .addIntegerOption(option => option.setName('위치')
                .setDescription('지역을 선택해주세요.')
                .setRequired(true)
                .addChoices({name : '크로나항구', value : 31},
                            {name :  '파르나숲', value : 32},
                            {name : '페르나스고원', value : 33},
                            {name : '베르닐삼림', value : 34}, 
                            {name : '발란카르산맥', value : 35})))
        .addSubcommand(subcommand =>
            subcommand.setName('슈샤이어').setDescription('슈샤이어의 떠돌이 상인 위치를 검색합니다.')
            .addIntegerOption(option => option.setName('위치')
                .setDescription('지역을 선택해주세요.')
                .setRequired(true)
                .addChoices({name : '얼어붙은바다', value : 37},
                            {name :  '칼날바람언덕', value : 38},
                            {name : '서리감옥고원', value : 39},
                            {name : '머무른시간의호수', value : 40}, 
                            {name : '얼음나비절벽', value : 41})))
        .addSubcommand(subcommand =>
            subcommand.setName('로헨델').setDescription('로헨델의 떠돌이 상인 위치를 검색합니다.')
            .addIntegerOption(option => option.setName('위치')
                .setDescription('지역을 선택해주세요.')
                .setRequired(true)
                .addChoices({name : '은빛물결호수', value : 42},
                            {name :  '유리연꽃호수', value : 43},
                            {name : '바람향기언덕', value : 44},
                            {name : '파괴된제나일', value : 45}, 
                            {name : '엘조윈의그늘', value : 46})))
        .addSubcommand(subcommand =>
            subcommand.setName('욘').setDescription('욘의 떠돌이 상인 위치를 검색합니다.')
            .addIntegerOption(option => option.setName('위치')
                .setDescription('지역을 선택해주세요.')
                .setRequired(true)
                .addChoices({name : '시작의땅', value : 47},
                            {name :  '미완의정원', value : 48},
                            {name : '검은모루작업장', value : 49},
                            {name : '무쇠망치작업장', value : 50}, 
                            {name : '기약의땅', value : 51})))
        .addSubcommand(subcommand =>
            subcommand.setName('페이튼').setDescription('페이튼의 떠돌이 상인 위치를 검색합니다.')
            .addIntegerOption(option => option.setName('위치')
                .setDescription('지역을 선택해주세요.')
                .setRequired(true)
                .addChoices({name : '칼라자마을', value : 52})))
        .addSubcommand(subcommand =>
            subcommand.setName('파푸니카').setDescription('파푸니카의 떠돌이 상인 위치를 검색합니다.')
            .addIntegerOption(option => option.setName('위치')
                .setDescription('지역을 선택해주세요.')
                .setRequired(true)
                .addChoices({name : '얕은바닷길', value : 53},
                            {name :  '별모래해변', value : 54},
                            {name : '티카티카군락지', value : 55},
                            {name : '비밀의숲', value : 56})))
        .addSubcommand(subcommand =>
            subcommand.setName('베른남부').setDescription('베른 남부의 떠돌이 상인 위치를 검색합니다.')
            .addIntegerOption(option => option.setName('위치')
                .setDescription('지역을 선택해주세요.')
                .setRequired(true)
                .addChoices({name : '칸다리아영지', value : 57},
                            {name :  '벨리온유적지', value : 58})))
        .addSubcommand(subcommand =>
            subcommand.setName('로웬').setDescription('로웬의 떠돌이 상인 위치를 검색합니다.')
            .addIntegerOption(option => option.setName('위치')
                .setDescription('지역을 선택해주세요.')
                .setRequired(true)
                .addChoices({name : '어금니의강', value : 59},
                            {name :  '웅크린늑대의땅', value : 60})))
        .addSubcommand(subcommand =>
            subcommand.setName('엘가시아').setDescription('엘가시아의 떠돌이 상인 위치를 검색합니다.')
            .addIntegerOption(option => option.setName('위치')
                .setDescription('지역을 선택해주세요.')
                .setRequired(true)
                .addChoices({name : '헤스테라정원', value : 61},
                            {name :  '필레니소스산 ', value : 62}))),
    async execute(interaction){
      const userid = interaction.user.id;
      try{
        await interaction.deferReply();
        let result = await connection(interaction.options.getInteger("위치"))
        
        const exampleEmbed = new MessageEmbed()
          .setColor('#A6FF4D')
          .setTitle('[ 떠돌이 상인 위치 정보 ]')
          .addFields(
            { name: '위치', value: result.coordinate, inline: true },
            )
          .setImage(result.address);
        
        await interaction.editReply({ embeds: [exampleEmbed] })
      } catch(err){
        errorHandling(userid, '91_trader 01 exectue', err)
      }
    }
}

async function connection(index, userid) {
  let item;
  let client;

  try {
    client = await MongoClient.connect(process.env.Database);
    const db = client.db('mococompany');
    const col = db.collection('traders');

    const cursor = col.find({index:index}).limit(1);
    while(await cursor.hasNext()) {
      const doc = await cursor.next();
      console.log(doc);
      item = doc;
    }
  } catch (err) {
    console.log(err.stack);
    errorHandling(userid, '91_trader 02 traders select', err)
  } finally{
    client.close();
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