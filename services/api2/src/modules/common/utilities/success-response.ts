export class SuccessResponse {
  constructor(private message: string, private data?: Record<string, unknown>) {}

  toJSON() {
    const response = {
      success: true,
      message: this.message,
      data: this.data,
    };

    return response;
  }
}

export const successResponse = (message: string, data?: any) => {
  return new SuccessResponse(message, data);
};
