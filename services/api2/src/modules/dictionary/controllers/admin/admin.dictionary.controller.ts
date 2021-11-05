import { Controller, Get, HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiAdminTokenProtected } from '../../../auth/decorators/api-admin-token-protected.decorator';
import { successResponse } from '../../../common/utilities/success-response';
import { DictionaryService } from '../../services/dictionary.service';
import { IDictionary } from '../../types/dictionary.type';

@Controller('/admin/dictionary')
@ApiAdminTokenProtected()
@Injectable()
export class AdminDictionaryController {
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
      {
        id: 'waypoint-type',
        url: `${this.configService.get('APP_URL')}/personal/dictionary/waypoint-type`,
      },
      {
        id: 'activity-type',
        url: `${this.configService.get('APP_URL')}/personal/dictionary/activity-type`,
      },
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

  @Get('waypoint-type')
  @HttpCode(HttpStatus.OK)
  getWaypointTypeDictionary() {
    const waypointTypes = this.dictionaryService.waypointTypes();

    return successResponse('Waypoint Type Dictionary', { waypointTypes });
  }

  @Get('activity-type')
  @HttpCode(HttpStatus.OK)
  getActivityTypeDictionary() {
    const activityTypes = this.dictionaryService.activityTypes();

    return successResponse('Activity Type Dictionary', { activityTypes });
  }
}
