import 'package:app/logic/models/time_with_timezone.dart';

class BpaReport {
  final String url;
  final BpaProvider provider;
  final List<BpaZone> zones;
  final TimeWithTimeZone publishDateTime;
  final TimeWithTimeZone validUntilDateTime;

  BpaReport(
      {required this.url,
      required this.zones,
      required this.provider,
      required this.publishDateTime,
      required this.validUntilDateTime});
}

class BpaProvider {
  final String name;
  final String logoUrl;
  final String url;

  BpaProvider({required this.name, required this.logoUrl, required this.url});
}

class BpaZone {
  final String name;

  BpaZone({required this.name});
}
