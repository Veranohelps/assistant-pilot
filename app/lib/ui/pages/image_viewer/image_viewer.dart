import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class ImageViewer extends StatefulWidget {
  const ImageViewer({
    Key? key,
    required this.url,
    required this.title,
  }) : super(key: key);

  final String url;
  final String? title;

  @override
  State<ImageViewer> createState() => _ImageViewerState();
}

class _ImageViewerState extends State<ImageViewer> {
  @override
  void initState() {
    super.initState();

    SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
      DeviceOrientation.landscapeRight,
      DeviceOrientation.landscapeLeft
    ]);
  }

  @override
  void dispose() {
    SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar: widget.title == null
            ? null
            : AppBar(
                title: Text(widget.title!),
              ),
        body: Center(
          child: InteractiveViewer(
            clipBehavior: Clip.none,
            panEnabled: true, // Set it to false
            minScale: 0.5,
            maxScale: 2,
            child: Image.network(widget.url),
          ),
        ),
      ),
    );
  }
}
