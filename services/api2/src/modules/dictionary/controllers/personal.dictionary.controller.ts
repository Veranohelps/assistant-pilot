import { Controller, Get, HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiAdminTokenProtected } from '../../auth/decorators/api-admin-token-protected.decorator';
import { successResponse } from '../../common/utilities/success-response';
import dictionaries from '../static/dictionaries.json';
import dictionaryLevels from '../static/dictionary-levels.json';
import { IDictionary } from '../types/dictionary.type';

@Controller('/personal/dictionary')
@ApiAdminTokenProtected()
@Injectable()
export class PersonalDictionaryController {
  constructor(private configService: ConfigService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getPersonalDictionaries() {
    const dictionariesJson = dictionaries.map<IDictionary>((dictionary) => ({
      ...dictionary,
      url: `${this.configService.get('APP_URL')}/personal/dictionary/${dictionary.id}`,
    }));

    return successResponse('Personal Dictionaries', { dictionaries: dictionariesJson });
  }

  @Get('/levels')
  @HttpCode(HttpStatus.OK)
  async getPersonalDictionaryLevels() {
    return successResponse('Personal Levels Dictionary', { dictionaryLevels });
  }
}
