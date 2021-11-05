//
//  LocationManager.swift
//  dersu_permissions
//


import Foundation
import CoreLocation
class LocationManager: NSObject, CLLocationManagerDelegate {

    static let shared = LocationManager()
    private var locationManager: CLLocationManager = CLLocationManager()
    private var requestLocationAuthorizationCallback: ((CLAuthorizationStatus) -> Void)?

    public func requestLocationAuthorization(completion: @escaping (String)->()){
        if(!CLLocationManager.locationServicesEnabled()) {
            completion("denied")
            return
        }
               
        let currentStatus = getAuthorizationStatus()
        
        if(currentStatus == .notDetermined){
            self.locationManager.delegate = self
            locationManager.requestWhenInUseAuthorization()
        }else if(currentStatus == .authorizedWhenInUse){
            self.locationManager.delegate = self
            locationManager.requestAlwaysAuthorization()
        }else {
            let statusStr = self.convertLocationStatus(status: currentStatus)
            completion(statusStr)
        }
        
        requestLocationAuthorizationCallback = { status in
            if(status == .authorizedWhenInUse){
                self.locationManager.delegate = self
                self.locationManager.requestAlwaysAuthorization()
            }else {
                completion(self.convertLocationStatus(status: status))
            }
        }
        
    }
    
    public func getLocationStatus(completion: @escaping (String)->()){
        if(!CLLocationManager.locationServicesEnabled()) {
            completion("denied")
            return
        }
        let currentStatus = getAuthorizationStatus()
        
        let statusStr = convertLocationStatus(status: currentStatus)
        completion(statusStr)
    }
    
    public func openSettings(){
        guard let settingsUrl = URL(string: UIApplication.openSettingsURLString) else {
            return
        }

        if UIApplication.shared.canOpenURL(settingsUrl) {
            UIApplication.shared.open(settingsUrl, completionHandler: nil)
        }
    }
    
    // MARK: - CLLocationManagerDelegate
    public func locationManager(_ manager: CLLocationManager,
                                didChangeAuthorization status: CLAuthorizationStatus) {
        self.requestLocationAuthorizationCallback?(status)
    }
    
    private func getAuthorizationStatus () -> CLAuthorizationStatus {
        let authorizationStatus: CLAuthorizationStatus = {
            let locationManager = CLLocationManager()
            if #available(iOS 14.0, tvOS 14.0, *) {
                return locationManager.authorizationStatus
            } else {
                return CLLocationManager.authorizationStatus()
            }
        }()
        
        return authorizationStatus
    }
    
    private func convertLocationStatus(status : CLAuthorizationStatus) -> String {
        switch status {
        case .notDetermined:
            return "not_determined"
        case .restricted:
            return "restricted"
        case .denied:
            return "denied"
        case .authorizedAlways:
            return "always"
        case .authorizedWhenInUse:
            return "authorized_when_in_use"
         default:
            return "error"
        }
    }
}
