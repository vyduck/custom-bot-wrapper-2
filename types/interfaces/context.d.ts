import { AutocompleteFocusedOption, AutocompleteInteraction, ChatInputCommandInteraction, Client } from "discord.js";
import { HandlerManager } from "../classes/handler_manager";
import { CooldownManager } from "../classes/cooldown_manager";
import { Database } from "./database";
export interface BaseContext {
    commandMap: HandlerManager;
    configMap: Map<string, any>;
    database: Database['stores'];
    client: Client;
    cooldownManager: CooldownManager;
}
export interface EventContext extends BaseContext {
    event: string;
    hookContext: Object;
}
export interface BaseCommandContext extends BaseContext {
    command: string;
    interaction: ChatInputCommandInteraction | AutocompleteInteraction;
    hookContext: Object;
    autocomplete?: AutocompleteFocusedOption;
}
export interface ChatInputCommandContext extends BaseCommandContext {
    interaction: ChatInputCommandInteraction;
}
export interface AutocompleteCommandContext extends BaseCommandContext {
    interaction: AutocompleteInteraction;
    autocomplete: AutocompleteFocusedOption;
}
