class Device {
  double screenWidth;
  double screenHeight;
  bool? isPhysicalDevice;
  String manufacturer;
  String operatingSystem;
  String timeZone;
  String model;
  String osVersion;

  Device({
    required this.screenWidth,
    required this.screenHeight,
    required this.isPhysicalDevice,
    required this.manufacturer,
    required this.operatingSystem,
    required this.timeZone,
    required this.model,
    required this.osVersion,
  });
}
