import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

enum CameraDevices {
  front,
  rear,
}

enum ImagemPerfilModel {
  small,
  medium,
  large,
}

extension ImagemPerfilSizeExtension on ImagemPerfilModel {
  double get size {
    switch (this) {
      case ImagemPerfilModel.small:
        return 40.0;
      case ImagemPerfilModel.medium:
        return 60.0;
      case ImagemPerfilModel.large:
        return 80.0;
    }
  }
}

class ImagemPerfilViewModel {
  XFile? image;
  final double radius;
  final bool allowEdit;
  final Widget? addImageIcon;
  final Widget? removeImageIcon;
  final Function(XFile?) onImageChanged;
  final Function onImageRemoved;
  final Future<ImageSource> Function() getImageSource;
  final Future<CameraDevices> Function() getPreferredCameraDevice;

  ImagemPerfilViewModel({
    this.image,
    required ImagemPerfilModel model,
    required this.allowEdit,
    required this.addImageIcon,
    required this.removeImageIcon,
    required this.onImageChanged,
    required this.onImageRemoved,
    required this.getImageSource,
    required this.getPreferredCameraDevice,
  }) : radius = model.size;

  void updateImage(XFile? newImage) {
    image = newImage;
    onImageChanged(newImage);
  }

  void removeImage() {
    image = null;
    onImageRemoved();
  }
}
