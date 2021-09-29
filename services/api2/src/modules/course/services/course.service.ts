import { Injectable } from '@nestjs/common';
import { StrapiService } from '../../common/services/strapi.service';
import { ICourse } from '../types/course.type';

@Injectable()
export class CourseService {
  constructor(private strapiService: StrapiService) {}

  async findAll(): Promise<ICourse[]> {
    const response = await this.strapiService.http.get<ICourse[]>('courses');

    return response.body;
  }
}
