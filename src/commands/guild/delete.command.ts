import { Declare, type CommandContext, SubCommand, Message, Button, ActionRow } from "seyfert";
import { guildSchemaData, memberSchemaData } from "src/db/schema";
import { db } from "src/db/db";
import { eq } from "drizzle-orm";
import { ButtonStyle } from "seyfert/lib/types";

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

            const yesButton = new Button().setCustomId("yes").setStyle(ButtonStyle.Danger).setLabel("Yes");
            const noButton = new Button().setCustomId("no").setStyle(ButtonStyle.Secondary).setLabel("No");

            const buttons = new ActionRow().addComponents(yesButton, noButton);

            const reply = await ctx.editOrReply({ content: "Deleting guild will also delete all the members in it, are you sure you want to proceed? 🤔", components: [buttons] });

            const collector = (reply as Message).createComponentCollector();

            collector.run("yes", async (interaction) => {
                await (reply as Message).delete();
                await db.delete(memberSchemaData).where(eq(memberSchemaData.guild_id, guild.id));
                await db.delete(guildSchemaData).where(eq(guildSchemaData.guild_id, guild.id));

                return interaction.editOrReply({ content: "Guild successfully deleted... It’s gone now... 😢" });
            });

            collector.run("no", async (interaction) => {
                await (reply as Message).delete();
                return interaction.editOrReply({ content: "Guild deletion cancelled" });
            });

            return;
        } catch (error) {
            console.error("Oopsie! Error deleting guild:", error);
            await ctx.editOrReply({ content: "Uh-oh, something went wrong... Please try again later, okay? 😖" });
        }
    }
}
