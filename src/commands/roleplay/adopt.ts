import { Declare, Command, Options, type CommandContext, createUserOption, InteractionGuildMember, Button, ActionRow, Message } from "seyfert";
import { db } from "../../db/db";
import { memberSchemaData } from "../../db/schema";
import { eq } from "drizzle-orm";
import { ButtonStyle } from "seyfert/lib/types/index";

const options = {
    child: createUserOption({
        description: "The user you want to adopt",
        required: true
    })
};

@Declare({
    name: "adopt",
    description: "Adopt another user",
    aliases: ["adopt-child"]
})
@Options(options)
export default class AdoptCommand extends Command {
    public override async run(ctx: CommandContext<typeof options>): Promise<void> {
        await ctx.deferReply();

        const userId = ctx.author.id;
        const child = ctx.options.child as InteractionGuildMember;
        const childUsername = child.username;
        const isBot = child.bot;
        const isThemselves = child.user.id === ctx.author.id;

        const [user] = await db.select().from(memberSchemaData).where(eq(memberSchemaData.user_id, userId)).execute();
        if (!user) {
            await ctx.editOrReply({ content: "You don't belong to this world! 😢" });
            return;
        }

        if (isBot) {
            await ctx.editOrReply({ content: "You cannot adopt a bot! Get a life!" });
            return;
        }

        if (isThemselves) {
            await ctx.editOrReply({ content: "You cannot adopt yourself, silly!" });
            return;
        }

        if (user.children?.length as number >= 5) {
            await ctx.editOrReply({ content: "You already have 5 children! You can't adopt any more." });
            return;
        }

        const [childUser] = await db.select().from(memberSchemaData).where(eq(memberSchemaData.username, childUsername)).execute();
        if (!childUser) {
            await ctx.editOrReply({ content: `Couldn't find a user with the username **${childUsername}**. 😢` });
            return;
        }

        if (childUser.parents?.length as number > 0) {
            await ctx.editOrReply({ content: `**${childUsername}** already has parents! You can't adopt them.` });
            return;
        }

        const acceptButton = new Button().setCustomId("accept").setStyle(ButtonStyle.Success).setLabel("Accept");
        const rejectButton = new Button().setCustomId("reject").setStyle(ButtonStyle.Danger).setLabel("Reject");

        const buttons = new ActionRow().addComponents(acceptButton, rejectButton);

        const reply = await ctx.editOrReply({
            content: `👶 **${user.username}** wants to adopt **${child.username}**! Will they accept?`,
            components: [buttons]
        });

        const collector = (reply as Message).createComponentCollector();

        collector.run("accept", async (interaction) => {
            await interaction.deferReply();

            if (interaction.user.id !== child.id) {
                return interaction.followup({
                    content: `<@${interaction.user.id}> You cannot use the command!`
                });
            }

            await db.update(memberSchemaData)
                .set({
                    children: [...user.children ?? [], { child_id: childUser.user_id } ]
                })
                .where(eq(memberSchemaData.user_id, userId))
                .execute();

            if (user.partner_id) {
                const [partner] = await db.select().from(memberSchemaData).where(eq(memberSchemaData.user_id, user.partner_id)).execute();

                await db.update(memberSchemaData)
                    .set({
                        children: [...partner.children ?? [], { child_id: childUser.user_id } ]
                    })
                    .where(eq(memberSchemaData.user_id, user.partner_id))
                    .execute();
            }

            const parents = [ { parent_id: userId } ];
            if (user.partner_id)
                parents.push({ parent_id: user.partner_id });

            await db.update(memberSchemaData)
                .set({
                    parents: parents
                })
                .where(eq(memberSchemaData.user_id, childUser.user_id))
                .execute();

            await (reply as Message).delete();
            return interaction.followup({
                content: `🎉 Congrats! **<@${user.user_id}>** and <@${user.partner_id}> have adopted **${child.username}**! 💕`
            });
        });

        collector.run("reject", async (interaction) => {
            await interaction.deferReply();

            if (interaction.user.id !== child.id) {
                return interaction.followup({
                    content: `<@${interaction.user.id}> You cannot use the command!`
                });
            }

            await (reply as Message).delete();
            return interaction.followup({
                content: `💔 **${child.username}** rejected the adoption...`
            });
        });
    }
}
