//
//  FeedPostService.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/24/24.
//

import Foundation
import SwiftUI
import FirebaseFirestore

class FeedPostService {
    
    let db = Firestore.firestore()
    
    let fs = FirestoreService()
    
    func getFeedPosts(campusId:String, completion: @escaping ([FeedPost]) -> Void) {
        
        print("fps gfp campusId: " + campusId)
        
        db.collection("feedPosts")
            .whereField("campusId", isEqualTo: campusId)
            .whereField("parentFeedPostId", isEqualTo: "")
            .order(by: "postDate", descending: true)
            .order(by: "postTime", descending: true)
            .getDocuments(source: .server) { (snapshot, error) in
                if let error = error {
                    print("Error getting documents fps22: \(error)")
                    return
                }
                
                guard let documents = snapshot?.documents else {
                    print("No documents found fps27")
                    return
                }
                
                print("Documents retrieved fps34. Document count: \(snapshot!.documents.count)")
                
                let feedPosts: [FeedPost] = documents.compactMap { (feedPost) -> FeedPost? in
                    let data = feedPost.data()
                    
                    return FeedPost(
                        authorProfileId: data["authorProfileId"] as! String,
                        campusId: data["campusId"] as! String,
                        campusName: data["campusName"] as! String,
                        content: data["content"] as! String,
                        headline: data["headline"] as! String,
                        id: feedPost.documentID,
                        postDate: self.fs.stringToDate(date: data["postDate"] as? String ?? ""),
                        postTime: data["postTime"] as! String,
                        likesCount: data["likesCount"] as? Int ?? 0,
                        parentFeedPostId: data["parentFeedPostId"] as? String ?? ""
                    )
                }
                completion(feedPosts)
            }
    }
    
    func createPost(newPost:FeedPost, profile:Profile, parentFeedPostId:String = "") {
        
        print("Test Date() print")
        print(Date().formatted(date: .omitted, time: .standard))
        
        let data = [
            "authorProfileId": profile.id,
            "campusId": profile.campusId,
            "campusName": profile.campusName,
            "content": newPost.content,
            "headline": newPost.headline,
            "postDate": fs.dateToString(date: Date()),
            "postTime": fs.standardTimeToString(
                time: Date().formatted(date: .omitted, time: .standard)
                ),
            "likesCount": 0,
            "parentFeedPostId": parentFeedPostId
        ] as [String:Any]
        
        db.collection("feedPosts").addDocument(data: data) { error in
            if let error = error {
                print("Error adding document fps72: \(error)")
            } else {
                print("Document added with auto-generated ID (fps74)!")
            }
        }
    }
    
    func getFeedPostComments(parentFeedPostId: String, completion: @escaping ([FeedPost]) -> Void) {
        db.collection("feedPosts")
            .whereField("parentFeedPostId", isEqualTo: parentFeedPostId)
            .order(by: "postDate")
            .order(by: "postTime")
            .getDocuments(source: .server) { (snapshot, error) in
                if let error = error {
                    print("Error getting documents fps88: \(error)")
                    return
                }
                
                guard let documents = snapshot?.documents else {
                    print("No documents found fps93")
                    return
                }
                
                print("Documents retrieved fps97. Document count: \(snapshot!.documents.count)")
                
                let feedPosts: [FeedPost] = documents.compactMap { (feedPost) -> FeedPost? in
                    let data = feedPost.data()
                    
                    return FeedPost(
                        authorProfileId: data["authorProfileId"] as! String,
                        campusId: data["campusId"] as! String,
                        campusName: data["campusName"] as! String,
                        content: data["content"] as! String,
                        headline: data["headline"] as! String,
                        id: feedPost.documentID,
                        postDate: self.fs.stringToDate(date: data["postDate"] as? String ?? ""),
                        postTime: data["postTime"] as! String,
                        likesCount: data["likesCount"] as? Int ?? 0,
                        parentFeedPostId: data["parentFeedPostId"] as? String ?? ""
                        
                    )
                }
                completion(feedPosts)
            }
    }

}
