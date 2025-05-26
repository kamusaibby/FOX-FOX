module.exports = {
  config: {
    name: "balance",
    aliases: ["bal"],
    version: "2.0",
    author: "BaYjid [Modified by tom]",
    countDown: 3,
    role: 0,
    description: {
      en: "View your current balance"
    },
    category: "economy",
    guide: {
      en: "{pn}: show your current balance"
    }
  },

  langs: {
    en: {
      money: "• 𝐁𝐚𝐛𝐲, 𝐘𝐨𝐮𝐫 𝐛𝐚𝐥𝐚𝐧𝐜𝐞 %1$"
    }
  },

  onStart: async function ({ message, usersData, event, getLang }) {
    const userData = await usersData.get(event.senderID);
    return message.reply(getLang("money", userData.money));
  }
};
