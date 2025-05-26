module.exports = {
  config: {
    name: "slot",
    version: "3.1",
    author: "OtinXSandip [Edit by kamu]",
    countDown: 10,
    shortDescription: { en: "🎰 Spin & Win!" },
    longDescription: { en: "Quick slot game with instant rewards." },
    category: "game",
  },

  langs: {
    en: {
      invalid_amount: "❌ Min bet: $100",
      not_enough_money: "💸 𝐒𝐫𝐲 𝐬𝐢𝐫 𝐚𝐩𝐧𝐚𝐫 𝐜𝐚𝐬𝐡 𝐧𝐞𝐢",
      win: "🎉 𝐖𝐨𝐧 $%1!",
      lose: "😢 𝐋𝐨𝐬𝐭 $%1.",
      jackpot: "💰 JACKPOT! $%1!"
    }
  },

  onStart: async function ({ args, message, event, usersData, getLang, api }) {
    const { senderID, threadID } = event;
    const user = await usersData.get(senderID);
    const bet = parseInt(args[0]);

    if (isNaN(bet) || bet < 100) return message.reply(getLang("invalid_amount"));
    if (bet > user.money) return message.reply(getLang("not_enough_money"));

    const slots = ["🍒", "🍋", "💰", "💎", "7️⃣", "🍀"];
    const spin = () => slots[Math.floor(Math.random() * slots.length)];

    const animMsg = await message.reply("🌀 𝐒𝐩𝐢𝐧𝐧𝐢𝐧𝐠...");

    await new Promise(res => setTimeout(res, 1000));

    const [a, b, c] = [spin(), spin(), spin()];
    const result = `[ ${a} | ${b} | ${c} ]`;

    let winAmount = 0;
    if (a === b && b === c) {
      winAmount = bet * (a === "7️⃣" ? 20 : 10);
    } else if (a === b || a === c || b === c) {
      winAmount = bet * 2;
    }

    const finalBalance = user.money + (winAmount - bet);
    await usersData.set(senderID, { money: finalBalance });

    const msg = winAmount > bet
      ? getLang(winAmount >= bet * 10 ? "jackpot" : "win", winAmount)
      : getLang("lose", bet);

    await message.reply(`${msg}\n${result}`);

    // Unsend animation message after 500ms
    setTimeout(() => {
      api.unsendMessage(animMsg.messageID);
    }, 500);
  }
};
