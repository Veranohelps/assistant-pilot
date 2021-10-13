import 'package:flutter/material.dart';

class BrandLoading extends StatelessWidget {
  const BrandLoading({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Material(
      child: Center(
        child: Container(
          child: Text('loading...'),
        ),
      ),
    );
  }
}
