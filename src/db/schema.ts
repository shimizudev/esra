import { serial, text, integer, pgSchema, boolean, jsonb } from "drizzle-orm/pg-core";

export const guildSchema = pgSchema("guild_schema");

export const guildSchemaData = guildSchema.table("guilds", {
    id: serial("id").primaryKey(),
    guild_id: text("guild_id").notNull().unique(),
    owner_id: text("owner_id").notNull().unique().default(""),
    name: text("name").notNull(),
    totalMembers: integer("total_members").default(0),
    level: integer("level").default(1),
    motto: text("motto").default(""),
    icon: text("icon").default("")
});

export const memberSchema = pgSchema("member_schema");

export const memberSchemaData = memberSchema.table("members", {
    id: serial("id").primaryKey(),
    user_id: text("user_id").notNull().unique(),
    name: text("name").default(""),
    username: text("username").notNull(),
    level: integer("level").default(1),
    about: text("about").default(""),
    icon: text("icon").default(""),
    coins: integer("coins").default(0),
    daily_claimed: text("daily_claimed").default(""),
    isOwner: boolean("is_owner").default(false),
    guild_id: text("guild_id").references(() => guildSchemaData.guild_id),
    relationship_status: text("relationship_status").default("single"),
    partner_id: text("partner_id").references((): any => memberSchemaData.user_id),
    children: jsonb("children").$type<Array<{ child_id: number }>>().default([]),
    job: text("job").default(""),
    salary: integer("salary").default(0)
});

export const guildToMembers = guildSchema.table(
    "guild_to_members",
    {
        id: serial("id").primaryKey(),
        guild_id: text("guild_id")
            .notNull()
            .references(() => guildSchemaData.guild_id),
        member_id: text("member_id")
            .notNull()
            .references(() => memberSchemaData.user_id)
    }
);

