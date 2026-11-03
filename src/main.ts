import express from "express";

import { authenticationController } from "./modules";
import { globalErrorHandling } from "./middleware";
import { PORT } from "./config";
import { connectDB } from "./DB/connection.db";
import { userController } from "./modules/user";
const app: express.Application = express();
app.use(express.json())
app.all("/", async(req: express.Request, res: express.Response, next: express.NextFunction): Promise<express.Response> => {
 return res.status(200).json({ message: "Done" });
    

});
app.use("/auth", authenticationController);
app.use("/user", userController);
app.use(globalErrorHandling)

const startServer = async () => {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        console.error("Failed to start server:", error)
        process.exit(1)
    }
}

startServer()