import _ from 'lodash';

export class SuccessResponse {
  constructor(private message: string, private data?: Record<string, unknown>) {}

  formatDate(date: Date) {
    const tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = (num: number) => {
        const norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
      };

    const dateString = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}${dif}${pad(tzo / 60)}:${pad(tzo % 60)}`;

    return dateString;
  }

  transform(data: Record<string, unknown>) {
    const transformed = _.cloneDeepWith(data, (value, key) => {
      // do not clone coordinate data
      if (key === 'coordinate') {
        return value;
      }
      if (value instanceof Date) {
        return this.formatDate(value);
      }
    });

    return transformed;
  }

  toJSON() {
    const response = {
      success: true,
      message: this.message,
      data: this.data ? this.transform(this.data) : undefined,
    };

    return response;
  }
}

export const successResponse = (message: string, data?: any) => {
  return new SuccessResponse(message, data);
};
