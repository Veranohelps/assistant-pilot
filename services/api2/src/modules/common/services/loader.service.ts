import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import DataLoader from 'dataloader';
import { RouteService } from '../../route/services/route.service';
import { IRoute } from '../../route/types/route.type';
import { WaypointService } from '../../waypoint/services/waypoint.service';
import { IWaypoint } from '../../waypoint/types/waypoint.type';
import { ErrorCodes } from '../errors/error-codes';
import { NotFoundError } from '../errors/http.error';
import { generateRecord2 } from '../utilities/generate-record';

@Injectable()
export class LoaderService {
  private waypointService!: WaypointService;
  private routeService!: RouteService;

  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.waypointService = this.moduleRef.get(WaypointService, { strict: false });
    this.routeService = this.moduleRef.get(RouteService, { strict: false });
  }

  waypointLoader: DataLoader<string, IWaypoint> = new DataLoader(
    async (ids) => {
      const waypointRecord = await this.waypointService
        .findByIds(null, ids as string[])
        .then(generateRecord2((waypoint) => waypoint.id));

      return ids.map(
        (id) =>
          waypointRecord[id] ??
          new NotFoundError(ErrorCodes.WAYPOINT_NOT_FOUND, 'Waypoint not found'),
      );
    },
    { cache: false },
  );

  routeLoader: DataLoader<string, IRoute> = new DataLoader(
    async (ids) => {
      const routeRecord = await this.routeService.findByIds(null, ids as string[]);

      return ids.map(
        (id) => routeRecord[id] ?? new NotFoundError(ErrorCodes.ROUTE_NOT_FOUND, 'Route not found'),
      );
    },
    { cache: false },
  );
}
