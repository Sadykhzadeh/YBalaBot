import { Bot } from "https://deno.land/x/grammy@v1.10.1/mod.ts";
import { Context } from "https://deno.land/x/grammy@v1.10.1/context.ts";

import { admin, botToken } from "./config.ts";
import {
  ahtungHandler,
  catchHandler,
  chosenInlineResultFunc,
  inlineQueryFunc,
  messageHandler,
  startHandler,
} from "./handlers.ts";

const bot = new Bot(botToken);

bot.use(async (ctx: Context, next) => {
  try {
    const logs = JSON.stringify(ctx.update, null, 2);
    console.log(logs);
    await next();
  } catch (err) {
    console.log(err);
    await ctx.api.sendMessage(admin, "<code>" + err + "</code>", {
      parse_mode: "HTML",
    });
  }
});

bot.command(["start", "help"], startHandler);
bot.command("ahtung", ahtungHandler);
bot.on("message", messageHandler);
bot.on("inline_query", inlineQueryFunc);
bot.on("chosen_inline_result", chosenInlineResultFunc);

bot.catch(catchHandler);

(async () => {
  await bot.init();
  console.info("Bot started! @" + bot.botInfo.username);
  await bot.start();
})();
