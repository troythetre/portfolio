//
//  User.swift
//  MyCampusGym
//
//  Created by Troy Wu on 2024/10/23.
//

import Foundation

struct User: Identifiable, Codable {
    var id: String
    var displayName: String
    var email: String
    
    var initials: String {
        let formatter = PersonNameComponentsFormatter()
        if let component = formatter.personNameComponents(from: displayName) {
            formatter.style = .abbreviated
            return formatter.string(from: component)
        }
        
        return ""
    }
    
    init(id:String = "", displayName:String = "", email:String = "") {
        self.id = id
        self.displayName = displayName
        self.email = email
    }
}

extension User {
    static var MOCK_USER = User(id: NSUUID().uuidString, displayName: "Student", email: "name@domain.edu")
}
