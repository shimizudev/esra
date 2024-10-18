import { Declare, Command, Options } from "seyfert";
import { CreateGuildCommand } from "./create.command";
import { DeleteGuildCommand } from "./delete.command";
import { GuildInfoCommand } from "./info.command";

@Declare({
    name: "guild",
    description: "guild commands"
})
@Options([CreateGuildCommand, DeleteGuildCommand, GuildInfoCommand])
export default class GuildCommand extends Command {}
