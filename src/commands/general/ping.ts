import { Declare, Command, type CommandContext } from "seyfert";

@Declare({
    name: "ping",
    description: "Check bot's ping"
})
export default class PingCommand extends Command {
    public override async run(ctx: CommandContext): Promise<void> {
        const ping = ctx.client.gateway.latency;

        await ctx.write({
            content: `The ping is \`${ping}\``
        });
    }
}
