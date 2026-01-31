//
//  CommunityPostFeedViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/24.
//

import Foundation

class ThreadFeedViewModel: ObservableObject {
    @Published var posts = [Post]() //creates a publisher with type /model/Post
    let service = PostService() //from /service/post service
    let userService = UserService() //from /service/user service
    
    init() {
        fetchPosts()
    }
    
    func fetchPosts() {
        service.fetchPosts { posts in
            self.posts = posts
            
            for i in 0 ..< posts.count {
                let uid = posts[i].uid
                self.userService.fetchUser(withUid: uid) { user in
                    self.posts[i].user = user
                }
            }
        }
    }
}

//[post1, post2, post3, post4]
