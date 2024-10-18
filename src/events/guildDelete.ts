import { createEvent } from "seyfert";

export default createEvent({
    data: { name: "guildDelete" },
    run(badGuild, client) {
    // it's possible that the guild has been deleted.
        if (badGuild.unavailable) return;
        client.logger.info(`I have been kicked out of: ${badGuild.id} bad guild!`);
    }
});
