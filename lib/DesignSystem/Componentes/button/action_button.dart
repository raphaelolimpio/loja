import 'package:flutter/material.dart';
import 'package:loja/DesignSystem/Componentes/button/Action_button_View_model.dart';
import 'package:loja/DesignSystem/shared/Styles.dart';
import 'package:loja/DesignSystem/shared/colors.dart';

class ActionButton extends StatelessWidget {
  final ActionButtonViewModel viewlModel;

  const ActionButton._({super.key, required this.viewlModel});

  static Widget instatiate(ActionButtonViewModel viewlModel) {
    return ActionButton._(viewlModel: viewlModel);
  }

  @override
  Widget build(BuildContext context) {
    double horizontalPadding = 32.0;
    double verticalPadding = 12;
    Color buttonColor = Colors.blue;
    double iconSize = 32.0;
    TextStyle buttonTextStyle = buttonWhiteStyle1;

    switch (viewlModel.size) {
      case ActionButtonSize.small:
        horizontalPadding = 16.0;
        verticalPadding = 8;
        iconSize = 16.0;
        break;
      case ActionButtonSize.medium:
        horizontalPadding = 24.0;
        verticalPadding = 12;
        break;
      case ActionButtonSize.large:
        horizontalPadding = 32.0;
        verticalPadding = 12;
        break;
    }

    switch (viewlModel.style) {
      case ActionButtonStyle.green:
        buttonColor = balckGreenColor;
        break;
      case ActionButtonStyle.red:
        buttonColor = darkReedColor;
        break;
      case ActionButtonStyle.cyan:
        buttonColor = darkCyanColor;
        break;
      case ActionButtonStyle.grey:
        buttonColor = fontColorBlack;
        break;
    }

    switch (viewlModel.textSytle) {
      case ActionButtonTextSytle.white1:
        buttonWhiteStyle1;
        break;
      case ActionButtonTextSytle.white2:
        buttonWhiteStyle12;
        break;
      case ActionButtonTextSytle.white3:
        buttonWhiteStyle13;
        break;
      case ActionButtonTextSytle.blak1:
        buttonBlakStyle1;
        break;
      case ActionButtonTextSytle.blak2:
        buttonBlakStyle12;
        break;
      case ActionButtonTextSytle.blak3:
        buttonBlaktyle13;
        break;
    }

    return ElevatedButton(
      onPressed: viewlModel.onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: buttonColor,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24.0),
        ),
        textStyle: buttonTextStyle,
        padding: EdgeInsets.symmetric(
          vertical: verticalPadding,
          horizontal: horizontalPadding,
        ),
      ),
      child: viewlModel.icon != null
          ? Row(
              children: [
                Icon(
                  viewlModel.icon,
                  size: iconSize,
                ),
                Text(
                  viewlModel.text,
                  style: TextStyle(color: Colors.white),
                ),
              ],
            )
          : Text(
              viewlModel.text,
              style: TextStyle(color: Colors.white),
            ),
    );
  }
}
