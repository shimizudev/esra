import { Declare, Command, type CommandContext } from "seyfert";
import { db } from "../../db/db";
import { memberSchemaData } from "../../db/schema";
import { eq } from "drizzle-orm";
import { getRandomInteger } from "../../utils/random";

@Declare({
    name: "daily",
    description: "Claim your daily rewards"
})
export default class DailyCommand extends Command {
    public override async run(ctx: CommandContext): Promise<void> {
        const members = await db.select().from(memberSchemaData).where(eq(memberSchemaData.user_id, ctx.author.id)).execute();

        if (members.length <= 0) {
            await ctx.editOrReply({ content: "Aww, you aren't in a guild yet, silly~ 💕" });
            return;
        }

        const member = members.find((mem) => mem.user_id === ctx.author.id);
        const dailyClaimed = member?.daily_claimed ? new Date(member.daily_claimed) : null;
        const now = new Date();

        if (dailyClaimed && now.getTime() - dailyClaimed.getTime() < 86400000) {
            const hoursLeft = Math.ceil((86400000 - (now.getTime() - dailyClaimed.getTime())) / 3600000);
            await ctx.editOrReply({ content: `Hold up, sweetie~ You can claim your next daily reward in **${hoursLeft}** hour(s)! 💖` });
            return;
        }

        const coins = getRandomInteger(3, true, 100, 999);

        await db
            .update(memberSchemaData)
            .set({
                coins: String(Number(member?.coins) + coins),
                daily_claimed: now.toISOString()
            })
            .where(eq(memberSchemaData.user_id, ctx.author.id))
            .execute();

        await ctx.editOrReply({ content: `**${member?.name}**! You received __**${coins}**__ coins! <:_:1296767117961728070>` });
    }
}
