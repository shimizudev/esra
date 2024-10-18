import { Declare, type CommandContext, SubCommand, Embed } from "seyfert";
import { guildSchemaData, memberSchemaData } from "src/db/schema";
import { db } from "src/db/db";
import { eq } from "drizzle-orm";

@Declare({
    name: "profile",
    description: "Get information of your cute profile~ 💖"
})
export class ProfileInfoCommand extends SubCommand {
    public async run(ctx: CommandContext): Promise<void> {
        await ctx.deferReply();

        const guild = ctx.guild("cache");

        if (!guild) {
            await ctx.editOrReply({ content: "This command is only available in guilds, sweetie~ 💫" });
            return;
        }

        try {
            const member = await db.select().from(memberSchemaData).where(eq(memberSchemaData.user_id, ctx.author.id)).execute();

            if (member.length <= 0)
                await ctx.editOrReply({ content: "Aww, you aren't in a guild yet, silly~ 💕" });

            const thisMember = member.find((mem) => mem.user_id === ctx.author.id);
            const guildMember = (await ctx.client.cache.guilds?.get(guild.id)?.members.list())?.find((mem) => mem.user.id === ctx.author.id);
            const resolvedGuild = await db.select().from(guildSchemaData).where(eq(guildSchemaData.guild_id, thisMember?.guild_id as string)).execute();

            const embed = new Embed();
            embed.setColor(0xC4B08B);
            embed.setDescription("Here's your profile, darling~");
            embed.setFields([
                {
                    name: "Name",
                    value: thisMember?.name ?? guildMember?.name as string,
                    inline: true
                },
                {
                    name: "About",
                    value: thisMember?.about === "" ? "Nothing ૮ ˶ᵔ ᵕ ᵔ˶ ა" : thisMember?.about as string,
                    inline: true
                },
                {
                    name: "Owner?",
                    value: `${resolvedGuild[0].owner_id === ctx.author.id ? "Yes" : "No"}`,
                    inline: true
                },
                {
                    name: "User Id",
                    value: thisMember?.user_id.toString() as string,
                    inline: true
                },
                {
                    name: "From Guild",
                    value: resolvedGuild[0]?.name,
                    inline: true
                }
            ]);
            embed.setThumbnail(thisMember?.icon ?? guildMember?.avatarURL({ forceStatic: true, extension: "png" }));
            embed.setFooter({ text: `${guild.name}`, iconUrl: ctx.me("cache")?.avatarURL({ forceStatic: true, extension: "png" }) });
            embed.setTimestamp();

            await ctx.editOrReply({ embeds: [embed] });
        } catch (error) {
            console.error("Oopsie! Error creating guild:", error);
            await ctx.editOrReply({ content: "Uh-oh, something went wrong... Please try again later, okay? 😖" });
        }
    }
}
