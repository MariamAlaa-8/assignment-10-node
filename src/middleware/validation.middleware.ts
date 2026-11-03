import { NextFunction, Request, Response } from "express";
import { LanguageEnum } from "../common/enum";
import type { unknown, ZodType } from "zod";
import { BadException } from "../common/exception";


type ValidationInputType = (lang: LanguageEnum) => ZodType
export const validation = (schema: ValidationInputType) => {
  return (req: Request, res: Response, next: NextFunction) => {

    const lang = Number(req.headers['lang']) || LanguageEnum.EN;

    const validationResult = schema(lang).safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    if (!validationResult.success) {
      throw new BadException("validation Error", validationResult.error.issues)
    }
    req.validate = validationResult.data
    next()
  }
}