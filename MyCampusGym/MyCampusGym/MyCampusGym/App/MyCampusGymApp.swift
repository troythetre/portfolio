//
//  MyCampusGymApp.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 9/30/24.
//

import SwiftUI
import FirebaseCore
import FirebaseFirestore
import FirebaseAuth
//import GooglePlaces

class AppDelegate: NSObject, UIApplicationDelegate {
  func application(_ application: UIApplication,
                   didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
      FirebaseApp.configure()
      //FirebaseConfiguration.shared.setLoggerLevel(.debug)
      //GMSPlacesClient.provideAPIKey("AIzaSyDyoaDRrzn1eowF6SQAmPic5MVMPt9Xbzo")
      return true
  }
}

@main
struct MyCampusGymApp: App {
    @StateObject var viewModel = AuthViewModel()
    
    // register app delegate for Firebase setup
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    
    func listen() {
        viewModel.listenAuthenticationState()
    }
    
    var body: some Scene {
        WindowGroup {
            ZStack {
                Group {
                    if viewModel.currentSessionUser != nil {
                        ContentView().environmentObject(viewModel)
                    } else {
                        LogInView().environmentObject(viewModel)
                    }
                }
            }.onAppear(perform: listen)
        }
    }
}
