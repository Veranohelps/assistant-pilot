import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { Got } from 'got';
import { decode } from 'jsonwebtoken';

@Injectable()
export class StrapiService {
  private jwtToken: string;

  constructor(private configService: ConfigService) {
    this.jwtToken = '';
  }

  async getToken() {
    const decoded = decode(this.jwtToken) as { exp: number };

    if (!decoded?.exp || decoded.exp * 1000 <= Date.now()) {
      try {
        const response = await got.post<{ jwt: string }>(
          `${this.configService.get('STRAPI_URL')}/auth/local`,
          {
            json: {
              identifier: this.configService.get('STRAPI_EMAIL'),
              password: this.configService.get('STRAPI_PASSWORD'),
            },
            responseType: 'json',
          },
        );

        this.jwtToken = response.body.jwt;
      } catch (error) {
        throw new Error('Unable to authenticate with Strapi');
      }
    }

    return this.jwtToken;
  }

  http: Got = got.extend({
    prefixUrl: this.configService.get('STRAPI_URL'),
    responseType: 'json',
    hooks: {
      beforeRequest: [
        async (options) => {
          options.headers.Authorization = `Bearer ${await this.getToken()}`;
        },
      ],
    },
  });
}
