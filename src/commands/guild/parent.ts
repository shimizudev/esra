import { Declare, Command, Options } from "seyfert";
import { CreateGuildCommand } from "./create.command";
import { DeleteGuildCommand } from "./delete.command";
import { GuildInfoCommand } from "./info.command";
import { ProfileInfoCommand } from "./profile.command";

@Declare({
    name: "guild",
    description: "guild commands"
})
@Options([CreateGuildCommand, DeleteGuildCommand, GuildInfoCommand, ProfileInfoCommand])
export default class GuildCommand extends Command {}
