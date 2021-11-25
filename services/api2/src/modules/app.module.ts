import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AssessmentModule } from './assessment/assessment.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { CourseModule } from './course/course.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DatabaseModule } from './database/database.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { ExpeditionModule } from './expedition/expedition.module';
import { RouteModule } from './route/route.module';
import { SkillModule } from './skill/skill.module';
import { UserModule } from './user/user.module';
import { WaypointModule } from './waypoint/waypoint.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: false,
      playground: process.env.NODE_ENV !== 'production',
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatError: (err) => {
        return err;
      },
    }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(process.cwd(), 'secrets/.env') }),
    CommonModule,
    ExpeditionModule,
    DatabaseModule,
    WaypointModule,
    RouteModule,
    AuthModule,
    DictionaryModule,
    SkillModule,
    UserModule,
    CourseModule,
    AssessmentModule,
    DashboardModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
