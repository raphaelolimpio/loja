import 'package:flutter/material.dart';
import 'package:loja/DesignSystem/Componentes/loading/CustomLoadingViewModel.dart';

class CustomLoading extends StatelessWidget {
  final Duration duration;
  final Color color;
  final String message;

  const CustomLoading({
    Key? key,
    this.duration = const Duration(seconds: 2),
    this.color = Colors.blue,
    this.message = 'Carregando...',
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      child: Center(
        child: CustomLoadingViewModel(
          duration: duration,
          color: color,
          message: message,
        ),
      ),
    );
  }
}
