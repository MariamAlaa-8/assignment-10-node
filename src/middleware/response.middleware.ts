import { NextFunction, Request, Response } from "express";

import type { IResponse } from "../common/interface/response.interface";

export const ResponseFormatter = (handler: Function) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
 

    if (res.headersSent) return;
       const {
      message = true,
      status = 200,
      data = undefined,
      meta = undefined,
    }: IResponse =await  handler (req, res, next) ?? {};

    return res.status(status).json({
      message:message,
      data:data,
      meta:meta,
    });
  };
};