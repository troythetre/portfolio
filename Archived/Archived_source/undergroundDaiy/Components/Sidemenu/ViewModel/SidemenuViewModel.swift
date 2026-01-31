//
//  SidemenuViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/17.
//

import Foundation

enum SidemenuViewModel: Int, CaseIterable {
    //navigation system
    case profile
    case shop
    case radio
    case uploadVideo
    case archive
    case notification
    case settings
    case logout
    
    
    var title: String {
        switch self {
        case.profile: return "Profile"
        case.shop: return "Shop"
        case.radio: return "Radio"
        case.uploadVideo: return "Upload Video"
        case.archive: return "Archived Videos"
        case.notification: return "Notification"
        case.settings: return "Settings"
        case.logout: return "Logout"
        
        }
    }
    
    var imageName: String {
        switch self {
        case.profile: return "person.fill"
        case.shop: return "storefront.fill"
        case.radio: return "radio.fill"
        case.uploadVideo: return "play.square.fill"
        case.archive: return "archivebox.fill"
        case.notification: return "bell.fill"
        case.settings: return "gear"
        case.logout: return "arrow.left.square"
        }
    }
}
