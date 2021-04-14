class Expedition {
  final String name;
  final double latitude;
  final double longitude;

  Expedition(
      {required this.name, required this.latitude, required this.longitude});

  factory Expedition.fromJson(Map<String, dynamic> json) {
    return Expedition(
        name: json['name'],
        latitude: double.parse(json['location']['latitude']),
        longitude: double.parse(json['location']['longitude']));
  }

  @override
  String toString() {
    return "Expedition, name $name";
  }
}
