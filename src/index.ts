import type { ParseClient, ParseMiddlewares } from "seyfert";
import { Client } from "seyfert";
import { middlewares } from "./middlewares/middlewares";
import { HandleCommand } from "seyfert/lib/commands/handle";
import { Yuna } from "yunaforseyfert";
import "dotenv/config";

const client = new Client({
    commands: {
        prefix: () => ["esra ", "esra!"]
    }
});

class EsraHandleCommand extends HandleCommand {
    argsParser = Yuna.parser();
}


client.setServices({
    middlewares,
    handleCommand: EsraHandleCommand
});

client.start().then(() => client.uploadCommands()).catch((e) => { console.error(e); });

declare module "seyfert" {
    interface UsingClient extends ParseClient<Client<true>> {}
    interface RegisteredMiddlewares
        extends ParseMiddlewares<typeof middlewares> {}
}
