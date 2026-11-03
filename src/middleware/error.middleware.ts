import{Request,Response,NextFunction} from "express"

import type errorInterface = require("../common/interface/error.interface")

export const globalErrorHandling = (error:errorInterface.IError, req:Request, res:Response, next:NextFunction):Response => {
    return res.status(error.status ?? 500).json({
        error_message: error.message || 'server error',
        error,
         cause: error.cause,
         stack: error.stack
       
      
       
    })
}