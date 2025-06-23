import mongoose from "mongoose";
import { MongoStore, ObjectStore, Store } from "../stores/index.js";

export interface Database {
    connection: mongoose.Connection | null;
    stores :{ [key: string]: Store | MongoStore | ObjectStore};
}