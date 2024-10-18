import { Declare, type CommandContext, SubCommand, Embed } from "seyfert";
import { guildSchemaData, memberSchemaData } from "src/db/schema";
import { db } from "src/db/db";
import { and, eq } from "drizzle-orm";

@Declare({
    name: "join",
    description: "Join a guild and become part of the fun~ 💖"
})
export class JoinGuildCommand extends SubCommand {
    public async run(ctx: CommandContext): Promise<void> {
        await ctx.deferReply();

        const guild = ctx.guild("cache");

        if (!guild) {
            await ctx.editOrReply({ content: "This command is only available in guilds, cutie~ 💫" });
            return;
        }

        try {
            const existingGuild = await db.select()
                .from(guildSchemaData)
                .where(eq(guildSchemaData.guild_id, guild.id))
                .execute();

            if (existingGuild.length === 0) {
                await ctx.editOrReply({ content: "Oopsie! This guild doesn't exist yet, darling~ 😅💕" });
                return;
            }

            const existingMember = await db.select()
                .from(memberSchemaData)
                .where(and(eq(memberSchemaData.user_id, ctx.author.id), eq(memberSchemaData.guild_id, guild.id)))
                .execute();

            if (existingMember.length > 0) {
                await ctx.editOrReply({ content: "You're already part of this guild, sweetie~ 😘" });
                return;
            }

            await db.insert(memberSchemaData).values({
                guild_id: guild.id,
                user_id: ctx.author.id,
                isOwner: false,
                about: `Member of ${guild.name}`,
                name: ctx.member?.displayName,
                username: ctx.author.username,
                icon: ctx.author.avatarURL({ forceStatic: true, extension: "png" })
            }).execute();

            await db.update(guildSchemaData)
                .set({ totalMembers: (existingGuild[0].totalMembers ?? 1) + 1 })
                .where(eq(guildSchemaData.guild_id, guild.id))
                .execute();

            const embed = new Embed();
            embed.setColor(0x8BB0C4);
            embed.setDescription(`Yay! You've joined **${guild.name}**! 🎉`);
            embed.setThumbnail(guild.iconURL({ forceStatic: true, extension: "png" }));
            embed.setFooter({ text: `${guild.name}`, iconUrl: ctx.me("cache")?.avatarURL({ forceStatic: true, extension: "png" }) });
            embed.setTimestamp();

            await ctx.editOrReply({ embeds: [embed] });
        } catch (error) {
            console.error("Oopsie! Error joining guild:", error);
            await ctx.editOrReply({ content: "Uh-oh, something went wrong... Please try again later, okay? 😖" });
        }
    }
}
