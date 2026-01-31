//
//  SettingsViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/7/22.
//

import SwiftUI

enum SettingsOptionViewModel: Int, CaseIterable, Identifiable {
    case dashboard
    case lightmode
    case activityStatus
    case accessibility
    case privacy
    case contactUs
    
    var title: String {
        switch self {
            
        case .dashboard:
            return "Dashboard"
        case .lightmode:
            return "Light Mode"
        case .activityStatus:
            return "Activity Status"
        case .accessibility:
            return "Accessibility"
        case .privacy:
            return "Privacy"
        case .contactUs:
            return "Contact Us"
        }
    }
    
    var imageName: String {
        switch self {
            
        case .dashboard:
            return "barometer"
        case .lightmode:
            return "lightbulb.fill"
        case .activityStatus:
            return "livephoto"
        case .accessibility:
            return "accessibility.fill"
        case .privacy:
            return "lock.square.fill"
        case .contactUs:
            return "phone.fill"
        }
    }
    
    var imageBackgroundColor: Color {
        switch self {
            
        case .dashboard:
            return .white
        case .lightmode:
            return .yellow
        case .activityStatus:
            return .purple
        case .accessibility:
            return .blue
        case .privacy:
            return .red
        case .contactUs:
            return .white
        }
    }
    
    var id: Int { return self.rawValue }
}
