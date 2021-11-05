import Flutter
import UIKit

public class SwiftDersuPermissionsPlugin: NSObject, FlutterPlugin {
  public static func register(with registrar: FlutterPluginRegistrar) {
    let channel = FlutterMethodChannel(name: "dersu_permissions", binaryMessenger: registrar.messenger())
    let instance = SwiftDersuPermissionsPlugin()
    registrar.addMethodCallDelegate(instance, channel: channel)
  }

  public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
      switch call.method {
      case "request_permission":
          LocationManager.shared.requestLocationAuthorization(completion: { status in
              result(status)
          })
          break
      case "open_settings":
          LocationManager.shared.openSettings()
          result("settings")
          break
      case "get_location_status":
          LocationManager.shared.getLocationStatus(completion: { status in
              result(status)
          })
          break
      default:
          result(FlutterMethodNotImplemented)
      }
  }
}
