//
//  SingleCommunityModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/5.
//

import FirebaseFirestoreSwift
import Firebase

struct Community: Identifiable {
//    @DocumentID var id: String?
    var id: String = UUID().uuidString
    let communityName: String
    let communityDescription: String
    let communityProfileUrl: String
    let communityUsername: String
    var user: AppUser?
}
