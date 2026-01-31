//
//  User.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/23.
//

import FirebaseFirestoreSwift
import Firebase

struct AppUser: Identifiable, Decodable {
    @DocumentID var id: String?
    let username: String
    let fullname: String
    let profileImageUrl: String
    let tag: String
    let email: String
    
    var isCurrentUser: Bool { return Auth.auth().currentUser?.uid == id}
}
