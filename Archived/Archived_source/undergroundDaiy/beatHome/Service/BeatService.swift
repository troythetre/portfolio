//
//  BeatService.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2025/3/10.
//

import Firebase
import FirebaseStorage

struct BeatService {
    func fetchBeats(forUid uid: String, completion: @escaping([Beat]) -> Void) {
        Firestore.firestore().collection("beats")
            .whereField("userID", isEqualTo: uid)
            .getDocuments { snapshot, _ in
                guard let documents = snapshot?.documents else { return }
                let beats = documents.compactMap({ try? $0.data(as: Beat.self)})
                completion(beats.sorted(by: { $0.timestamp > $1.timestamp }))
            }
    }
    
    func likeBeat(_ beat: Beat, completion: @escaping() -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return } //if current user is authenticated
        guard let beatID = beat.id else { return } //get post id
        let userLikesRef = Firestore.firestore().collection("users").document(uid).collection("user-likes")
        //go to/build user upvote collection
        
        Firestore.firestore().collection("beats").document(beatID)
            .updateData(["beatLikes": beat.beatLikes + 1]) { _ in //adds like count for post
                userLikesRef.document(beatID).setData([:]) { _ in
                    //writes document ID into user likes
                    completion()
                }
            }
    }
    
    func unlikeBeat(_ beat: Beat, completion: @escaping() -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        guard let beatID = beat.id else { return }
        guard beat.beatLikes > 0 else { return } //can only unlike post if post has at least one like
        
        let userLikesRef = Firestore.firestore().collection("users").document(uid).collection("user-likes")
        //access user upvote collection
        
        Firestore.firestore().collection("beats").document(beatID)
            .updateData(["beatLikes": beat.beatLikes - 1]) { _ in
                userLikesRef.document(beatID).delete { _ in
                    completion() //deleted thread ID from user upvote collection
                }
            }
    }
    
    func archiveBeat(_ beat: Beat, completion: @escaping() -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return } //if current user is authenticated
        guard let beatID = beat.id else { return } //get post id
        let userLikesRef = Firestore.firestore().collection("users").document(uid).collection("user-archives")
        //go to/build user upvote collection
        
        Firestore.firestore().collection("beats").document(beatID)
            .updateData(["beatArchives": beat.beatArchives + 1]) { _ in //adds like count for post
                userLikesRef.document(beatID).setData([:]) { _ in
                    //writes document ID into user likes
                    completion()
                }
            }
    }
    
    func unarchiveBeat(_ beat: Beat, completion: @escaping() -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        guard let beatID = beat.id else { return }
        guard beat.beatArchives > 0 else { return } //can only unlike post if post has at least one like
        
        let userLikesRef = Firestore.firestore().collection("users").document(uid).collection("user-likes")
        //access user upvote collection
        
        Firestore.firestore().collection("beats").document(beatID)
            .updateData(["beatArchives": beat.beatArchives - 1]) { _ in
                userLikesRef.document(beatID).delete { _ in
                    completion() //deleted thread ID from user upvote collection
                }
            }
    }
    
    func checkIfUserLikedBeat(_ beat: Beat, completion: @escaping(Bool) -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        guard let beatID = beat.id else { return }
        
        Firestore.firestore().collection("users")
            .document(uid)
            .collection("user-likes")
            .document(beatID).getDocument { snapshot, _ in
                guard let snapshot = snapshot else { return }
                completion(snapshot.exists)
                //if postID exists, run function; don't run if no postID exists
            }
    }
    
    func checkIfUserArchivedBeat(_ beat: Beat, completion: @escaping(Bool) -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        guard let beatID = beat.id else { return }
        
        Firestore.firestore().collection("users")
            .document(uid)
            .collection("user-archives")
            .document(beatID).getDocument { snapshot, _ in
                guard let snapshot = snapshot else { return }
                completion(snapshot.exists)
                //if postID exists, run function; don't run if no postID exists
            }
    }
    
    func fetchLikedBeats(forUid uid: String, completion: @escaping([Beat]) -> Void) {
        var beats = [Beat]() //access post model
        Firestore.firestore().collection("users")
            .document(uid)
            .collection("user-likes") //go to user upvote collection
            .getDocuments { snapshot, _ in
                guard let documents = snapshot?.documents else { return }
                
                documents.forEach { doc in
                    let postID = doc.documentID //postID = every thread that users upvotes
                    
                    Firestore.firestore().collection("beats")
                        .document(postID)
                        .getDocument { snapshot, _ in
                            guard let beat = try? snapshot?.data(as: Beat.self) else { return }
                            beats.append(beat)
                            //fetch every post the user upvotes in community
                            completion(beats)
                        }
                }
            }
    }
    
    func fetchArchivedBeats(forUid uid: String, completion: @escaping([Beat]) -> Void) {
        var beats = [Beat]() //access post model
        Firestore.firestore().collection("users")
            .document(uid)
            .collection("user-archives") //go to user upvote collection
            .getDocuments { snapshot, _ in
                guard let documents = snapshot?.documents else { return }
                
                documents.forEach { doc in
                    let beatID = doc.documentID //postID = every thread that users upvotes
                    
                    Firestore.firestore().collection("beats")
                        .document(beatID)
                        .getDocument { snapshot, _ in
                            guard let beat = try? snapshot?.data(as: Beat.self) else { return }
                            beats.append(beat)
                            //fetch every post the user upvotes in community
                            completion(beats)
                        }
                }
            }
    }
}
