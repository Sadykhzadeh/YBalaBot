// This used to import https://deno.land/x/dotenv/mod.ts, a URL with no
// version in it: every run took whatever that path served on the day, which
// is both a supply-chain hole and unreproducible. config() was also called
// once per export, so the .env file was read twice. `deno run --env-file`
// loads it without a third-party dependency at all.
const required = (name: string): string => {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not set - copy .sample.env to .env`);
  return value;
};

export const botToken = required("TOKEN");
export const admin = required("ADMIN");

// Typed as tuples: as a plain array this was (string | number)[][], which made
// every title a string | number and the inline results fail to type-check.
export const intros: ReadonlyArray<readonly [number, string, string]> = [
  [0, "Без стиля", "Напишите что-нибудь и получите продолжение от бота"],
  [
    24,
    "Инструкции по применению",
    "Перечислите несколько предметов, а бот придумает, как их использовать",
  ],
  [
    25,
    "Рецепты",
    "Перечислите съедобные ингредиенты, а бот придумает рецепт с ними",
  ],
  [11, "Народные мудрости", "Напишите что-нибудь и получите народную мудрость"],
  [
    6,
    "Короткие истории",
    "Начните писать историю, а бот продолжит — иногда страшно, но чаще смешно",
  ],
  [
    8,
    "Короче, Википедия",
    "Напишите какое-нибудь слово, а бот даст этому определение",
  ],
  [
    9,
    "Синопсисы фильмов",
    "Напишите название фильма (существующего или нет), а бот расскажет вам, о чем он",
  ],
];
