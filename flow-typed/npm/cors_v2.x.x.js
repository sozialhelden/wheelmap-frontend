// flow-typed signature: 8c4ca414f9f24aa84a8f760f7f776e69
// flow-typed version: e9b4192877/cors_v2.x.x/flow_>=v0.53.x

// @flow
import type { $Request as Request, $Response as Response, NextFunction } from "express";

interface RequestHandler {
     (req: Request, res: Response, next?: NextFunction): mixed;
 }

type CustomOrigin = (
    requestOrigin: string,
    callback: (err: Error | null, allow?: boolean) => void
) => void;

type CorsOptions = {
    origin?: boolean | string | RegExp | string[] | RegExp[] | CustomOrigin;
    methods?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
}

declare module "cors" {
    declare export default (options?: CorsOptions) => RequestHandler;
}
