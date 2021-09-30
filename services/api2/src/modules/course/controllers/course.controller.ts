import { Controller, Get } from '@nestjs/common';
import { CourseService } from '../services/course.service';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  findAll() {
    return this.courseService.findAll();
  }
}
