import { Declare, type CommandContext, SubCommand } from "seyfert";
import { guildSchemaData } from "src/db/schema";
import { db } from "src/db/db";
import { eq } from "drizzle-orm";

@Declare({
    name: "delete",
    description: "Delete the guild~"
})
export class DeleteGuildCommand extends SubCommand {
    public async run(ctx: CommandContext): Promise<void> {
        await ctx.deferReply();

        const guild = ctx.guild("cache");

        if (!guild) {
            await ctx.editOrReply({ content: "This command is only available in guilds, cutie~ 💫" });
            return;
        }

        if (guild.ownerId !== ctx.author.id) {
            await ctx.editOrReply({ content: "Nuh-uh! Only the guild owner can use this command, silly~ 😤💕" });
            return;
        }

        try {
            const existingGuild = await db.select()
                .from(guildSchemaData)
                .where(eq(guildSchemaData.guild_id, guild.id))
                .execute();

            if (existingGuild.length <= 0) {
                await ctx.editOrReply({ content: "Aww, there’s no guild to delete~ Maybe you should create one first, silly~ 💕" });
                return;
            }

            await db.delete(guildSchemaData).where(eq(guildSchemaData.guild_id, guild.id));

            await ctx.editOrReply({ content: "Guild successfully deleted... It’s gone now... 😢" });
        } catch (error) {
            console.error("Oopsie! Error deleting guild:", error);
            await ctx.editOrReply({ content: "Uh-oh, something went wrong... Please try again later, okay? 😖" });
        }
    }
}
