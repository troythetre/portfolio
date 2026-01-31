//
//  ShopHomeFilterViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/7/22.
//

import Foundation

enum ShopHomeFilterViewModel: Int, CaseIterable {
    
    case trending
    case outerwear
    case streetwear
    case artistMerch
    case articleBundle
    
    
    
    var title: String {
        switch self {
            case .trending: return "Trending"
            case .outerwear: return "Outerwear"
            case .streetwear: return "Streetwear"
            case .artistMerch: return "Merch"
            case .articleBundle: return "Bundle"
        }
    }
}
