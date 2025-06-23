import { EventHandler } from "../../classes/handlers/event_handler.js";
import { Logger } from "../../classes/logger.js";

declare const logger: Logger;

export default new EventHandler({
    hName: "ready",
    eName: "ready",
    once: true,
    handler: function (context, Client) {
        return logger.info(`Logged in as ${Client.user.tag}!`);
    }
})