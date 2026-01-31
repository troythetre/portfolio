//
//  VideoService.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/5.
//

import Firebase
import FirebaseStorage

struct VideoService {
    
    func fetchVideos(completion: @escaping([Video]) -> Void) {
        Firestore.firestore().collection("videos")
            .order(by: "timestamp", descending: true)
            .getDocuments { snapshot, _ in
                guard let documents = snapshot?.documents else { return }
                let videos = documents.compactMap({ try? $0.data(as: Video.self)})
                completion(videos)
            }
    }
    //fetch all posts in firestore /communityPosts/
    
    func fetchVideos(forUid uid: String, completion: @escaping([Video]) -> Void) {
        Firestore.firestore().collection("videos")
            .whereField("uid", isEqualTo: uid)
            .getDocuments { snapshot, _ in
                guard let documents = snapshot?.documents else { return }
                let videos = documents.compactMap({ try? $0.data(as: Video.self)})
                completion(videos.sorted(by: { $0.timestamp.dateValue() > $1.timestamp.dateValue() }))
            }
    }
    //fetch all posts in firestore /communityPosts/uid
    
    func likedVideo(_ video: Video, completion: @escaping() -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return } //if current user is authenticated
        guard let videoID = video.id else { return } //get post id
        let userLikesRef = Firestore.firestore().collection("users").document(uid).collection("upvoted-video")
        //go to/build user upvote collection
        
        Firestore.firestore().collection("videos").document(videoID)
            .updateData(["upvote": video.upvote + 1]) { _ in //adds like count for post
                userLikesRef.document(videoID).setData([:]) { _ in
                    //writes document ID into user likes
                    completion()
                }
            }
    }
    
    func unlikeVideo(_ video: Video, completion: @escaping() -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        guard let videoID = video.id else { return }
        guard video.upvote > 0 else { return } //can only unlike post if post has at least one like
        
        let userLikesRef = Firestore.firestore().collection("users").document(uid).collection("upvoted-video")
        //access user upvote collection
        
        Firestore.firestore().collection("videos").document(videoID)
            .updateData(["upvote": video.upvote - 1]) { _ in
                userLikesRef.document(videoID).delete { _ in
                    completion() //deleted thread ID from user upvote collection
                }
            }
    }
    
    func archiveVideo(_ video: Video, completion: @escaping() -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return } //if current user is authenticated
        guard let videoID = video.id else { return } //get post id
        let userLikesRef = Firestore.firestore().collection("users").document(uid).collection("archived-video")
        //go to/build user upvote collection
        
        Firestore.firestore().collection("videos").document(videoID)
            .updateData(["archive": video.archive + 1]) { _ in //adds like count for post
                userLikesRef.document(videoID).setData([:]) { _ in
                    //writes document ID into user likes
                    completion()
                }
            }
    }
    
    func unarchiveVideo(_ video: Video, completion: @escaping() -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        guard let videoID = video.id else { return }
        guard video.archive > 0 else { return } //can only unlike post if post has at least one like
        
        let userLikesRef = Firestore.firestore().collection("users").document(uid).collection("archived-video")
        //access user upvote collection
        
        Firestore.firestore().collection("videos").document(videoID)
            .updateData(["archive": video.archive - 1]) { _ in
                userLikesRef.document(videoID).delete { _ in
                    completion() //deleted thread ID from user upvote collection
                }
            }
    }
    
    func checkIfUserUpvotedVideo(_ video: Video, completion: @escaping(Bool) -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        guard let videoID = video.id else { return }
        
        Firestore.firestore().collection("users")
            .document(uid)
            .collection("upvoted-video")
            .document(videoID).getDocument { snapshot, _ in
                guard let snapshot = snapshot else { return }
                completion(snapshot.exists)
                //if postID exists, run function; don't run if no postID exists
            }
    }
    
    func checkIfUserArchivedVideo(_ video: Video, completion: @escaping(Bool) -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        guard let videoID = video.id else { return }
        
        Firestore.firestore().collection("users")
            .document(uid)
            .collection("archived-video")
            .document(videoID).getDocument { snapshot, _ in
                guard let snapshot = snapshot else { return }
                completion(snapshot.exists)
                //if postID exists, run function; don't run if no postID exists
            }
    }
    
    func fetchArchivedVideos(forUid uid: String, completion: @escaping([Video]) -> Void) {
        var videos = [Video]() //access post model
        Firestore.firestore().collection("users")
            .document(uid)
            .collection("archived-video") //go to user upvote collection
            .getDocuments { snapshot, _ in
                guard let documents = snapshot?.documents else { return }
                
                documents.forEach { doc in
                    let videoID = doc.documentID //postID = every thread that users upvotes
                    
                    Firestore.firestore().collection("videos")
                        .document(videoID)
                        .getDocument { snapshot, _ in
                            guard let video = try? snapshot?.data(as: Video.self) else { return }
                            videos.append(video)
                            //fetch every post the user upvotes in community
                            completion(videos)
                        }
                }
            }
    }
}
