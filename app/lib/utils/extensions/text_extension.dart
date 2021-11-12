import 'package:app/config/theme_typo.dart';
import 'package:flutter/material.dart';

extension TextExtension on Text {
  Text get h1 => copyWith(style: ThemeTypo.h1);
  Text get h2 => copyWith(style: ThemeTypo.h2);
  Text get h5 => copyWith(style: ThemeTypo.h5);

  Text get h6 => copyWith(style: ThemeTypo.h6);
  Text get overline => copyWith(style: ThemeTypo.overline);

  Text get subtitle1 => copyWith(style: ThemeTypo.subtitle1);

  Text get p0 => copyWith(style: ThemeTypo.p0);

  Text get temp => copyWith(style: ThemeTypo.temp);

  Text withColor(Color? color) => Text(
        data!,
        key: key,
        strutStyle: strutStyle,
        textAlign: textAlign,
        textDirection: textDirection,
        locale: locale,
        softWrap: softWrap,
        overflow: overflow,
        textScaleFactor: textScaleFactor,
        maxLines: maxLines,
        semanticsLabel: semanticsLabel,
        textWidthBasis: textWidthBasis ?? textWidthBasis,
        style: style != null
            ? style!.copyWith(color: color)
            : TextStyle(color: color),
      );

  Text copyWith(
      {Key? key,
      StrutStyle? strutStyle,
      TextAlign? textAlign,
      TextDirection? textDirection,
      Locale? locale,
      bool? softWrap,
      TextOverflow? overflow,
      double? textScaleFactor,
      int? maxLines,
      String? semanticsLabel,
      TextWidthBasis? textWidthBasis,
      TextStyle? style,
      String? data}) {
    return Text(data ?? this.data!,
        key: key ?? this.key,
        strutStyle: strutStyle ?? this.strutStyle,
        textAlign: textAlign ?? this.textAlign,
        textDirection: textDirection ?? this.textDirection,
        locale: locale ?? this.locale,
        softWrap: softWrap ?? this.softWrap,
        overflow: overflow ?? this.overflow,
        textScaleFactor: textScaleFactor ?? this.textScaleFactor,
        maxLines: maxLines ?? this.maxLines,
        semanticsLabel: semanticsLabel ?? this.semanticsLabel,
        textWidthBasis: textWidthBasis ?? this.textWidthBasis,
        style: style != null ? this.style?.merge(style) ?? style : this.style);
  }

  Text capitalize() => copyWith(
        data: "${data![0].toUpperCase()}${data!.substring(1)}",
      );
}
