import { Declare, Command, type CommandContext, Middlewares } from "seyfert";
import { guildSchemaData } from "src/db/schema/guild";
import { db } from "src/db/db";
import { eq } from "drizzle-orm";

@Declare({
    name: "create",
    description: "Create a guild"
})
export default class CreateGuildCommand extends Command {
    public async run(ctx: CommandContext): Promise<void> {
        const guild = ctx.guild("cache");

        if (!guild) {
            await ctx.editOrReply({ content: "This command can only be used in a guild." });
            return;
        }

        try {
            const existingGuild = await db.select()
                .from(guildSchemaData)
                .where(eq(guildSchemaData.guild_id, guild.id))
                .execute();

            if (existingGuild.length > 0) {
                await ctx.editOrReply({ content: "A guild already exists for this server" });
                return;
            }

            await db.insert(guildSchemaData).values({
                guild_id: guild.id,
                name: guild.name,
                icon: guild.iconURL({ forceStatic: true, extension: "png" }),
                motto: guild.description ?? ""
            }).execute();

            await ctx.editOrReply({ content: "Guild created successfully!" });
        } catch (error) {
            console.error("Error creating guild:", error);
            await ctx.editOrReply({ content: "An error occurred while creating the guild. Please try again later." });
        }
    }
}

@Middlewares(["ownerOnly"])
export class HandlingErrors extends Command {
    // @ts-expect-error: Giving a false middleware error cause TypeScript's jealous.
    public async onMiddlewaresError(context: CommandContext, error: Error): Promise<void> {
        await context.editOrReply({
            content: error.message
        });
    }
}
