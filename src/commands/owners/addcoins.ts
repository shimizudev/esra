import { Declare, Command, type CommandContext, createStringOption, Options } from "seyfert";
import { db } from "../../db/db";
import { memberSchemaData } from "../../db/schema";
import { eq } from "drizzle-orm";
import process from "node:process";

const options = {
    amount: createStringOption({
        description: "Amount to bet (numeric or 'all')",
        required: true
    }),
    userid: createStringOption({
        description: "The user id",
        required: false
    })
};

@Declare({
    name: "addcoins",
    description: "Add coins hehehe",
    guildId: [process.env.PRIVATE_GUILD_ID as string]
})
@Options(options)
export default class DailyCommand extends Command {
    public override async run(ctx: CommandContext<typeof options>): Promise<void> {
        const user = ctx.options.userid ?? ctx.author.id;

        const members = await db.select().from(memberSchemaData).where(eq(memberSchemaData.user_id, user)).execute();

        if (members.length <= 0) {
            await ctx.editOrReply({ content: "Aww, you aren't in a guild yet, silly~ 💕" });
            return;
        }

        const member = members.find((mem) => mem.user_id === user);

        const coins = Number(ctx.options.amount);

        await db
            .update(memberSchemaData)
            .set({
                coins: String(Number(member?.coins) + coins)
            })
            .where(eq(memberSchemaData.user_id, user))
            .execute();

        await ctx.editOrReply({ content: `**${member?.name}**! You received __**${coins}**__ coins! <:_:1296767117961728070>` });
    }
}
