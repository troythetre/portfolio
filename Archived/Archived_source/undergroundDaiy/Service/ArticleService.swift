//
//  ArticleService.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/25.
//

import Firebase

struct ArticleService {
    
    func fetchArticles(completion: @escaping([Article]) -> Void) {
        Firestore.firestore().collection("journalismArticles")
            .order(by: "timestamp", descending: true)
            .getDocuments { snapshot, _ in
                guard let documents = snapshot?.documents else {
                    return }
                let articles = documents.compactMap({ try? $0.data(as: Article.self)})
                completion(articles)
            }
    }
}

extension ArticleService {
    func upvoteArticle(_ article: Article, completion: @escaping() -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return } //if current user is authenticated
        guard let articleID = article.id else { return } //get article id
        let userUpvotesRef = Firestore.firestore().collection("users").document(uid).collection("upvoted-articles")
        //build upvoted articles collection
        
        Firestore.firestore().collection("journalismArticles").document(articleID) //go to article in journalismArticle
            .updateData(["likes": article.likes + 1]) { _ in //adds like count for article
                userUpvotesRef.document(articleID).setData([:]) { _ in
                    completion()
                }
            }
    }
    
    func downvoteArticle(_ article: Article, completion: @escaping() -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        guard let articleID = article.id else { return }
        guard article.likes > 0 else { return } //can only unlike article if article has at least one like
        
        let userUpvotesRef = Firestore.firestore().collection("users").document(uid).collection("upvoted-articles")
        //create user upvote collection
        
        Firestore.firestore().collection("journalismArticles").document(articleID)
            .updateData(["likes": article.likes - 1]) { _ in
                userUpvotesRef.document(articleID).delete { _ in
                    completion() //deleted article ID from user upvote collection
                }
            }
    }
    
    func archiveArticle(_ article: Article, completion: @escaping() -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return } //if current user is authenticated
        guard let articleID = article.id else { return } //get article id
        let userArchiveRef = Firestore.firestore().collection("users").document(uid).collection("archived-articles")
        //go to/build user upvote collection
        
        Firestore.firestore().collection("journalismArticles").document(articleID)
            .updateData(["archive": article.archive + 1]) { _ in //adds like count for post
                userArchiveRef.document(articleID).setData([:]) { _ in
                    //writes document ID into user likes
                    completion()
                }
            }
    }
    
    func unarchiveArticle(_ article: Article, completion: @escaping() -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        guard let articleID = article.id else { return }
        guard article.archive > 0 else { return } //can only unlike post if post has at least one like
        
        let userArchiveRef = Firestore.firestore().collection("users").document(uid).collection("archived-articles")
        //access user upvote collection
        
        Firestore.firestore().collection("journalismArticles").document(articleID)
            .updateData(["archive": article.archive - 1]) { _ in
                userArchiveRef.document(articleID).delete { _ in
                    completion() //deleted thread ID from user upvote collection
                }
            }
    }
    
    func checkIfUserUpvotedArticle(_ article: Article, completion: @escaping(Bool) -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        guard let articleID = article.id else { return }
        
        Firestore.firestore().collection("users")
            .document(uid)
            .collection("upvoted-articles")
            .document(articleID).getDocument { snapshot, _ in
                guard let snapshot = snapshot else { return }
                completion(snapshot.exists)
            }
    }
    
    func checkIfUserArchivedArticle(_ article: Article, completion: @escaping(Bool) -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        guard let articleID = article.id else { return }
        
        Firestore.firestore().collection("users")
            .document(uid)
            .collection("archived-articles")
            .document(articleID).getDocument { snapshot, _ in
                guard let snapshot = snapshot else { return }
                completion(snapshot.exists)
            }
    }
    
    func fetchUpvotedArticles(forUid uid: String, completion: @escaping([Article]) -> Void) {
        var articles = [Article]() //access article model
        Firestore.firestore().collection("users")
            .document(uid)
            .collection("upvoted-articles") //go to user upvote collection
            .getDocuments { snapshot, _ in
                guard let documents = snapshot?.documents else { return }
                
                documents.forEach { doc in
                    let articleID = doc.documentID //articleID = every article that users upvotes
                    
                    Firestore.firestore().collection("journalismArticles")
                        .document(articleID)
                        .getDocument { snapshot, _ in
                            guard let article = try? snapshot?.data(as: Article.self) else { return }
                            articles.append(article)
                            //fetch every article the user upvotes in journalism
                            completion(articles)
                        }
                }
            }

    }
    
    func fetchArchivedArticles(forUid uid: String, completion: @escaping([Article]) -> Void) {
        var articles = [Article]() //access post model
        Firestore.firestore().collection("users")
            .document(uid)
            .collection("archived-articles") //go to user upvote collection
            .getDocuments { snapshot, _ in
                guard let documents = snapshot?.documents else { return }
                
                documents.forEach { doc in
                    let articleID = doc.documentID //postID = every thread that users upvotes
                    
                    Firestore.firestore().collection("journalismArticles")
                        .document(articleID)
                        .getDocument { snapshot, _ in
                            guard let article = try? snapshot?.data(as: Article.self) else { return }
                            articles.append(article)
                            //fetch every post the user upvotes in community
                            completion(articles)
                        }
                }
            }
    }
}
