import { Declare, type CommandContext, SubCommand, Embed } from "seyfert";
import { guildSchemaData, memberSchemaData } from "src/db/schema";
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

        if (guild.ownerId !== ctx.author.id) {
            await ctx.editOrReply({ content: "Nuh-uh! Only the guild owner can use this command, silly~ 😤💕" });
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
                motto: guild.description ?? "",
                owner_id: guild.ownerId,
                totalMembers: 1
            }).execute();

            const guildOwner = await guild.fetchOwner();

            await db.insert(memberSchemaData).values({
                guild_id: guild.id,
                user_id: guild.ownerId,
                isOwner: true,
                about: `Owner of ${guild.name}`,
                name: guildOwner?.displayName,
                username: guildOwner?.username ?? "",
                icon: guildOwner?.avatarURL({ forceStatic: true, extension: "png" })
            });

            const embed = new Embed();
            embed.setColor(0xC4B08B);
            embed.setDescription("Yay! Guild created successfully! 🎉");
            embed.setFields([ { name: "Guild Name", value: guild.name, inline: true }, { name: "Guild Motto", value: guild.description ?? "Nothing ૮ ˶ᵔ ᵕ ᵔ˶ ა", inline: true } ]);
            embed.setThumbnail(guild.iconURL({ forceStatic: true, extension: "png" }));
            embed.setFooter({ text: `${guild.name}`, iconUrl: ctx.me("cache")?.avatarURL({ forceStatic: true, extension: "png" }) });
            embed.setTimestamp();

            await ctx.editOrReply({ embeds: [embed] });
        } catch (error) {
            console.error("Oopsie! Error creating guild:", error);
            await ctx.editOrReply({ content: "Uh-oh, something went wrong... Please try again later, okay? 😖" });
        }
    }
}
