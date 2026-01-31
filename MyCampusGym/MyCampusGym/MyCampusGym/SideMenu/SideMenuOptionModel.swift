//
//  SideMenuOptionModel.swift
//  MyCampusGym
//
//  Created by Troy Wu on 2024/10/28.
//

import Foundation

enum SideMenuOptionModel: Int, CaseIterable {
//    case journal
    case plan
    case rewind
    case health
    
    var title: String {
        switch self {
//        case .journal:
//            return "MyJournal"
        case .plan:
            return "MyPlan"
        case .rewind:
            return "MyRewind"
        case .health:
            return "MyHealth"
        }
    }
    
    var systemImageName: String {
        switch self {
//        case .journal:
//            return "filemenu.and.cursorarrow"
        case .plan:
            return "figure.strengthtraining.traditional"
        case .rewind:
            return "chart.bar"
        case .health:
            return "heart.fill"
        
        }
    }
}

extension SideMenuOptionModel: Identifiable {
    var id: Int { return self.rawValue }
}
