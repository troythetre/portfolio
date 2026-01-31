//
//  FilterViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/17.
//

import Foundation

enum FilterViewModel: Int, CaseIterable {
    case archive
    case sold
    case saved
    case library
    
    
    
    
    var title: String {
        switch self {
            case.archive: return "Archive"
            case .sold: return "Sold"
            case .saved: return "Saved"
            case .library: return "Library"
            
            
        }
    }
}
