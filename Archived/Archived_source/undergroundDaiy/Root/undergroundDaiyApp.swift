//
//  undergroundDaiyApp.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/12.
//

import SwiftUI
import Firebase
import FirebaseCore

@main
struct undergroundDaiyApp: App {
    
    @StateObject var viewModel = AuthViewModel()
    
    init () {
        FirebaseApp.configure()
        
        for family in UIFont.familyNames.sorted() {
            let names = UIFont.fontNames(forFamilyName: family)
            //print("Family: \(family) Font names: \(names)")
        }
    }
    
    var body: some Scene {
        WindowGroup {
            NavigationView {
                ContentView()
            }
            .environmentObject(viewModel)
        }
    }
}
