import 'package:app/config/brand_colors.dart';
import 'package:app/config/brand_text_styles.dart';

import 'package:flutter/material.dart';

class BrandAppBar extends StatelessWidget implements PreferredSizeWidget {
  BrandAppBar({
    Key? key,
    this.actions = const [],
    required this.title,
    this.onPop,
  }) : super(key: key);

  final List<Widget> actions;
  final Widget title;
  final VoidCallback? onPop;
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        boxShadow: kElevationToShadow[2],
        color: BrandColors.primary,
      ),
      child: SafeArea(
        child: Container(
          height: kToolbarHeight,
          child: Stack(
            alignment: Alignment.center,
            children: [
              Text(
                'Console',
                textAlign: TextAlign.center,
              ).h3.withColor(BrandColors.white),
              Row(
                children: [
                  IconButton(
                    icon: Icon(Icons.arrow_back_ios),
                    color: BrandColors.white,
                    onPressed: () {
                      if (onPop != null) {
                        onPop!();
                      }
                      Navigator.of(context).pop();
                    },
                  ),
                  Spacer(),
                  ...actions
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  final Size preferredSize = Size.fromHeight(kToolbarHeight);
}
