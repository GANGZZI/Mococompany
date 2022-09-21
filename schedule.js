const schedule = require('node-schedule');

function autoReboot() {
  const rule = '*/30 * * * *'; // 30분마다
  // *분 *시 *일 *월 *요일
  console.log('autoreboot');

  schedule.scheduleJob(rule, function() {
    process.kill('1');
    // process.kill('1', SIGUP);
    // client.destroy()
    // client.login(process.env.TOKEN)
  })
}

module.exports = autoReboot;