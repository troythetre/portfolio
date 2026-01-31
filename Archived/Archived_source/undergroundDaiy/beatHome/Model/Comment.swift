//
//  Comment.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2025/3/24.
//
import Foundation
import FirebaseFirestore

struct Comment: Identifiable, Codable {
    @DocumentID var id: String?
    var beatID: String  // Associates comments with a beat
    var userID: String
    var username: String
    var userProfilePicture: String
    var text: String
    var timestamp: Date
}
