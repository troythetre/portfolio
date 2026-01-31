//
//  CommunityFilterViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/26.
//

import Foundation

enum ThreadFilterViewModel: Int, CaseIterable {
    case hot
    case following
    case exploreCommunities
    
    
    
    var title: String {
        switch self {
            case .hot: return "Hot"
            case .following: return "My Feed"
            case .exploreCommunities: return "Explore"
        }
    }
}
