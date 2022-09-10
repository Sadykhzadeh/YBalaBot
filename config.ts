import { config } from "https://deno.land/x/dotenv/mod.ts";

export const botToken = config().TOKEN;
export const admin = config().ADMIN;
