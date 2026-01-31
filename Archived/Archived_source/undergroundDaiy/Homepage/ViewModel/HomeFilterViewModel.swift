//
//  ArchiveViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/26.
//

import Foundation

enum HomeFilterViewModel: Int, CaseIterable {
    case home
    case social
    
    var title: String {
        switch self {
            case .home: return "Archive"
            case .social: return "Friends"
        }
    }
}
