//
//  Campus.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/21/24.
//
import Foundation
struct Campus:Identifiable {
    
    var name:String
    var id:String
    var domains:[String]
    
    init (name:String = "", id:String = "", domains:[String] = [String]()) {
        self.name = name
        self.id = id
        self.domains = domains
    }
    
}
