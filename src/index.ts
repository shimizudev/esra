import type { ParseClient, ParseMiddlewares } from "seyfert";
import { Client } from "seyfert";
import { middlewares } from "./middlewares/middlewares";
import "dotenv/config";

const client = new Client({
    commands: {
        prefix: () => ["esra ", "esra!"]
    }
});

client.setServices({
    middlewares
});

client.start().then(async () => client.uploadCommands()).catch((e) => { console.error(e); });

declare module "seyfert" {
    interface UsingClient extends ParseClient<Client<true>> {}
    interface RegisteredMiddlewares
        extends ParseMiddlewares<typeof middlewares> {}
}
