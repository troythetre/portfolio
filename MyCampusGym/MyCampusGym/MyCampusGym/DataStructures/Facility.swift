//
//  Facility.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/16/24.
//

import SwiftUI
import Foundation

struct Facility: Identifiable {
    var id:String
    var name:String
    var campusId:String
    var campusName:String
    var placeId:String
    var postalCode:String
    
    init(id:String = "", name:String = "", campusId:String="", campusName:String="", placeId:String = "", postalCode:String="") {
        self.id = id
        self.name = name
        self.campusId = campusId
        self.campusName = campusName
        self.placeId = placeId
        self.postalCode = postalCode
    }
}

