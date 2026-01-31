//
//  Video.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/25.
//

import FirebaseFirestoreSwift
import Firebase

struct Video: Identifiable, Decodable {
    @DocumentID var id: String?
    let videoUrl: String
    let caption: String?
    let timestamp: Timestamp
    let uid: String
    var upvote: Int
    var comment: Int
    var archive: Int
    var share: Int
//    var id: String {
//        return NSUUID().uuidString
//    }

    var user: AppUser?
    var didUpvote: Bool? = false
    var didComment: Bool? = false
    var didArchive: Bool? = false
    var didShare: Bool? = false
}
