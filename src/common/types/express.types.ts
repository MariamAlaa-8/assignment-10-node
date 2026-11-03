declare module "express-serve-static-core" {
    interface Request {
        validate: any;
        auth?: {
            user: any;
            token?: string;
        };
    }
}