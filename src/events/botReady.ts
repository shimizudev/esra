import { createEvent } from "seyfert";
import { ActivityType, PresenceUpdateStatus } from "seyfert/lib/types";

export default createEvent({
    data: { once: true, name: "botReady" },
    async run(user, client) {
        await client.gateway.setPresence({
            activities: [ { name: "on your adventure", type: ActivityType.Playing }, { name: "/help", type: ActivityType.Watching } ],
            status: PresenceUpdateStatus.Online,
            afk: false,
            since: null
        });
        client.logger.info(`${user.username} is ready to go on adventures!`);
    }
});
