import mongoose from "mongoose";
import { MongoStore, ObjectStore } from "../stores/index.js";
export interface Database {
    connection: mongoose.Connection | null;
    stores: Map<string, ObjectStore | MongoStore>;
}
