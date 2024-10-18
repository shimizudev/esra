import { Declare, type CommandContext, SubCommand } from "seyfert";
import { guildSchemaData } from "src/db/schema";
import { db } from "src/db/db";
import { eq } from "drizzle-orm";

@Declare({
    name: "create",
    description: "Create a cute guild~ 💖"
})
export class CreateGuildCommand extends SubCommand {
    public async run(ctx: CommandContext): Promise<void> {
        await ctx.deferReply();

        const guild = ctx.guild("cache");

        if (!guild) {
            await ctx.editOrReply({ content: "This command is only available in guilds, sweetie~ 💫" });
            return;
        }

        try {
            const existingGuild = await db.select()
                .from(guildSchemaData)
                .where(eq(guildSchemaData.guild_id, guild.id))
                .execute();

            if (existingGuild.length > 0) {
                await ctx.editOrReply({ content: "Aww, a guild already exists for this server, silly~ 💕" });
                return;
            }

            await db.insert(guildSchemaData).values({
                guild_id: guild.id,
                name: guild.name,
                icon: guild.iconURL({ forceStatic: true, extension: "png" }),
                motto: guild.description ?? ""
            }).execute();

            await ctx.editOrReply({ content: "Yay! Guild created successfully! 🎉" });
        } catch (error) {
            console.error("Oopsie! Error creating guild:", error);
            await ctx.editOrReply({ content: "Uh-oh, something went wrong... Please try again later, okay? 😖" });
        }
    }
}
