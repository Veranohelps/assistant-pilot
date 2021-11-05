#import "DersuPermissionsPlugin.h"
#if __has_include(<dersu_permissions/dersu_permissions-Swift.h>)
#import <dersu_permissions/dersu_permissions-Swift.h>
#else
// Support project import fallback if the generated compatibility header
// is not copied when this plugin is created as a library.
// https://forums.swift.org/t/swift-static-libraries-dont-copy-generated-objective-c-header/19816
#import "dersu_permissions-Swift.h"
#endif

@implementation DersuPermissionsPlugin
+ (void)registerWithRegistrar:(NSObject<FlutterPluginRegistrar>*)registrar {
  [SwiftDersuPermissionsPlugin registerWithRegistrar:registrar];
}
@end
