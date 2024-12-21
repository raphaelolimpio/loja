import 'package:flutter/material.dart';

enum InputTextSize {
  small,
  medium,
  large,
}

class InputTextViewModel {
  final InputTextSize size;
  final TextEditingController controller;
  final String placeholder;
  bool password;
  final Widget? suffixIcon;
  final bool isEnabled;
  final String? Function(String?)? validator;
  final VoidCallback? togglePasswordVisibility;

  InputTextViewModel({
    required this.size,
    required this.controller,
    required this.placeholder,
    required this.password,
    this.suffixIcon,
    this.isEnabled = true,
    this.validator,
    this.togglePasswordVisibility,
  });
}
