import mongoose from "mongoose";
import { Store } from "../stores/index.js";
export interface Database {
    connection: mongoose.Connection | null;
    stores: Map<string, Store>;
}
