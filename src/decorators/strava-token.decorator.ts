import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as _ from 'lodash';

export const StravaToken = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return {
      access_token: _.get(request, 'user.access_token'),
      refresh_token: _.get(request, 'user.refresh_token'),
    };
  },
);
