"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const modules_1 = require("./modules");
const middleware_1 = require("./middleware");
const config_1 = require("./config");
const connection_db_1 = require("./DB/connection.db");
const user_1 = require("./modules/user");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.all("/", async (req, res, next) => {
    return res.status(200).json({ message: "Done" });
});
app.use("/auth", modules_1.authenticationController);
app.use("/user", user_1.userController);
app.use(middleware_1.globalErrorHandling);
const startServer = async () => {
    try {
        await (0, connection_db_1.connectDB)();
        app.listen(config_1.PORT, () => {
            console.log(`Server running on port ${config_1.PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
