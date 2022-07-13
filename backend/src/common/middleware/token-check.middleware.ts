import { NestMiddleware, UnauthorizedException, Req } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import axios from 'axios';

export class TokenCheckMiddleware implements NestMiddleware {
  async use(@Req() request, res: Response, next: NextFunction) {
    if (!request.headers['authorization']) {
      throw new UnauthorizedException();
    }
    try {
      const response = await axios.get(process.env.AUTH_GET_USER, {
        headers: {
          authorization: request.headers['authorization'],
        },
      });
      request.user = response.data;
      next();
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
