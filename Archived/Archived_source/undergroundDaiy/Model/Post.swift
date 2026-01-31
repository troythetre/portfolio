//
//  Post.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/24.
//

import FirebaseFirestoreSwift
import Firebase

struct Post: Identifiable, Decodable {
    @DocumentID var id: String?
    let caption: String
    let timestamp: Timestamp
    let uid: String
    let threadImageUrl: String?
    let threadVideoUrl: String?
    let tag: String?
    var likes: Int
    var comments: Int
    var archives: Int
    var shares: Int
    
    
    var user: AppUser?
    var didLike: Bool? = false
    var didDislike: Bool? = false
    var didComment: Bool? = false
    var didArchive: Bool? = false
    var didShare: Bool? = false
    
}
