/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Declare, Command, Options, type CommandContext, createUserOption, InteractionGuildMember, Button, ActionRow, Message } from "seyfert";
import { db } from "src/db/db";
import { memberSchemaData } from "src/db/schema";
import { eq } from "drizzle-orm";
import { ButtonStyle } from "seyfert/lib/types";
import { chooseFrom } from "src/utils/random";

const relationshipMessages = [
    "Cheating on <user>, huh? NOT HAPPENING. 😤",
    "Nice try, but you're cuffed to <user> forever. 🔒",
    "You're already hitched with <user>, no take-backsies! 💍",
    "Uh-oh, you're already taken! Don't make <user> jealous! 😬",
    "Sorry, but you're stuck with <user>! 💕",
    "Plot twist: you're already in a relationship with <user>. 🌹",
    "Did you forget? <user> still owns your heart. 💖",
    "Hold up—you're already hitched to <user>, remember?",
    "Nice try, but <user> would be heartbroken. 🥺",
    "Nope! You and <user> are #relationshipgoals. 🥰"
];

const options = {
    partner: createUserOption({
        description: "The person you want to marry",
        required: true
    })
};

@Declare({
    name: "marry",
    description: "Propose to another user",
    aliases: ["propose"]
})
@Options(options)
export default class MarryCommand extends Command {
    public async run(ctx: CommandContext<typeof options>): Promise<void> {
        const userId = ctx.author.id;
        const prt = ctx.options.partner as InteractionGuildMember;
        const partnerUsername = prt.username;
        const partnerId = prt.id;
        const isBot = prt.bot;
        const isMe = prt.user.id === ctx.me("cache")?.id;
        const isThemselves = prt.user.id === ctx.author.id;

        const [user] = await db.select().from(memberSchemaData).where(eq(memberSchemaData.user_id, userId)).execute();
        if (!user) {
            await ctx.editOrReply({ content: "You don't belong to this world! 😢" });
            return;
        }

        if (isMe) {
            await ctx.editOrReply({ content: "H-Hey~ Aren't you too eager? But I am a bot so I cannot marry you otherwise I would." });
            return;
        }

        if (isBot) {
            await ctx.editOrReply({ content: "You cannot marry a bot! Get a life!" });
            return;
        }

        if (isThemselves) {
            await ctx.editOrReply({ content: "You cannot marry yourself, idiot!" });
            return;
        }

        if (!["single", "adopted"].includes(user.relationship_status as string) && user.partner_id === partnerId) {
            await ctx.editOrReply({ content: `You want to marry <@${partnerId}> twice, huh? Overachiever! 😏` });
            return;
        }

        if (!["single", "adopted"].includes(user.relationship_status as string) && user.partner_id !== partnerId) {
            await ctx.editOrReply({ content: chooseFrom(...relationshipMessages).replaceAll("<user>", `<@${user.partner_id}>`) });
            return;
        }

        const [partner] = await db.select().from(memberSchemaData).where(eq(memberSchemaData.username, partnerUsername)).execute();
        if (!partner) {
            await ctx.editOrReply({ content: `Couldn't find a user with the username **${partnerUsername}**. 😢` });
            return;
        }

        if (!["single", "adopted"].includes(partner.relationship_status as string)) {
            await ctx.editOrReply({ content: `**${partnerUsername}** is already in a relationship! 💔` });
            return;
        }

        const acceptButton = new Button().setCustomId("accept").setStyle(ButtonStyle.Success).setLabel("Accept");
        const rejectButton = new Button().setCustomId("reject").setStyle(ButtonStyle.Danger).setLabel("Reject");

        const buttons = new ActionRow().addComponents(acceptButton, rejectButton);

        const reply = await ctx.editOrReply({
            content: `💍 **${user.username}** is proposing to **${partner.username}**! Will they accept?`,
            components: [buttons]
        });

        const collector = (reply as Message).createComponentCollector();

        collector.run("accept", async (interaction) => {
            if (interaction.user.id !== partner.user_id) {
                return interaction.write({
                    content: `<@${interaction.user.id}> You cannot use the command!`
                });
            }

            await db.transaction(async (trx) => {
                await trx.update(memberSchemaData)
                    .set({
                        relationship_status: "married",
                        partner_id: partner.user_id
                    })
                    .where(eq(memberSchemaData.user_id, userId))
                    .execute();

                await trx.update(memberSchemaData)
                    .set({
                        relationship_status: "married",
                        partner_id: user.user_id
                    })
                    .where(eq(memberSchemaData.user_id, partner.user_id))
                    .execute();
            });

            await (reply as Message).delete();
            return interaction.editOrReply({
                content: `💍 Congrats, **${user.username}** and **${partner.username}** are now married! 💕`
            });
        });

        collector.run("reject", async (interaction) => {
            if (interaction.user.id !== partner.user_id) {
                return interaction.write({
                    content: `<@${interaction.user.id}> You cannot use the command!`
                });
            }

            await (reply as Message).delete();
            return interaction.editOrReply({
                content: `💔 **${partner.username}** rejected the proposal...`
            });
        });
    }
}
