import { EventHandler } from "../../classes/handlers/event_handler.js";
export default new EventHandler({
    hName: "ready",
    eName: "ready",
    once: true,
    handler: function (context, Client) {
        return logger.info(`Logged in as ${Client.user.tag}!`);
    }
});
