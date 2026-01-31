//
//  ArchiveViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/26.
//

import Foundation

enum JournalismFilterViewModel: Int, CaseIterable {
    case feed
    case archived
    
    var title: String {
        switch self {
            case .feed: return "My feed"
            case .archived: return "Archived"
        }
    }
}
