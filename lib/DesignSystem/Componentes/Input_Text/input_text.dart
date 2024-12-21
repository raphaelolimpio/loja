import 'package:flutter/material.dart';
import 'package:loja/DesignSystem/Componentes/Input_Text/input_text_view_model.dart';
import 'package:loja/DesignSystem/shared/Styles.dart';
import 'package:loja/DesignSystem/shared/colors.dart';

class InputText extends StatefulWidget {
  final InputTextViewModel viewModel;

  const InputText({super.key, required this.viewModel});

  @override
  InputTextState createState() => InputTextState();

  static Widget instatiate({required InputTextViewModel viewModel}) {
    return InputText(viewModel: viewModel);
  }
}

class InputTextState extends State<InputText> {
  late bool obscureText;
  String? errorMsg;

  @override
  void initState() {
    super.initState();
    obscureText = widget.viewModel.password;
    widget.viewModel.controller.addListener(validateInput);
  }

  void validateInput() {
    final errorText =
        widget.viewModel.validator?.call(widget.viewModel.controller.text);
    setState(() {
      errorMsg = errorText;
    });
  }

  void togglePasswordVisibility() {
    setState(() {
      obscureText = !obscureText;
    });
  }

  @override
  void dispose() {
    widget.viewModel.controller.removeListener(validateInput);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    double horizontalPadding = 20.0;
    double verticalPadding = 15.0;
    BorderRadius borderRadius = BorderRadius.circular(4);
    BorderSide borderSide = BorderSide(color: fontColorBlack);
    TextStyle textStyle = buttonWhiteStyle1;

    switch (widget.viewModel.size) {
      case InputTextSize.small:
        horizontalPadding = 12.0;
        verticalPadding = 6;
        borderSide = BorderSide(color: fontColorBlack, width: 1.0);
        borderRadius = BorderRadius.circular(8);
        break;
      case InputTextSize.medium:
        horizontalPadding = 16.0;
        verticalPadding = 10;
        borderSide = BorderSide(color: fontColorBlack, width: 1.5);
        borderRadius = BorderRadius.circular(6);
        break;
      case InputTextSize.large:
        horizontalPadding = 20.0;
        verticalPadding = 12;
        borderSide = BorderSide(color: fontColorBlack, width: 2.0);
        borderRadius = BorderRadius.circular(4);
        break;
    }

    InputDecoration decoration = InputDecoration(
      contentPadding: EdgeInsets.symmetric(
          horizontal: horizontalPadding, vertical: verticalPadding),
      enabledBorder: OutlineInputBorder(
        borderRadius: borderRadius,
        borderSide: borderSide,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: borderRadius,
        borderSide: BorderSide(color: Colors.blue, width: borderSide.width),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(4),
        borderSide: const BorderSide(color: fontColorBlack),
      ),
      disabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(4),
        borderSide: const BorderSide(color: lightGrayColor),
      ),
      errorText: errorMsg,
    );
    return TextField(
      controller: widget.viewModel.controller,
      obscureText: obscureText,
      style: textStyle,
      decoration: decoration,
      enabled: widget.viewModel.isEnabled,
    );
  }
}
