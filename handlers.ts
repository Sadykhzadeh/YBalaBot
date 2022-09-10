import { Context } from "https://deno.land/x/grammy@v1.10.1/context.ts";

import {
  BotError,
  GrammyError,
  HttpError,
} from "https://deno.land/x/grammy@v1.10.1/mod.ts";

const replyMarkup = {
  inline_keyboard: [[{
    text: "Нажимай сюда! 👀",
    switch_inline_query: "Жила была девочка, и звали её Саша. ",
  }]],
};
const supportMe = {
  inline_keyboard: [[{
    text: "Поддержите разработчика 👉👈",
    url: "https://donationalerts.com/r/sadykhzadeh",
  }]],
};

const startHandler = async (ctx: Context) => {
  let name: string = ctx.message.from?.first_name;
  if (ctx.message.from?.last_name) name += " " + ctx.message.from?.last_name;
  await ctx.reply(
    `🫰🏻 <b>Привет, ${name}! \n</b>` +
      "Этот бот продолжит твой текст на любую тему, сохраняя связность и заданный стиль.\n" +
      "\n" +
      "📝 Желательно ознакомиться с некоторыми нюансами бота по команде /ahtung\n" +
      "\n" +
      "🤌🏻 <b>Пользоваться ботом очень легко!</b> Нажми на кнопку ниже, выбери чат и произойдёт магия! :)\n" +
      "\n",
    {
      parse_mode: "HTML",
      reply_markup: replyMarkup,
    },
  );
};

const ahtungHandler = async (ctx: Context) => {
  await ctx.reply(
    `1) <b>У бота нет своего мнения или знания.</b> Он умеет только подражать — писать тексты так, чтобы они были максимально похожи на реальные тексты из интернета.
2) <b>Генератор может выдавать очень странные тексты.</b> Пожалуйста, будьте разумны, распространяя их. Подумайте, не будет ли текст обидным для кого-то и не станет ли его публикация нарушением закона.
3) <b>Бот не любит политику или религию.</b> Вероятность того, что запрос задаёт одну из острых тем, определяет нейросеть, обученная на оценках случайных людей. Но она может перестараться или, наоборот, что-то пропустить.

Спасибо за понимание!❤️`,
    {
      parse_mode: "HTML",
      reply_markup: supportMe,
    },
  );
};

const messageHandler = async (ctx: Context) => {
  if (ctx.update.message?.via_bot?.id) return;
  await ctx.reply(
    "Я работаю только в режиме inline. Нажми /start, если не понял, о чём я.",
  );
};

const inlineQueryFunc = async (ctx: Context) => {
  const { inlineQuery } = ctx;

  if (!inlineQuery.query) {
    ctx.answerInlineQuery([]);
  }

  const intros = await fetch("https://zeapi.yandex.net/lab/api/yalm/intros"),
    introsJson = await intros.json();

  const result = introsJson.intros.map((i) => ({
    type: "article",
    id: i[0] + "4321" + +(new Date()),
    title: i[1],
    description: i[2].toString().replaceAll("Балабоба", "бот").replaceAll(
      "Балабобы",
      "бота",
    ),
    input_message_content: {
      message_text:
        `<b>${inlineQuery.query}</b> <i>(История генерируется, подождите...)</i>`,
      parse_mode: "HTML",
    },
    reply_markup: supportMe,
  }));
  await ctx.answerInlineQuery(result);
};

const chosenInlineResultFunc = async (ctx: Context) => {
  const intro = +ctx.chosenInlineResult.result_id.split("4321")[0];

  const postData = await fetch("https://zeapi.yandex.net/lab/api/yalm/text3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: ctx.chosenInlineResult.query,
        intro: intro,
        filter: 1,
      }),
    }),
    postDataJson = await postData.json();

  if (postDataJson["bad_query"] > 0) {
    await ctx.editMessageText(
      `<b>Бот не умеет в политику и/или религию.</b>
    
Вероятность того, что запрос задаёт одну из острых тем, определяет нейросеть, обученная на оценках случайных людей. Но она может перестараться или, наоборот, что-то пропустить.`,
      {
        parse_mode: "HTML",
        reply_markup: supportMe,
      },
    );
  } else {
    await ctx.editMessageText(
      `<b>${ctx.chosenInlineResult.query}</b> ${postDataJson.text}`,
      {
        parse_mode: "HTML",
      },
    );
  }
};

const catchHandler = (q: BotError) => {
  const { ctx, error } = q;

  console.error(`Error while handling update ${ctx.update.update_id}:`);

  if (error instanceof GrammyError) {
    console.error("Error in request:", error.description);
  } else if (error instanceof HttpError) {
    console.error("Could not contact Telegram:", error);
  } else {
    console.error("Unknown error:", error);
  }
};

export {
  ahtungHandler,
  catchHandler,
  chosenInlineResultFunc,
  inlineQueryFunc,
  messageHandler,
  startHandler,
};
