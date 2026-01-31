//
//  PostService.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/24.
//

import Firebase
import FirebaseStorage

struct PostService {
    
    var imageUrl = ""
    
    func uploadPhoto(image: UIImage, completion: @escaping(String) -> Void) {
        //make sure the selected image isn't nil
//        guard image != nil else { return }
        //create a storage reference
        let storageRef = Storage.storage().reference()
        //Turn our image into data
        guard let imageData = image.jpegData(compressionQuality: 0.8) else { return }
        
//        guard imageData != nil else { return }
        
        let path = "thread_images/\(UUID().uuidString).jpeg"
        let fileRef = storageRef.child(path)
        
        fileRef.putData(imageData, metadata: nil) {_, error in
            if let error = error {
                print("DEBUG: Failed to upload image with error \(error.localizedDescription)")
            }
            
            fileRef.downloadURL { imageUrl, _ in
                guard let imageUrl = imageUrl?.absoluteString else { return }
                completion(imageUrl)
            }
        }
    }
    
    func uploadPost(caption: String, tag: String, image: UIImage, completion: @escaping(Bool) -> Void ) {
        //Completion: a closure the method calls after determining if it can open the URL,
        //but possibly before fully opening the URL.
        //The closure takes a Boolean value that indicates whether the method can open the URL.
        
        
        uploadPhoto(image: image) { threadImageUrl in
            
            guard let uid = Auth.auth().currentUser?.uid else { return }
            //determining the uid of the current user - from firestore /users/uid ""
            
            let data = ["uid": uid,
                        "caption": caption,
                        "threadImageUrl": threadImageUrl,
                        "tag": tag,
                        "likes": 0,
                        "comments": 0,
                        "archives": 0,
                        "shares": 0,
                        "timestamp": Timestamp(date: Date())] as [String: Any] //add archives, comments, post media
            //data to display
            
            Firestore.firestore().collection("threads").document()
                .setData(data) { error in
                    if let error = error {
                        print("DEBUG: Failed to upload post with error: \(error.localizedDescription)")
                        completion(false)
                        return
                    }
                    completion(true)
                }
            //writes data into firestore /communityPosts/uid/content
        }
    }
    
    func fetchPosts(completion: @escaping([Post]) -> Void) {
        Firestore.firestore().collection("threads")
            .order(by: "timestamp", descending: true)
            .getDocuments { snapshot, _ in
                guard let documents = snapshot?.documents else { return }
                let posts = documents.compactMap({ try? $0.data(as: Post.self)})
                completion(posts)
            }
    }
    //fetch all posts in firestore /communityPosts/
    
    func fetchPosts(forUid uid: String, completion: @escaping([Post]) -> Void) {
        Firestore.firestore().collection("threads")
            .whereField("uid", isEqualTo: uid)
            .getDocuments { snapshot, _ in
                guard let documents = snapshot?.documents else { return }
                let posts = documents.compactMap({ try? $0.data(as: Post.self)})
                completion(posts.sorted(by: { $0.timestamp.dateValue() > $1.timestamp.dateValue() }))
            }
    }
    //fetch all posts in firestore /communityPosts/uid

}

// MARK: likes

extension PostService {
    func likedPost(_ post: Post, completion: @escaping() -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return } //if current user is authenticated
        guard let postID = post.id else { return } //get post id
        let userLikesRef = Firestore.firestore().collection("users").document(uid).collection("user-likes") 
        //go to/build user upvote collection
        
        Firestore.firestore().collection("threads").document(postID)
            .updateData(["likes": post.likes + 1]) { _ in //adds like count for post
                userLikesRef.document(postID).setData([:]) { _ in
                    //writes document ID into user likes
                    completion()
                }
            }
    }
    
    func unlikePost(_ post: Post, completion: @escaping() -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        guard let postID = post.id else { return }
        guard post.likes > 0 else { return } //can only unlike post if post has at least one like
        
        let userLikesRef = Firestore.firestore().collection("users").document(uid).collection("user-likes") 
        //access user upvote collection
        
        Firestore.firestore().collection("threads").document(postID)
            .updateData(["likes": post.likes - 1]) { _ in
                userLikesRef.document(postID).delete { _ in
                    completion() //deleted thread ID from user upvote collection
                }
            }
    }
    
    func archivePost(_ post: Post, completion: @escaping() -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return } //if current user is authenticated
        guard let postID = post.id else { return } //get post id
        let userLikesRef = Firestore.firestore().collection("users").document(uid).collection("user-archives")
        //go to/build user upvote collection
        
        Firestore.firestore().collection("threads").document(postID)
            .updateData(["archives": post.archives + 1]) { _ in //adds like count for post
                userLikesRef.document(postID).setData([:]) { _ in
                    //writes document ID into user likes
                    completion()
                }
            }
    }
    
    func unarchivePost(_ post: Post, completion: @escaping() -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        guard let postID = post.id else { return }
        guard post.archives > 0 else { return } //can only unlike post if post has at least one like
        
        let userLikesRef = Firestore.firestore().collection("users").document(uid).collection("user-likes")
        //access user upvote collection
        
        Firestore.firestore().collection("threads").document(postID)
            .updateData(["archives": post.archives - 1]) { _ in
                userLikesRef.document(postID).delete { _ in
                    completion() //deleted thread ID from user upvote collection
                }
            }
    }
    
    func checkIfUserLikedPost(_ post: Post, completion: @escaping(Bool) -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        guard let postID = post.id else { return }
        
        Firestore.firestore().collection("users")
            .document(uid)
            .collection("user-likes")
            .document(postID).getDocument { snapshot, _ in
                guard let snapshot = snapshot else { return }
                completion(snapshot.exists)
                //if postID exists, run function; don't run if no postID exists
            }
    }
    
    func checkIfUserArchivedPost(_ post: Post, completion: @escaping(Bool) -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        guard let postID = post.id else { return }
        
        Firestore.firestore().collection("users")
            .document(uid)
            .collection("user-archives")
            .document(postID).getDocument { snapshot, _ in
                guard let snapshot = snapshot else { return }
                completion(snapshot.exists)
                //if postID exists, run function; don't run if no postID exists
            }
    }
    
    func fetchLikedPosts(forUid uid: String, completion: @escaping([Post]) -> Void) {
        var posts = [Post]() //access post model
        Firestore.firestore().collection("users")
            .document(uid)
            .collection("user-likes") //go to user upvote collection
            .getDocuments { snapshot, _ in
                guard let documents = snapshot?.documents else { return }
                
                documents.forEach { doc in
                    let postID = doc.documentID //postID = every thread that users upvotes
                    
                    Firestore.firestore().collection("threads")
                        .document(postID)
                        .getDocument { snapshot, _ in
                            guard let post = try? snapshot?.data(as: Post.self) else { return }
                            posts.append(post)
                            //fetch every post the user upvotes in community
                            completion(posts)
                        }
                }
            }
    }
    
    func fetchArchivedPosts(forUid uid: String, completion: @escaping([Post]) -> Void) {
        var posts = [Post]() //access post model
        Firestore.firestore().collection("users")
            .document(uid)
            .collection("user-archives") //go to user upvote collection
            .getDocuments { snapshot, _ in
                guard let documents = snapshot?.documents else { return }
                
                documents.forEach { doc in
                    let postID = doc.documentID //postID = every thread that users upvotes
                    
                    Firestore.firestore().collection("threads")
                        .document(postID)
                        .getDocument { snapshot, _ in
                            guard let post = try? snapshot?.data(as: Post.self) else { return }
                            posts.append(post)
                            //fetch every post the user upvotes in community
                            completion(posts)
                        }
                }
            }
    }
}
