import 'dart:async';
import 'dart:math';

import 'package:ant_icons/ant_icons.dart';
import 'package:app/config/get_it_config.dart';
import 'package:app/config/map_config.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/cubits/live/live_cubit.dart';
import 'package:app/logic/get_it/background_geolocation.dart';
import 'package:app/logic/models/route.dart';
import 'package:app/ui/components/maps/helper.dart';
import 'package:app/ui/components/maps/round_button.dart';
import 'package:app/ui/components/maps/timer.dart';
import 'package:app/ui/pages/expedition_live/expedition_live_summary.dart';
import 'package:app/utils/geo_utils.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:carbon_icons/carbon_icons.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:ionicons/ionicons.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:provider/provider.dart';
import 'package:latlong2/latlong.dart';

import 'live_meteogram.dart';

class LiveMap extends StatefulWidget {
  const LiveMap({
    Key? key,
    required this.route,
    required this.startTime,
  }) : super(key: key);

  final DersuRouteFull route;
  final DateTime startTime;

  @override
  State<LiveMap> createState() => _LiveMapState();
}

const zoom = MapConfig.liveInitZoom;

class _LiveMapState extends State<LiveMap> {
  late MapController controller;
  bool _liveUpdate = false;
  bool _hasLiveUpdatePause = false;
  bool isFirstEventAfterCenter = true;
  BackgroundGeolocationService? geolocationService;
  Marker? userMarker;
  StreamSubscription<MapEvent>? _mapStream;
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance!.addPostFrameCallback(_afterLayout);
  }

  Timer? delay;

  void _afterLayout(_) async {
    await _geoFence();
    if (geolocationService != null) {
      LatLng position = await geolocationService!.getCurrentPosition();
      controller.move(position, zoom);
      _liveUpdate = true;
      _mapStream = controller.mapEventStream.listen(_mapListener);

      geolocationService!
          .addLocationListener(_locationListener, _locationErrorListener);
      _locationListener(await geolocationService!.currentPosition);
    }
  }

  Future<void> _mapListener(event) async {
    if (event is MapEventMoveStart ||
        event is MapEventFlingAnimationStart ||
        event is MapEventDoubleTapZoomStart ||
        event is MapEventRotateStart) {
      _hasLiveUpdatePause = true;
    } else {
      delay?.cancel();
      delay = Timer(
        Duration(seconds: 5),
        () => _hasLiveUpdatePause = false,
      );
    }

    LatLng position = LatLng(event.center.latitude, event.center.longitude);
    if (geolocationService != null) {
      LatLng userCurrentPosition =
          await geolocationService!.getCurrentPosition();
      if (isFirstEventAfterCenter) {
        isFirstEventAfterCenter = false;
      } else {
        var distance = GeoUtils.getDistance(userCurrentPosition, position);
        var kZoom = pow(2, zoom - event.zoom) * pow(2, zoom - event.zoom);
        if (distance.abs() > kZoom * 300) {
          setState(() {
            _liveUpdate = false;
          });
        }
      }
    }
  }

  void _locationErrorListener(error) {
    _liveUpdate = false;
    print(error);
  }

  void _locationListener(position) {
    if (_liveUpdate && !_hasLiveUpdatePause) {
      controller.move(
        LatLng(position.coords.latitude, position.coords.longitude),
        controller.zoom,
      );
    }
    setState(() {
      userMarker = Marker(
        point: LatLng(position.coords.latitude, position.coords.longitude),
        height: 20,
        width: 20,
        builder: (BuildContext context) {
          return Container(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.blue,
            ),
          );
        },
      );
    });
  }

  void _findMe() async {
    setState(() {
      _liveUpdate = true;
      _hasLiveUpdatePause = false;
      isFirstEventAfterCenter = true;
    });
    if (geolocationService != null) {
      LatLng position = await geolocationService!.getCurrentPosition();
      controller.move(position, controller.zoom);
    }
  }

  @override
  void dispose() {
    if (_mapStream != null) {
      _mapStream!.cancel();
    }
    geolocationService?.stop();
    super.dispose();
  }

  Future<void> _geoFence() async {
    geolocationService = getIt<BackgroundGeolocationService>();
    await geolocationService!.init();
    await geolocationService!.start(widget.route.waypoints);
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        getMap(),
        Positioned(
          right: 16,
          top: 20 + MediaQuery.of(context).padding.top,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              BrandButtons.primaryElevatedButton(
                label: 'Exit expedition',
                onPressed: () {
                  context.read<LiveCubit>().clean();
                  Navigator.of(context).pushReplacement(
                    materialRoute(
                      ExpeditionSummary(
                        duration: DateTime.now().difference(widget.startTime),
                      ),
                    ),
                  );
                },
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    SizedBox(width: 5),
                    Text(
                      LocaleKeys.expedition_live_finish.tr(),
                      style: TextStyle(height: 1),
                    ),
                    SizedBox(width: 5),
                    Icon(
                      Ionicons.log_out_outline,
                      size: 16,
                    ),
                  ],
                ),
              ),
              SizedBox(height: 40),
              RoundButton(
                icon: AntIcons.compass,
                onPress: () {
                  controller.rotate(0);
                },
              ),
              SizedBox(height: 16),
              RoundButton(
                icon: CarbonIcons.location_current,
                onPress: () {
                  _findMe();
                },
              ),
              SizedBox(height: 16),
              RoundButton(
                icon: CarbonIcons.map_boundary,
                onPress: () {
                  controller
                    ..rotate(0)
                    ..fitBounds(widget.route.boundaries);
                },
              ),
              SizedBox(height: 16),
              RoundButton(
                icon: CarbonIcons.temperature,
                onPress: () {
                  Navigator.push(
                    context,
                    materialRoute(
                      LiveMetiogram(routeId: widget.route.id),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
        Positioned(
          bottom: MediaQuery.of(context).padding.bottom + 16,
          child: Container(
            height: 48,
            padding: EdgeInsets.symmetric(horizontal: 16),
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(
                12,
              ),
            ),
            child: ExpedtitionTimer(startTime: widget.startTime),
          ),
        )
      ],
    );
  }

  Widget getMap() {
    return FlutterMap(
      options: MapOptions(
        allowPanning: false,
        center: LatLng(
          widget.route.coordinate.coordinates[0].latitude,
          widget.route.coordinate.coordinates[0].longitude,
        ),
        zoom: zoom,
        maxZoom: MapConfig.maxZoom,
        minZoom: MapConfig.minZoom,
        onMapCreated: (c) => controller = c,
      ),
      layers: [
        ...getLayoutOptions(widget.route),
        if (userMarker != null) MarkerLayerOptions(markers: [userMarker!]),
      ],
    );
  }
}
