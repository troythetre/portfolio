//
//  ProfileViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/24.
//

import Foundation

class ProfileViewModel: ObservableObject {
    @Published var posts = [Post]()
    @Published var likedPosts = [Post]()
    @Published var archivePosts = [Post]()
    private let userService = UserService()
    
    private let service = PostService()
    let user: AppUser
    
    init(user: AppUser) {
        self.user = user
        self.fetchUserPosts()
        self.fetchLikedPosts()
        self.fetchArchivedPosts()
    }
    
    var actionButtonTitle: String {
        return user.isCurrentUser ? "Edit Profile": "Follow"
    }
    
    func posts(forFilter filter: FilterViewModel) -> [Post] {
        switch filter {
        case .archive:
            return posts
        case .sold:
            return likedPosts
        case .saved:
            return posts
        case .library:
            return archivePosts //archivedPosts()
        }
    }
    
    func fetchUserPosts() {
        guard let uid = user.id else { return } //stores the user id
        service.fetchPosts(forUid: uid) { posts in //PostService - fetch posts for uid
            self.posts = posts //self.posts = all posts from the same uid
            for i in 0 ..< posts.count {
                self.posts[i].user = self.user
            }
        }
    }
    
    func fetchLikedPosts() {
        guard let uid = user.id else { return }
        service.fetchLikedPosts(forUid: uid) { posts in
            self.likedPosts = posts
            for i in 0 ..< posts.count {
                let uid = posts[i].uid
                self.userService.fetchUser(withUid: uid) { user in
                    self.likedPosts[i].user = user
                }
            }
        }
    }
    
    func fetchArchivedPosts() {
        guard let uid = user.id else { return }
        service.fetchArchivedPosts(forUid: uid) { posts in
            self.archivePosts = posts
            for i in 0 ..< posts.count {
                let uid = posts[i].uid
                self.userService.fetchUser(withUid: uid) { user in
                    self.archivePosts[i].user = user
                }
            }
        }
    }
}
