import { Declare, Command, type CommandContext } from "seyfert";
import { db } from "src/db/db";
import { memberSchemaData } from "src/db/schema";
import { eq } from "drizzle-orm";

@Declare({
    name: "coin",
    description: "Check your coin",
    aliases: ["coins", "cash", "c"]
})
export default class CoinCommand extends Command {
    public async run(ctx: CommandContext): Promise<void> {
        const members = await db.select().from(memberSchemaData).where(eq(memberSchemaData.user_id, ctx.author.id)).execute();

        if (members.length <= 0)
            await ctx.editOrReply({ content: "Aww, you aren't in a guild yet, silly~ 💕" });

        const member = members.find((mem) => mem.user_id === ctx.author.id);

        await ctx.editOrReply({ content: `**${member?.name}**! You have __**${member?.coins ?? 0}**__ coins! <:_:1296767117961728070>` });
    }
}
