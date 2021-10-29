import 'package:flutter/material.dart';

class ImageViewer extends StatelessWidget {
  const ImageViewer({
    Key? key,
    required this.url,
    required this.title,
  }) : super(key: key);

  final String url;
  final String? title;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar: title == null
            ? null
            : AppBar(
                title: Text(title!),
              ),
        body: Center(
          child: InteractiveViewer(
            clipBehavior: Clip.none,
            panEnabled: true, // Set it to false
            minScale: 0.5,
            maxScale: 2,
            child: Image.network(url),
          ),
        ),
      ),
    );
  }
}
