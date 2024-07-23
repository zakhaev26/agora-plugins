import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsersDocument } from '../users/schemas/user.schema';
import { Request as ExRequest } from 'express-serve-static-core';
import e from 'express';

/**
 * acts as hooks similar to feathers.js
 */

declare type Request = {
  user: UsersDocument;
} & ExRequest;

declare type ModifyBodyFn = (request: Request) => Request;

export const setCreatedBy = (key = 'createdBy'): ModifyBodyFn => {
  return (request: Request) => {
    request.body[key] = request.user._id;
    return request;
  };
};

export const ModifyBody = createParamDecorator(
  (fn: undefined | ModifyBodyFn | ModifyBodyFn[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (Array.isArray(fn)) {
      fn.forEach((f) => f(request));
    } else {
      fn(request);
    }
    return request.body;
  },
);
