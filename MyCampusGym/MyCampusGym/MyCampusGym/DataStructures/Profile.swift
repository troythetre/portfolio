//
//  Profile.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/11/24.
//

import SwiftUI
import Foundation
import Firebase
import FirebaseAuth
import Combine

struct Profile: Identifiable, Codable {
    var id: String
    var birthday: Date?
    var firstName: String
    var lastName: String
    var campusName: String
    var campusId: String
    var uid: String
    var email: String
    var fullName:String {
        return self.firstName + "" + " " + self.lastName
    }
    var isAdmin:Bool
    var photoUrl:String
    
    init(id:String = "", birthday:Date? = nil, firstName:String = "", lastName:String = "", campusName:String = "", campusId:String = "", uid:String = "", email:String = "", isAdmin:Bool = false, photoUrl:String = "") {
        self.id = id
        self.birthday = birthday
        self.campusName = campusName
        self.campusId = campusId
        self.uid = uid
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.isAdmin = isAdmin
        self.photoUrl = photoUrl
    }
    
}
