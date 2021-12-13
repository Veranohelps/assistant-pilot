import 'dart:async';
import 'dart:math';

import 'package:ant_icons/ant_icons.dart';
import 'package:app/config/get_it_config.dart';
import 'package:app/config/map_config.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/cubits/dictionaries/dictionaries_cubit.dart';
import 'package:app/logic/cubits/live/live_cubit.dart';
import 'package:app/logic/get_it/geofence.dart';
import 'package:app/logic/models/route.dart';
import 'package:app/ui/helpers/map_layouts.dart';
import 'package:app/ui/components/round_button/round_button.dart';
import 'package:app/ui/pages/expedition_live/three_by_three_test.dart';
import 'package:app/ui/pages/expedition_live/timer.dart';
import 'package:app/ui/pages/expedition_live/expedition_live_summary.dart';
import 'package:app/utils/extensions/locations.dart';
import 'package:app/utils/geo_utils.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:carbon_icons/carbon_icons.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_background_geolocation/flutter_background_geolocation.dart'
    as bg;
import 'package:flutter_map/flutter_map.dart';
import 'package:ionicons/ionicons.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:latlong2/latlong.dart';
import 'package:easy_debounce/easy_debounce.dart';

import 'live_meteogram.dart';

const debouncer = 'MapListenerDebouncer';

class LiveMap extends StatefulWidget {
  const LiveMap({
    Key? key,
    required this.route,
    required this.expeditionId,
    required this.startTime,
  }) : super(key: key);

  final DersuRouteFull route;
  final DateTime startTime;
  final String expeditionId;

  @override
  State<LiveMap> createState() => _LiveMapState();
}

const initZoom = MapConfig.liveInitZoom;

class _LiveMapState extends State<LiveMap> {
  late MapController _controller;
  bg.Location? _userLocation;
  late GeofenceService _geofenceService;
  late StreamSubscription<MapEvent> _mapStream;
  bool isMapFixedToLocation = true;
  bool isMapFixedToLocationOnPause = false;

  Marker? _userMarker;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance!.addPostFrameCallback(_afterLayout);
  }

  void _afterLayout(_) async {
    await geoFenceStart();
    _userLocation = await bg.BackgroundGeolocation.getCurrentPosition();
    _controller.moveToLocation(_userLocation!, initZoom);
    _mapStream = _controller.mapEventStream.listen(
      (event) {
        if (event is MapEventMoveStart ||
            event is MapEventFlingAnimationStart ||
            event is MapEventDoubleTapZoomStart ||
            event is MapEventRotateStart) {
          isMapFixedToLocationOnPause = true;
        } else {
          EasyDebounce.debounce(
            debouncer,
            Duration(seconds: 2),
            () => _mapListener(event),
          );
        }
      },
    );
    bg.BackgroundGeolocation.onLocation(
      _locationListener,
      _locationErrorListener,
    );
    _locationListener(_userLocation!);
  }

  Future<void> _mapListener(MapEvent event) async {
    isMapFixedToLocationOnPause = false;

    var distance =
        GeoUtils.getDistance(_userLocation!.toLatLong(), event.center);
    var kZoom = pow(2, initZoom - event.zoom) * pow(2, initZoom - event.zoom);

    if (distance.abs() > kZoom * 300) {
      isMapFixedToLocation = false;
    }
  }

  void _locationErrorListener(error) {
    isMapFixedToLocation = false;
    getIt<Analitics>().sendErrorEvent(action: 'location error');
  }

  void _locationListener(bg.Location location, [double? zoom]) {
    if (isMapFixedToLocation && !isMapFixedToLocationOnPause) {
      _controller.moveToLocation(
        location,
        zoom ?? _controller.zoom,
      );
    }
    _userLocation = location;
    setState(() {
      _userMarker = Marker(
        point: location.toLatLong(),
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
    isMapFixedToLocation = true;
    isMapFixedToLocationOnPause = false;
    _locationListener(_userLocation!, initZoom);
  }

  @override
  void dispose() {
    _mapStream.cancel();
    bg.BackgroundGeolocation.removeListener(_locationListener);
    _geofenceService.stop();
    EasyDebounce.cancel(debouncer);
    super.dispose();
  }

  Future<void> geoFenceStart() async {
    _geofenceService = getIt<GeofenceService>();
    await _geofenceService.init();
    await _geofenceService.start(widget.route.waypoints);
  }

  @override
  Widget build(BuildContext context) {
    var dict = context.read<DictionariesCubit>().state as DictionariesLoaded;

    return BlocListener<LiveCubit, LiveState>(
      listener: (context, state) {
        if (state is LiveStateOn3x3) {
          var waypoint =
              (context.read<LiveCubit>().state as LiveStateOn3x3).waypoint;
          Navigator.of(context).push(materialRoute(ThreeByThreeTest(
            waypoint: waypoint,
            waypointTypes: dict.waypointTypes,
            closeCallback: context.read<LiveCubit>().closeThreeByThree,
          )));
        }
      },
      child: Stack(
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
                    _controller.rotate(0);
                  },
                ),
                SizedBox(height: 16),
                RoundButton(
                  icon: CarbonIcons.location_current,
                  onPress: _findMe,
                ),
                SizedBox(height: 16),
                RoundButton(
                  icon: CarbonIcons.map_boundary,
                  onPress: () async {
                    isMapFixedToLocation = false;
                    _controller
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
                        LiveMetiogram(expeditionId: widget.expeditionId),
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
      ),
    );
  }

  Widget getMap() {
    return FlutterMap(
      key: ValueKey('Map'),
      options: MapOptions(
        allowPanning: false,
        center: LatLng(
          widget.route.coordinate.coordinates[0].latitude,
          widget.route.coordinate.coordinates[0].longitude,
        ),
        zoom: initZoom,
        maxZoom: MapConfig.maxZoom,
        minZoom: MapConfig.minZoom,
        onMapCreated: (c) => _controller = c,
      ),
      layers: [
        ...getLayoutOptions(widget.route),
        if (_userMarker != null) MarkerLayerOptions(markers: [_userMarker!]),
      ],
    );
  }
}
