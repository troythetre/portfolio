//
//  ArtistOpen.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2025/3/10.
//

import SwiftUI
import SDWebImageSwiftUI
import FirebaseFirestore

struct ArtistOpen: Identifiable, Decodable {
    @DocumentID var id: String?
    var beatName: String
    var price: Double
    var fileURL: String
    var fileName: String
    var coverArtURL: String?
    var userID: String
    var username: String
    var userProfilePicture: String
    var beatStreams: Int
    var beatLikes: Int
    var beatComments: Int
    var beatArchives: Int
    var timestamp: Date
    
    var user: AppUser?
    var didLike: Bool? = false
    var didDislike: Bool? = false
    var didComment: Bool? = false
    var didArchive: Bool? = false
    var didShare: Bool? = false
}
