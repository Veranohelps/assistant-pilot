import 'package:app/logic/models/geo_json.dart';
import 'package:app/logic/models/route.dart';
import 'package:flutter/material.dart';
import 'dart:ui' as ui;

class AltitudeChart extends StatelessWidget {
  const AltitudeChart({
    Key? key,
    required this.route,
  }) : super(key: key);

  final DersuRouteFull route;

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: ChartPainter(
        coordinates: route.coordinate.coordinates,
      ),
    );
  }
}

const _paddings = 0.1;
const _insetsCount = 100;

class ChartPainter extends CustomPainter {
  final List<PointCoordinates> coordinates;

  ChartPainter({required this.coordinates});

  @override
  void paint(Canvas canvas, Size size) {
    _drawStroke(canvas, size);
    _drawMaxMin(canvas, size);
    _drawInsets(canvas, size);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }

  double _getStrokeHeight(
      double yMax, double value, double yHeight, double availableHeight) {
    return (((yMax - value) / (yHeight)) *
            (availableHeight - availableHeight * _paddings * 2)) +
        (availableHeight * _paddings);
  }

  void _drawInsets(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = Colors.grey.withOpacity(0.9)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;
    final maxY = size.height * _paddings;
    final minY = size.height - size.height * _paddings;
    final step = size.width / _insetsCount;
    final Path maxPath = Path();
    final Path minPath = Path();

    var dx = 0.0;
    for (int i = 0; i < _insetsCount; i++) {
      if (i % 2 == 0) {
        maxPath.moveTo(dx, maxY);
        minPath.moveTo(dx, minY);
      } else {
        maxPath.lineTo(dx, maxY);
        minPath.lineTo(dx, minY);
      }
      dx = dx + step;
    }
    canvas.drawPath(minPath, paint);
    canvas.drawPath(maxPath, paint);
  }

  void _drawStroke(Canvas canvas, Size size) {
    // Gradient paint  for path
    final paint = Paint()
      ..shader = ui.Gradient.linear(
        Offset(size.width / 2, 0),
        Offset(size.width / 2, size.height),
        [
          Colors.grey.withOpacity(0.7),
          Colors.grey.withOpacity(0),
        ],
      );
    //Paint for stroke path
    final Paint strokePaint = Paint()
      ..color = Colors.grey.withOpacity(0.9)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;
    //Path points
    final points = coordinates
        .map((e) => e.altitude)
        .where((element) => element > -1)
        .toList();
    //_path for drawing gradient area of chart
    final _path = Path();
    //strokePath for drawing curve path of chart
    final strokePath = Path();
    final startHeight = size.height - size.height * _paddings;
    final yMin =
        points.reduce((value, element) => value < element ? value : element);
    final yMax =
        points.reduce((value, element) => value > element ? value : element);
    final yHeight = yMax - yMin;
    // distance between points
    final _step = size.width / points.length +
        (size.width / points.length) / points.length;
    //start point of x
    var x = 0.0;

    //Moving area path to start point
    _path.moveTo(0, size.height);
    for (var i = 0; i < points.length; i++) {
      final value = points[i];
      final y = yHeight == 0
          ? startHeight
          : _getStrokeHeight(yMax, value, yHeight, size.height);
      if (x == 0) {
        strokePath.moveTo(x, y);
        _path.lineTo(x, y);
      } else {
        final previousValue = points[i - 1];
        final xPrevious = x - _step;
        final yPrevious = yHeight == 0
            ? startHeight
            : _getStrokeHeight(yMax, previousValue, yHeight, size.height);
        final controlPointX = xPrevious + (x - xPrevious) / 2;
        strokePath.cubicTo(controlPointX, yPrevious, controlPointX, y, x, y);
        _path.cubicTo(controlPointX, yPrevious, controlPointX, y, x, y);
      }
      x += _step;
    }
    _path.lineTo(size.width, size.height);
    canvas.drawPath(strokePath, strokePaint);
    canvas.drawPath(_path, paint);
  }

  void _drawMaxMin(Canvas canvas, Size size) {
    final min = coordinates
        .reduce((value, element) =>
            value.altitude < element.altitude ? value : element)
        .altitude;
    final max = coordinates
        .reduce((value, element) =>
            value.altitude > element.altitude ? value : element)
        .altitude;
    _drawText(canvas, size, '${max.toInt()} m',
        Offset(5, size.height * _paddings), true);
    _drawText(canvas, size, '${min.toInt()} m',
        Offset(5, size.height - size.height * _paddings), false);
  }

  void _drawText(
      Canvas canvas, Size size, String text, Offset offset, bool top) {
    final textSpan = TextSpan(
      text: text,
      style: const TextStyle(fontSize: 16, color: Colors.black),
    );
    final textPainter = TextPainter(
      text: textSpan,
      textDirection: TextDirection.ltr,
    );
    textPainter.layout(
      minWidth: 0,
      maxWidth: size.width,
    );
    var x = offset.dx;
    var y = offset.dy;
    if (top) {
      y = y - textPainter.height - 3;
    } else {
      y = y + 3;
    }

    textPainter.paint(canvas, Offset(x, y));
  }
}
