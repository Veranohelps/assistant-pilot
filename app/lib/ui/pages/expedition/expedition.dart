// import 'package:app/logic/cubits/route/route_cubit.dart';
// import 'package:app/logic/model/url.dart';
// import 'package:app/ui/components/expedition/expedition.dart';
// import 'package:app/ui/components/loader/loader.dart';
// import 'package:flutter/material.dart';
// import 'package:flutter_bloc/flutter_bloc.dart';

// class ExpeditionPage extends StatelessWidget {
//   const ExpeditionPage({
//     Key? key,
//     required this.expedition,
//     required this.dersuUrl,
//     required this.isLive,
//     required this.waypointPrecision,
//   }) : super(key: key);

//   final DersuUrlModel dersuUrl;
//   final bool isLive;
//   final int waypointPrecision;

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: BlocProvider(
//         create: (BuildContext context) => RouteCubit()..getRoute(dersuUrl.url),
//         child: Builder(
//           builder: (context) {
//             var route = context.watch<RouteCubit>().state;
//             if (route == null) {
//               return Loader();
//             }
//             return ExpeditionMapWidget(
//               isLive: isLive,
//               expedition: expedition,
//               route: route,
//               waypointPrecision: waypointPrecision,
//             );
//           },
//         ),
//       ),
//     );
//   }
// }
