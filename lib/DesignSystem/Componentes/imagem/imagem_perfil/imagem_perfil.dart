import 'package:flutter/material.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:loja/DesignSystem/Componentes/imagem/imagem_perfil/imagem_perfil_view_model.dart';
import 'package:loja/DesignSystem/shared/colors.dart';

class ImagemPerfil extends StatelessWidget {
  final ImagemPerfilViewModel viewModel;

  const ImagemPerfil({super.key, required this.viewModel});

  Widget _buildAvatar() {
    return CircleAvatar(
      radius: viewModel.radius,
      backgroundImage: viewModel.image != null
          ? FileImage(File(viewModel.image!.path))
          : null,
      child: viewModel.image == null
          ? Icon(Icons.person, size: viewModel.radius)
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
        child: viewModel.removeImageIcon ??
            Icon(Icons.delete, color: darkReedColor),
      ),
    );
  }

  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        _buildAvatar(),
        if (viewModel.allowEdit) ...[
          _buildAddImageButton(),
          if (viewModel.image != null) _buildAddImageButton(),
        ]
      ],
    );
  }
}
