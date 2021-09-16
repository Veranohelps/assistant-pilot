import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthModule } from './auth/auth/auth.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { ExpeditionModule } from './expedition/expedition.module';
import { RouteModule } from './route/route.module';
import { SkillModule } from './skill/skill.module';
import { WaypointModule } from './waypoint/waypoint.module';

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
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,
    ExpeditionModule,
    DatabaseModule,
    WaypointModule,
    RouteModule,
    AuthModule,
    DictionaryModule,
    SkillModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
