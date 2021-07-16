import 'package:app/config/brand_text_styles.dart';
import 'package:flutter/material.dart';

extension TextExtension on Text {
  Text get h1 => copyWith(style: BrandTextStyles.h1);
  Text get h2 => copyWith(style: BrandTextStyles.h2);
  Text get h3 => copyWith(style: BrandTextStyles.h3);
  Text get h4 => copyWith(style: BrandTextStyles.h4);
  Text get h6 => copyWith(style: BrandTextStyles.h6);
  Text get bodyExtraSmall => copyWith(style: BrandTextStyles.bodyExtraSmall);
  Text get bodySmall => copyWith(style: BrandTextStyles.bodySmall);
  Text get temp => copyWith(style: BrandTextStyles.temp);


  Text withColor(Color? color) => Text(
        data!,
        key: this.key,
        strutStyle: this.strutStyle,
        textAlign: this.textAlign,
        textDirection: this.textDirection,
        locale: this.locale,
        softWrap: this.softWrap,
        overflow: this.overflow,
        textScaleFactor: this.textScaleFactor,
        maxLines: this.maxLines,
        semanticsLabel: this.semanticsLabel,
        textWidthBasis: textWidthBasis ?? this.textWidthBasis,
        style: this.style != null
            ? this.style!.copyWith(color: color)
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
