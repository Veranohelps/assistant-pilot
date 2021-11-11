import 'dart:convert' as convert;
import 'dart:io';

import 'package:cubit_form/cubit_form.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';
import 'package:overlay_support/overlay_support.dart';
import 'package:permission_handler/permission_handler.dart';

import 'package:app/config/brand_colors.dart';
import 'package:app/logic/cubits/profile/profile_cubit.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';

part 'helper.dart';

class AvatarButtonWidget extends StatelessWidget {
  const AvatarButtonWidget({
    Key? key,
    required this.url,
    required this.onFileSelected,
    required this.onAvatarDelete,
  }) : super(key: key);

  final String? url;
  final void Function(File) onFileSelected;
  final Future<void> Function() onAvatarDelete;

  @override
  Widget build(BuildContext context) {
    var profileState = context.watch<ProfileCubit>().state;
    if (profileState is! ProfileDersuRegistrationFinished) {
      return BrandLoader();
    }

    return GestureDetector(
      onTap: () => handleUserPic(
        context,
        onFileSelected: onFileSelected,
        onAvatarDelete: onAvatarDelete,
        avatarUrl: url,
      ),
      child: Container(
        width: 80,
        height: 80,
        alignment: Alignment.bottomRight,
        decoration: BoxDecoration(
          color: (url == null) ? BrandColors.dGray : null,
          shape: BoxShape.circle,
          image: getImage(url),
        ),
        child: Container(
          padding: EdgeInsets.all(5),
          decoration: BoxDecoration(
            color: BrandColors.mGrey,
            shape: BoxShape.circle,
          ),
          child: Icon(
            Icons.edit,
            color: BrandColors.white,
            size: 15,
          ),
        ),
      ),
    );
  }

  DecorationImage? getImage(String? url) {
    print(url);
    if (url == null) {
      return null;
    }

    return DecorationImage(
      image: NetworkImage(url),
      fit: BoxFit.cover,
    );
  }
}
