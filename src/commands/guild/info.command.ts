import { Declare, type CommandContext, SubCommand, Embed } from "seyfert";
import { guildSchemaData } from "src/db/schema";
import { db } from "src/db/db";
import { eq } from "drizzle-orm";

@Declare({
    name: "info",
    description: "Get information of your cute guild~ 💖"
})
export class GuildInfoCommand extends SubCommand {
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

            if (existingGuild.length < 0) {
                await ctx.editOrReply({ content: "Aww, there’s no guild to show info, silly~ 💕" });
                return;
            }

            const thisGuild = existingGuild.find((existing) => existing.guild_id === ctx.guildId);

            const embed = new Embed();
            embed.setColor(0xC4B08B);
            embed.setDescription("Here's your guild info, darling~");
            embed.setFields([
                {
                    name: "Guild Name",
                    value: thisGuild?.name ?? guild.name,
                    inline: true
                },
                {
                    name: "Guild Motto",
                    value: thisGuild?.motto === "" ? "Nothing ૮ ˶ᵔ ᵕ ᵔ˶ ა" : thisGuild?.motto as string,
                    inline: true
                },
                {
                    name: "Owner",
                    value: `<@${thisGuild?.owner_id ?? guild.ownerId}>`,
                    inline: true
                },
                {
                    name: "Guild Id",
                    value: thisGuild?.guild_id.toString() as string,
                    inline: true
                },
                {
                    name: "Total Members",
                    value: ((thisGuild?.totalMembers ?? 1)).toString(),
                    inline: true
                }
            ]);
            embed.setThumbnail(thisGuild?.icon ?? guild.iconURL({ forceStatic: true, extension: "png" }));
            embed.setFooter({ text: `${guild.name}`, iconUrl: ctx.me("cache")?.avatarURL({ forceStatic: true, extension: "png" }) });
            embed.setTimestamp();

            await ctx.editOrReply({ embeds: [embed] });
        } catch (error) {
            console.error("Oopsie! Error creating guild:", error);
            await ctx.editOrReply({ content: "Uh-oh, something went wrong... Please try again later, okay? 😖" });
        }
    }
}
