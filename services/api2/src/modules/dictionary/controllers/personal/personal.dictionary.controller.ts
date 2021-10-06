import { Controller, Get, HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtProtected } from '../../../auth/decorators/jwt-protected.decorator';
import { successResponse } from '../../../common/utilities/success-response';
import { DictionaryService } from '../../services/dictionary.service';
import { IDictionary } from '../../types/dictionary.type';

@Controller('/personal/dictionary')
@JwtProtected()
@Injectable()
export class PersonalDictionaryController {
  constructor(private configService: ConfigService, private dictionaryService: DictionaryService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAllDictionaries() {
    const dictionaries: IDictionary[] = [
      {
        id: 'route-origin',
        url: `${this.configService.get('APP_URL')}/personal/dictionary/route-origin`,
      },
      { id: 'skill', url: `${this.configService.get('APP_URL')}/personal/dictionary/skill` },
    ];

    return successResponse('Dictionaries', { dictionaries });
  }

  @Get('skill')
  @HttpCode(HttpStatus.OK)
  async getSkillDictionary() {
    const skills = await this.dictionaryService.levels();

    return successResponse('Skill Dictionary', { skills });
  }

  @Get('route-origin')
  @HttpCode(HttpStatus.OK)
  async getRouteOriginDictionary() {
    const routeOrigins = await this.dictionaryService.routeOrigins();

    return successResponse('Route Origin Dictionary', { routeOrigins });
  }
}
