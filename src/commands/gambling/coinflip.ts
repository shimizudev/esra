import { Declare, Command, Options, type CommandContext, createStringOption } from "seyfert";
import { db } from "../../db/db";
import { memberSchemaData } from "../../db/schema";
import { eq } from "drizzle-orm";
import { chooseFrom } from "../../utils/random";

const options = {
    amount: createStringOption({
        description: "Amount to bet (numeric or 'all')",
        required: true
    }),
    choice: createStringOption({
        description: "Choose between Heads or Tails",
        required: false
    })
};

@Declare({
    name: "coinflip",
    description: "Coinflip command",
    aliases: ["coinflip", "cf"]
})
@Options(options)
export default class CoinCommand extends Command {
    public override async run(ctx: CommandContext<typeof options>): Promise<void> {
        const members = await db.select().from(memberSchemaData).where(eq(memberSchemaData.user_id, ctx.author.id)).execute();
        let choice = ctx.options.choice?.toLowerCase() ?? "heads";
        const betAmountStr = ctx.options.amount;

        if (members.length <= 0) {
            await ctx.editOrReply({ content: "Aww, you aren't in a guild yet, silly~ 💕" });
            return;
        }

        const member = members.find((mem) => mem.user_id === ctx.author.id);
        const coins = member?.coins ?? 0;

        if (Number(coins) <= 0) {
            await ctx.editOrReply({ content: "You have no coins to flip! 😢" });
            return;
        }

        let betAmount: number;
        if (betAmountStr === "all")
            betAmount = Math.min(Number(coins), 500_000);
        else {
            betAmount = Number(betAmountStr);

            if (isNaN(betAmount) || betAmount <= 0) {
                await ctx.editOrReply({ content: "Invalid bet amount! It must be a number greater than 0 or 'all'. 😡" });
                return;
            }

            if (betAmount > Number(coins)) {
                await ctx.editOrReply({ content: `You can't bet more than what you have! You only have ${coins} coins. 💸` });
                return;
            }
        }

        switch (choice) {
            case "heads":
            case "head":
            case "h":
                choice = "h";
                break;
            case "tails":
            case "tail":
            case "t":
                choice = "t";
                break;
            default:
                choice = "h";
                break;
        }

        const coinFlip = chooseFrom(0, 1);
        const flipResult = coinFlip === 1 ? "h" : "t";
        const resultStr = flipResult === "h" ? "Heads" : "Tails";

        if (flipResult === choice) {
            const newCoins = Number(coins) + betAmount;
            await db.update(memberSchemaData)
                .set({ coins: String(newCoins) })
                .where(eq(memberSchemaData.user_id, ctx.author.id))
                .execute();

            await ctx.editOrReply({ content: `Congrats! It was **${resultStr}**! You've won and now have ${newCoins} coins! 🎉💰` });
        } else {
            const newCoins = Number(coins) - betAmount;
            await db.update(memberSchemaData)
                .set({ coins: String(newCoins) })
                .where(eq(memberSchemaData.user_id, ctx.author.id))
                .execute();

            await ctx.editOrReply({ content: `Oops! It was **${resultStr}**. You've lost ${betAmount} coins and now have ${newCoins} coins. 😢` });
        }
    }
}
