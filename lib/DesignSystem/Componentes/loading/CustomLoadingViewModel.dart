import 'package:flutter/material.dart';
import 'dart:async';

class CustomLoadingViewModel extends StatefulWidget {
  final Duration duration;
  final Color color;
  final String message;

  const CustomLoadingViewModel({
    Key? key,
    required this.duration,
    required this.color,
    required this.message,
  }) : super(key: key);

  @override
  _CustomLoadingViewModelState createState() => _CustomLoadingViewModelState();
}

class _CustomLoadingViewModelState extends State<CustomLoadingViewModel> {
  late Timer _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer(widget.duration, () {
      if (mounted) {
        Navigator.of(context).pop();
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.7),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(widget.color),
            strokeWidth: 6.0,
            backgroundColor: Colors.white.withOpacity(0.3),
          ),
          const SizedBox(height: 20),
          Text(
            widget.message,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
