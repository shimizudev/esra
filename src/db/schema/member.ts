import { serial, text, integer, pgSchema } from "drizzle-orm/pg-core";
import { guildSchemaData } from "./guild";

export const memberSchema = pgSchema("member_schema");

export const memberSchemaData = memberSchema.table("members", {
    id: serial("id").primaryKey(),
    user_id: text("user_id").notNull(),
    name: text("name").default(""),
    username: text("username").notNull(),
    level: integer("level").default(1),
    about: text("about").default(""),
    icon: text("icon").default(""),
    guild_id: text("guild_id").references(() => guildSchemaData.guild_id)
});
