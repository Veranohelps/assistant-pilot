import { TestingModule } from '@nestjs/testing';
import { BootstrapTest } from '../../../../test/setup';
import { WeatherService } from '../weather.service';

describe('WeatherService', () => {
  const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;
  const MILLISECONDS_IN_TWO_DAYS = MILLISECONDS_IN_A_DAY * 2;
  const MILLISECONDS_LIM_SUP = MILLISECONDS_IN_A_DAY * 7;

  let service: WeatherService;
  let module: TestingModule;

  function between(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  beforeAll(async () => {
    module = await BootstrapTest();
    service = module.get<WeatherService>(WeatherService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('for a Expedition within 24 hours, it should return NOT dailyMode prediciton', () => {
    const now = new Date();
    const milliseconds = between(now.getTime(), now.getTime() + MILLISECONDS_IN_A_DAY);
    const expeditionDate = new Date(milliseconds);

    const dailyMode = service.calculateDailyMode(expeditionDate);

    expect(false).toEqual(dailyMode);
  });

  it('for a Expedition within 48 hours, it should return NOT dailyMode prediciton', () => {
    const now = new Date();
    const milliseconds = between(now.getTime(), now.getTime() + MILLISECONDS_IN_TWO_DAYS);
    const expeditionDate = new Date(milliseconds);

    const dailyMode = service.calculateDailyMode(expeditionDate);

    expect(false).toEqual(dailyMode);
  });
  it('for a Expedition more than 48 hours after today, it should return dailyMode prediciton', () => {
    const now = new Date();
    const milliseconds = between(
      now.getTime() + MILLISECONDS_IN_TWO_DAYS,
      now.getTime() + MILLISECONDS_LIM_SUP,
    );
    const expeditionDate = new Date(milliseconds);
    const dailyMode = service.calculateDailyMode(expeditionDate);

    expect(true).toEqual(dailyMode);
  });
});
