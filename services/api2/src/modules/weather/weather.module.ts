import { Module } from '@nestjs/common';
import { BpaModule } from '../bpa/bpa.module';
import { MeteoblueService } from './services/meteoblue.service';
import { OpenWeatherService } from './services/openweather.service';
import { WeatherService } from './services/weather.service';

@Module({
  imports: [BpaModule],
  providers: [MeteoblueService, OpenWeatherService, WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
