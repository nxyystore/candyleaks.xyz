export const config = {
    token: process.env.BOT_TOKEN,
    clientId: process.env.CLIENT_ID,
    verifyRoleName: 'Verified',
    domainname: 'candyleaks.xyz',
    ownerId: ['1311969342493163565', '1243885489858154573'],
    vipRoleName: 'VIP',
    vipDuration: 60 * 60 * 1000, //60m
    logsChannelName: 'ðŸ“œï¸²logs',
    generatorChannelName: 'ðŸ”‘ï¸²generator',
    keysFile: new URL('../keys.json', import.meta.url),
    colors: {
      primary: '#9B59B6',
      success: '#2ecc71',
      error: '#e74c3c'
    }
  };