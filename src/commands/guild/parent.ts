import { Declare, Command, Options, Middlewares } from "seyfert";
import { CreateGuildCommand } from "./create.command";

@Declare({
    name: "guild",
    description: "guild commands"
})
@Options([CreateGuildCommand])
export default class GuildCommand extends Command {}

@Middlewares(["ownerOnly"])
export class HandlingErrors extends Command {
    // @ts-expect-error: Giving a false middleware error cause TypeScript's jealous. 😏
    public async onMiddlewaresError(context: CommandContext, error: Error): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        await context.editOrReply({
            content: error.message
        });
    }
}
