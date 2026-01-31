//
//  FeedPost.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/24/24.
//

import Foundation

struct FeedPost:Identifiable {
    
    let fs = FirestoreService()
    
    var authorProfileId:String
    var campusId:String
    var campusName:String
    var content:String
    var headline:String
    var id:String
    var postDate:Date?
    var postTime:String
    var likesCount:Int
    var parentFeedPostId:String
    
    init(authorProfileId: String = "", campusId: String = "", campusName: String = "", content: String = "", headline: String = "", id: String = "", postDate:Date? = Date(), postTime: String = "", likesCount:Int = 0, parentFeedPostId:String = "") {
        self.authorProfileId = authorProfileId
        self.campusId = campusId
        self.campusName = campusName
        self.content = content
        self.headline = headline
        self.id = id
        self.postDate = postDate
        self.postTime = postTime
        self.likesCount = likesCount
        self.parentFeedPostId = parentFeedPostId
    }
    
}
