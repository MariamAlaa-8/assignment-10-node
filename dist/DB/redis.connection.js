"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
exports.connectRedis = connectRedis;
const redis_1 = require("redis");
const config_js_1 = require("../config.js");
exports.client = (0, redis_1.createClient)({
    url: config_js_1.REDIS_URI
});
exports.client.on("error", (err) => {
    console.error("Redis Client Error:", err);
});
async function connectRedis() {
    try {
        await exports.client.connect();
        console.log("Redis connection established");
    }
    catch (error) {
        console.error("Failed to connect to Redis:", error);
    }
}
