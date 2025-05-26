module.exports = {
  config: {
    name: "top",
    aliases: ["tp"],
    version: "1.1",
    author: "𝐓𝐎𝐌 × GPT 🦆💨",
    role: 0,
    shortDescription: {
      en: "Top 10 Rich Users"
    },
    longDescription: {
      en: "Displays the top 10 richest users with their name, UID, and money"
    },
    category: "group",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, args, message, event, usersData }) {
    return await this.runTopCommand({ api, message, event, usersData });
  },

  onChat: async function ({ api, message, event, usersData }) {
    const prefix = global.GoatBot.config.prefix;
    const body = (event.body || "").toLowerCase().trim();
    const triggers = [
      "top", "tp", 
      `${prefix}top`, `${prefix}tp`
    ];

    if (!triggers.includes(body)) return;
    return await this.runTopCommand({ api, message, event, usersData });
  },

  runTopCommand: async function ({ api, message, event, usersData }) {
    function formatMoney(amount) {
      if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)} B💵`;
      if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)} M💵`;
      if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)} K💵`;
      return `${amount} 💵`;
    }

    const allUsers = await usersData.getAll();
    const topUsers = allUsers
      .sort((a, b) => b.money - a.money)
      .slice(0, 10); // Now only Top 10

    const topUsersList = topUsers.map((user, index) =>
      `${index + 1}. 🏅 Name: ${user.name}\n   🆔 UID: ${user.userID}\n   💰 Balance: ${formatMoney(user.money)}`
    );

    const messageText = `👀 𝐁𝐚𝐛𝐲 𝐓𝐨𝐩 𝟏𝟎 𝐮𝐬𝐞𝐫𝐬 𝐥𝐢𝐬𝐭  🐣\n\n${topUsersList.join('\n\n')}\n\n𝐊𝐞𝐞𝐩 𝐞𝐚𝐫𝐧𝐢𝐧𝐠 𝐚𝐧𝐝 𝐜𝐥𝐢𝐦𝐛 𝐭𝐨 𝐭𝐡𝐞 𝐭𝐨𝐩 !! `;

    const loadingMessage = await message.reply("🔎 𝐒𝐞𝐚𝐫𝐜𝐡𝐢𝐧𝐠 𝐟𝐨𝐫 𝐭𝐡𝐞 𝐫𝐢𝐜𝐡𝐞𝐬𝐭. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭 !!");

    setTimeout(() => {
      api.unsendMessage(loadingMessage.messageID, (err) => {
        if (err) console.error("Failed to unsend loading message:", err);
        else message.reply(messageText);
      });
    }, 2000);
  }
};
