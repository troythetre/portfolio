//
//  PostRowViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/24.
//

import Foundation

class PostViewModel: ObservableObject {
    @Published var post: Post //Model - Post
    private let service = PostService()
    
    init(post: Post) {
        self.post = post //initialize post
        checkIfUserLikedPost()
        checkIfUserArchivedPost()
    }
    
    func likedPost() {
        service.likedPost(post) {
            self.post.didLike = true
        }
    }
    
    func unlikePost() {
        service.unlikePost(post) {
            self.post.didLike = false
        }
    }
    
    func archivePost() {
        service.archivePost(post) {
            self.post.didArchive = true
        }
    }
    
    func unarchivePost() {
        service.unarchivePost(post) {
            self.post.didArchive = false
        }
    }
    
    func checkIfUserLikedPost() {
        service.checkIfUserLikedPost(post) { didLike in
            if didLike {
                self.post.didLike = true
            }
        }
    }
    
    func checkIfUserDislikedPost() {
        service.checkIfUserLikedPost(post) { didLike in
            if !(didLike) {
                self.post.didLike = false
            }
        }
    }
    
    func checkIfUserArchivedPost() {
        service.checkIfUserArchivedPost(post) { didArchive in
            if didArchive {
                self.post.didArchive = true
            }
        }
    }
}
