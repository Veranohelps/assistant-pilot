part of 'avatar_button.dart';

mixin FileUtil {
  String base64Encode(File file) {
    return convert.base64Encode(file.readAsBytesSync());
  }
}

Future<void> handleUserPic(
  BuildContext context, {
  required void Function(File) onFileSelected,
  required Future<void> Function() onAvatarDelete,
  String? avatarUrl,
}) async {
  final _picker = ImagePicker();

  OverlaySupportEntry? _overlay;

  _showOverlay() {
    _overlay = showOverlay(
      (ctx, _) => BrandLoader(),
      animationDuration: Duration(milliseconds: 500),
      reverseAnimationDuration: Duration(milliseconds: 500),
      duration: Duration(seconds: 5),
    );
  }

  final res = await showCupertinoModalPopup<XFile>(
    context: context,
    builder: (context) {
      return CupertinoActionSheet(
        title: Text('Tu foto de perfil'),
        message: Text(
            'Te recomendamos que la foto no mida más de 500x500 px y sea formato jpg o png.'),
        actions: [
          CupertinoActionSheetAction(
            onPressed: () async {
              if (await _checkPermission(Permission.camera)) {
                final image = await _picker.pickImage(
                  source: ImageSource.camera,
                  preferredCameraDevice: CameraDevice.front,
                );
                Navigator.of(context).pop(image);
              }
            },
            child: Text('Hacer una foto'),
          ),
          CupertinoActionSheetAction(
            onPressed: () async {
              if (await _checkPermission(Permission.photos)) {
                final image =
                    await _picker.pickImage(source: ImageSource.gallery);
                Navigator.of(context).pop(image);
              }
            },
            child: Text('Elegir una de la galería'),
          ),
          if (avatarUrl != null)
            CupertinoActionSheetAction(
              isDestructiveAction: true,
              onPressed: () {
                onAvatarDelete();
                Navigator.of(context).pop();
              },
              child: Text('Eliminar foto'),
            ),
        ],
        cancelButton: CupertinoActionSheetAction(
          onPressed: () {
            Navigator.pop(context);
          },
          child: Text('Cancelar'),
        ),
      );
    },
  );
  //

  if (res != null) {
    _showOverlay();
    final croppedImage = await _cropImage(res);
    if (croppedImage != null) {
      onFileSelected(croppedImage);
    }
    _overlay?.dismiss();
  }
}

Future<File?> _cropImage(XFile image) async {
  return ImageCropper.cropImage(
    maxWidth: 512,
    maxHeight: 512,
    sourcePath: image.path,
    cropStyle: CropStyle.circle,
  );
}

Future<bool> _checkPermission(Permission permission) async {
  final isPermanentlyDenied = await permission.isPermanentlyDenied;
  final isLimited = await permission.isLimited;
  if (isPermanentlyDenied || isLimited) {
    await openAppSettings();
  }
  final isDenied = await permission.isDenied;
  if (isDenied) {
    await permission.request();
  }
  return await permission.isGranted;
}
