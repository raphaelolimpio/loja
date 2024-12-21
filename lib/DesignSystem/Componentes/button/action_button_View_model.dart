import 'package:flutter/material.dart';

enum ActionButtonSize {
  small,
  medium,
  large,
}

enum ActionButtonTextSytle {
  white1,
  white2,
  white3,
  blak1,
  blak2,
  blak3,
}

enum ActionButtonStyle {
  green,
  red,
  cyan,
  grey,
}

class ActionButtonViewModel {
  final ActionButtonSize size;
  final ActionButtonStyle style;
  final ActionButtonTextSytle textSytle;
  final String text;
  final IconData? icon;
  final Function() onPressed;

  ActionButtonViewModel(
      {required this.size,
      required this.style,
      required this.textSytle,
      required this.text,
      this.icon,
      required this.onPressed});
}
