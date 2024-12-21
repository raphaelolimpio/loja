import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:loja/DesignSystem/Componentes/imagem/imagem_produto/imagem_produto_view_model.dart';

class ImagemProduto extends StatelessWidget {
  final ImagemProdutoViewModel viewModel;

  const ImagemProduto({super.key, required this.viewModel});

  Widget _buildImage() {
    return Container(
      width: viewModel.width,
      height: viewModel.height,
      decoration: BoxDecoration(
        shape: viewModel.formato == ImagemProdutoFormato.circular
            ? BoxShape.circle
            : BoxShape.rectangle,
        image: viewModel.image != null
            ? DecorationImage(
                image: FileImage(File(viewModel.image!.path)),
                fit: BoxFit.cover,
              )
            : null,
      ),
      child: viewModel.image == null
          ? Icon(Icons.photo, size: viewModel.width * 0.5)
          : null,
    );
  }

  Widget _buildAddImageButton() {
    return Positioned(
      bottom: 0,
      right: 0,
      child: GestureDetector(
        onTap: () async {
          final source = await viewModel.getImageSource();
          if (source != null) {
            final pickedImage = await ImagePicker().pickImage(source: source);
            if (pickedImage != null) {
              viewModel.updateImage(pickedImage);
            }
          }
        },
        child: viewModel.addImageIcon ?? Icon(Icons.add_a_photo),
      ),
    );
  }

  Widget _buildRemoveImageButton() {
    return Positioned(
      top: 0,
      right: 0,
      child: GestureDetector(
        onTap: () {
          viewModel.removeImage();
        },
        child: viewModel.removeImageIcon ?? Icon(Icons.delete),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        _buildImage(),
        if (viewModel.allowEdit) ...[
          _buildAddImageButton(),
          if (viewModel.image != null) _buildRemoveImageButton(),
        ],
      ],
    );
  }
}
