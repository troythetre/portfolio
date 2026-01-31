//
//  Article.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/25.
//

import FirebaseFirestoreSwift
import Firebase

struct Article: Identifiable, Decodable {
    @DocumentID var id: String?
    let title: String
    let description: String
    let timestamp: Timestamp
    let articleImage: String
    let content: String
    var likes: Int
    var comment: Int
    var archive: Int
    
    var user: AppUser?
    var didLike: Bool? = false
    var didComment: Bool? = false //not yet implemented
    var didArchive: Bool? = false //not yet implemented
    
}
