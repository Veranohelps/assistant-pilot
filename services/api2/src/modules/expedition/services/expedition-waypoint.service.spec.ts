import { Test, TestingModule } from '@nestjs/testing';
import { ExpeditionWaypointService } from './expedition-waypoint.service';

describe('ExpeditionWaypointService', () => {
  let service: ExpeditionWaypointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpeditionWaypointService],
    }).compile();

    service = module.get<ExpeditionWaypointService>(ExpeditionWaypointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
