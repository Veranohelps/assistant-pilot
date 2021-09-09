import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes } from './error-codes';

export class BaseHttpError extends HttpException {
  error?: any;
  code: string;

  constructor(message: string, status: number, code: ErrorCodes, error?: any) {
    super({ message, error }, status);

    this.code = code;
    this.error = error;
  }

  getResponse() {
    return {
      success: false,
      message: this.message,
      code: this.code,
      error: this.error,
    };
  }
}

export class NotFoundError extends BaseHttpError {
  constructor(code: ErrorCodes, message = 'Not found', error?: any) {
    super(message, HttpStatus.NOT_FOUND, code, error);
  }
}

export class ConflictError extends BaseHttpError {
  constructor(code: ErrorCodes, message = 'Conflict', error?: any) {
    super(message, HttpStatus.CONFLICT, code, error);
  }
}

export class UnauthorizedError extends BaseHttpError {
  constructor(code: ErrorCodes, message = 'Not authorized', error?: any) {
    super(message, HttpStatus.UNAUTHORIZED, code, error);
  }
}

export class ForbiddenError extends BaseHttpError {
  constructor(code: ErrorCodes, message = 'Forbidden', error?: any) {
    super(message, HttpStatus.FORBIDDEN, code, error);
  }
}

export class BadRequestError extends BaseHttpError {
  constructor(code: ErrorCodes, message = 'Bad request', error?: any) {
    super(message, HttpStatus.BAD_REQUEST, code, error);
  }
}

export class NotAllowedError extends BaseHttpError {
  constructor(code: ErrorCodes, message = 'Method not allowed', error?: any) {
    super(message, HttpStatus.METHOD_NOT_ALLOWED, code, error);
  }
}

export class ServerError extends BaseHttpError {
  constructor(code: ErrorCodes, message = 'Server error', error?: any) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, code, error);
  }
}
