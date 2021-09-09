import { Test, TestingModule } from '@nestjs/testing';
import { ExpeditionRouteService } from './expedition-route.service';

describe('ExpeditionRouteService', () => {
  let service: ExpeditionRouteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpeditionRouteService],
    }).compile();

    service = module.get<ExpeditionRouteService>(ExpeditionRouteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
