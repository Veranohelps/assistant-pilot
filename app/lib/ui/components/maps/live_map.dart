import 'dart:async';
import 'dart:math';

import 'package:app/config/get_it_config.dart';
import 'package:app/config/map_config.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/cubits/live/live_cubit.dart';
import 'package:app/logic/get_it/background_geolocation.dart';
import 'package:app/logic/models/route.dart';
import 'package:app/ui/pages/expedition_live/expedition_live_summary.dart';
import 'package:app/utils/geo_utils.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:geolocator/geolocator.dart';
import 'package:ionicons/ionicons.dart';
import 'package:latlong2/latlong.dart';
import 'package:app/ui/components/brand_button/brand_button.dart' as buttons;
import 'package:provider/provider.dart';

class LiveMap extends StatefulWidget {
  LiveMap({required this.route, required this.startTime});

  final DersuRouteFull route;
  final DateTime startTime;

  @override
  State<LiveMap> createState() => _LiveMapState();
}

const zoom = MapConfig.liveInitZoom;

class _LiveMapState extends State<LiveMap> {
  late MapController _controller;
  StreamSubscription<Position>? _positionStream;
  bool _liveUpdate = false;
  bool _hasLiveUpdatePause = false;
  bool isFirstEventAfterCenter = true;
  BackgroundGeolocationService? geolocationService;
  Marker? userMarker;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance!.addPostFrameCallback(_afterLayout);
  }

  Timer? delay;

  void _afterLayout(_) async {
    LatLng? position = await GeoUtils.getUserLocation();
    if (position != null) {
      _controller.move(position, zoom);
      _liveUpdate = true;

      _positionStream = Geolocator.getPositionStream(
        desiredAccuracy: LocationAccuracy.bestForNavigation,
        intervalDuration: Duration(seconds: 5),
      ).listen(_locationListener);

      _controller.mapEventStream.listen(_mapListener);
    }
    _geoFence();
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
    LatLng? userCurrentPosition = await GeoUtils.getUserLocation();
    if (userCurrentPosition != null) {
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

  void _locationListener(Position position) {
    if (_liveUpdate && !_hasLiveUpdatePause) {
      _controller.move(
        LatLng(position.latitude, position.longitude),
        _controller.zoom,
      );
    }
    setState(() {
      userMarker = Marker(
        point: LatLng(position.latitude, position.longitude),
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
    LatLng? position = await GeoUtils.getUserLocation();
    if (position != null) {
      _controller.move(position, _controller.zoom);
    }
  }

  @override
  void dispose() {
    _positionStream?.cancel();
    geolocationService?.stop();
    super.dispose();
  }

  Future<void> _geoFence() async {
    geolocationService = getIt<BackgroundGeolocationService>();
    await geolocationService!.init();
    await geolocationService!.start(widget.route.waypoints, 150);
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        getMap(),
        Positioned(
          right: 5,
          bottom: max(5, MediaQuery.of(context).padding.bottom),
          child: buttons.miniIconButton(
            label: 'find my location',
            icon: Ionicons.location_outline,
            onPressed: _findMe,
            backgroundColor: _liveUpdate ? Colors.blue : Colors.grey,
          ),
        ),
        Positioned(
          right: 5,
          top: max(5, MediaQuery.of(context).padding.bottom),
          child: buttons.primaryElevatedButton(
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
        ),
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
        onMapCreated: (c) => _controller = c,
      ),
      layers: [
        MapConfig.tilesLayourOptions,
        CircleLayerOptions(
          circles: [
            ...MapConfig.dots(
              widget.route.coordinate.coordinates
                  .map((p) => LatLng(p.latitude, p.longitude))
                  .toList(),
            ),
            ...MapConfig.waypoints(widget.route.waypoints),
          ],
        ),
        PolylineLayerOptions(
          polylines: [
            MapConfig.route(
              widget.route.coordinate.coordinates,
              color: Colors.blue.withOpacity(0.5),
              strokeWidth: 4,
            ),
            MapConfig.route(
              widget.route.coordinate.coordinates,
              color: Colors.red,
              strokeWidth: 1,
            ),
          ],
        ),
        MarkerLayerOptions(
          markers: [
            MapConfig.startMarker(LatLng(
              widget.route.coordinate.coordinates[0].latitude,
              widget.route.coordinate.coordinates[0].longitude,
            )),
            if (userMarker != null) userMarker!,
          ],
        ),
      ],
    );
  }
}