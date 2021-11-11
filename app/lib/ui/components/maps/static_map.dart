import 'dart:math';

import 'package:animations/animations.dart';
import 'package:ant_icons/ant_icons.dart';
import 'package:app/ui/components/brand_system_overlay/brand_system_overlay.dart';
import 'package:app/ui/components/maps/round_button.dart';
import 'package:carbon_icons/carbon_icons.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:ionicons/ionicons.dart';
import 'package:latlong2/latlong.dart';

import 'package:app/config/map_config.dart';
import 'package:app/logic/models/route.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:app/ui/components/maps/helper.dart';

class StaticMap extends StatelessWidget {
  const StaticMap({
    Key? key,
    required this.route,
  }) : super(key: key);

  final DersuRouteFull route;

  @override
  Widget build(BuildContext context) {
    return OpenContainer(
      transitionType: ContainerTransitionType.fade,
      transitionDuration: const Duration(milliseconds: 500),
      closedColor: Colors.transparent,
      openElevation: 0,
      closedElevation: 0,
      openBuilder: (BuildContext context, VoidCallback close) {
        return _OpenMap(handleClose: close, route: route);
      },
      closedBuilder: (BuildContext _, VoidCallback open) {
        return Stack(
          children: [
            FlutterMap(
              options: MapOptions(
                bounds: route.boundaries,
                boundsOptions:
                    const FitBoundsOptions(padding: EdgeInsets.all(10)),
                allowPanning: false,
                zoom: MapConfig.staticInitZoom,
                maxZoom: MapConfig.maxZoom,
                minZoom: MapConfig.minZoom,
                // interactiveFlags: InteractiveFlag.none,
              ),
              layers: getLayoutOptions(route),
            ),
            Positioned(
              right: 5,
              bottom: 5,
              child: BrandButtons.miniIconButton(
                label: 'open full screen map',
                icon: Ionicons.expand_outline,
                onPressed: open,
              ),
            ),
          ],
        );
      },
    );
  }
}

class _OpenMap extends StatefulWidget {
  const _OpenMap({
    Key? key,
    required this.handleClose,
    required this.route,
  }) : super(key: key);

  final VoidCallback handleClose;
  final DersuRouteFull route;

  @override
  _OpenMapState createState() => _OpenMapState();
}

class _OpenMapState extends State<_OpenMap> {
  late final MapController controller;

  @override
  void initState() {
    controller = MapController();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return BrandSystemOverlay(
      isFontBlack: true,
      child: Scaffold(
        body: Stack(
          clipBehavior: Clip.none,
          children: [
            FlutterMap(
              mapController: controller,
              options: MapOptions(
                bounds: widget.route.boundaries,
                boundsOptions:
                    const FitBoundsOptions(padding: EdgeInsets.all(10)),
                allowPanning: false,
                zoom: MapConfig.staticInitZoom,
                maxZoom: MapConfig.maxZoom,
                minZoom: MapConfig.minZoom,
                // interactiveFlags: InteractiveFlag.none,
              ),
              layers: getLayoutOptions(widget.route),
            ),
            Positioned(
              right: 5,
              bottom: max(5, MediaQuery.of(context).padding.bottom),
              child: BrandButtons.miniIconButton(
                label: 'exit full screen map',
                icon: Ionicons.balloon_sharp,
                onPressed: widget.handleClose,
              ),
            ),
            Positioned(
              right: 16,
              top: 20 + MediaQuery.of(context).padding.top,
              child: Column(
                children: [
                  RoundButton(
                    icon: AntIcons.compass,
                    onPress: () {
                      controller.rotate(0);
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
                    icon: CarbonIcons.home,
                    onPress: () {
                      controller.moveAndRotate(
                        LatLng(
                          widget.route.coordinate.coordinates[0].latitude,
                          widget.route.coordinate.coordinates[0].longitude,
                        ),
                        16,
                        0,
                      );
                    },
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
