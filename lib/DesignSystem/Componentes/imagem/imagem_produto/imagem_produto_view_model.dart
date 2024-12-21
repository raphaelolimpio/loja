import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

enum ImagemProdutoFormato {
  circular,
  retangular,
}

enum ImagemProdutoModel {
  small,
  medium,
  large,
}

extension ImagemProdutoSizeExtension on ImagemProdutoModel {
  double get size {
    switch (this) {
      case ImagemProdutoModel.small:
        return 40.0;
      case ImagemProdutoModel.medium:
        return 60.0;
      case ImagemProdutoModel.large:
        return 80.0;
    }
  }
}

class ImagemProdutoViewModel {
  XFile? image;
  final double width;
  final double height;
  final ImagemProdutoFormato formato;
  final bool allowEdit;
  final Widget? addImageIcon;
  final Widget? removeImageIcon;
  final Function(XFile?) onImageChanged;
  final Function onImageRemoved;
  final Future<ImageSource> Function() getImageSource;

  ImagemProdutoViewModel({
    this.image,
    required this.width,
    required this.height,
    required this.formato,
    required this.allowEdit,
    this.addImageIcon,
    this.removeImageIcon,
    required this.onImageChanged,
    required this.onImageRemoved,
    required this.getImageSource,
  });

  void updateImage(XFile? newImage) {
    image = newImage;
    onImageChanged(newImage);
  }

  void removeImage() {
    image = null;
    onImageRemoved();
  }
}
