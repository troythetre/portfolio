//
//  Message.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2025/4/18.
//

import FirebaseFirestoreSwift
import Foundation

struct Message: Identifiable, Codable {
    @DocumentID var id: String?
    let text: String
    let senderId: String
    let receiverId: String
    let timestamp: Date
    var likedBy: [String] = []
}
