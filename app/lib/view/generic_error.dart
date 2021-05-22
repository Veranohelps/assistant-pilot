import 'package:flutter/material.dart';

class GenericError extends StatelessWidget {
  final String errorMessage;

  GenericError({required this.errorMessage});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Error")),
      body: Center(
        child: Text(errorMessage),
      ),
    );
  }
}
