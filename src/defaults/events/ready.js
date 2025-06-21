import { EventHandler } from "../../classes/event_handler.js";

export default new EventHandler({
    hName: "ready",
    eName: "ready",
    once: true,
    handler: function (context, Client) {
        logger.info(`Logged in as ${Client.user.tag}!`);
    }
})