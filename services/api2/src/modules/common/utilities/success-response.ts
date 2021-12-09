import { format } from 'date-fns';
import _ from 'lodash';

export class SuccessResponse {
  constructor(private message: string, private data?: Record<string, unknown>) {}

  static transform(data: any) {
    const transformed = _.cloneDeepWith(data, (value, key) => {
      // do not clone coordinate data
      if (key === 'coordinate') {
        return value;
      }
      if (value instanceof Date) {
        return format(value, `yyyy-MM-dd'T'HH:mmxxx`);
      }
    });

    return transformed;
  }

  toJSON() {
    const response = {
      success: true,
      message: this.message,
      data: this.data ? SuccessResponse.transform(this.data) : undefined,
    };

    return response;
  }
}

export const successResponse = (message: string, data?: any) => {
  return new SuccessResponse(message, data);
};
