/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Command, Options, type CommandContext, Embed, createUserOption, Declare } from "seyfert";
import { db } from "src/db/db";
import { memberSchemaData, guildSchemaData } from "src/db/schema";
import { eq } from "drizzle-orm";
import { capitalize, capitalizeAll } from "src/utils/str";

const options = {
    user: createUserOption({
        description: "The user to check profile for",
        required: false
    })
};

@Declare({
    name: "profile",
    description: "Check user profile",
    aliases: ["info"]
})
@Options(options)
export default class ProfileCommand extends Command {
    public async run(ctx: CommandContext<typeof options>): Promise<void> {
        const userId = ctx.options.user?.id ?? ctx.author.id;

        const [user] = await db
            .select()
            .from(memberSchemaData)
            .where(eq(memberSchemaData.user_id, userId))
            .execute();

        if (!user) {
            await ctx.editOrReply({ content: "User not found. 😢" });
            return;
        }

        const [guild] = await db
            .select()
            .from(guildSchemaData)
            .where(eq(guildSchemaData.guild_id, user.guild_id as string))
            .execute();

        const embed = new Embed()
            .setColor(0xC4B08B)
            .setTitle(`${user.username}'s Profile`)
            .setThumbnail(user.icon as string)
            .setFields([
                { name: "Name", value: user.name ?? "Unknown", inline: true },
                { name: "Level", value: `${user.level}`, inline: true },
                { name: "Coins", value: `${user.coins}`, inline: true },
                { name: "Relationship Status", value: capitalize(user.relationship_status as string) ?? "Single", inline: true },
                { name: "Job", value: user.job && user.job !== "" ? capitalizeAll(user.job) : "Unemployed", inline: true },
                { name: "Salary", value: `${user.salary ?? 0}`, inline: true },
                { name: "Guild", value: guild.name ?? "None", inline: true },
                { name: "Guild Motto", value: guild.motto && guild.motto !== "" ? guild.motto : "Nothing ૮ ˶ᵔ ᵕ ᵔ˶ ა", inline: true },
                { name: "Partner", value: `${user.partner_id ? `<@${user.partner_id}>` : "No one"}`, inline: true },
                { name: "Children of", value: `${user.parents && user.parents.length >= 1 ? `<@${user.parents?.[0].parent_id}> and <@${user.parents?.[1].parent_id}>` : "No one."}`, inline: true },
                { name: "Children", value: `${(user.children as Array<{ child_id: string }>).map((child) => `<@${child.child_id}>`).join("\n")}\n`, inline: true }
            ])
            .setFooter({
                text: `Profile of ${user.username}`,
                iconUrl: ctx.me("cache")?.avatarURL({ forceStatic: true, extension: "png" })
            })
            .setTimestamp();

        await ctx.editOrReply({ embeds: [embed] });
    }
}
