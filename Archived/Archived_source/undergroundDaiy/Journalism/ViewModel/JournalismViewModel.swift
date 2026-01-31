//
//  ArchiveViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/29.
//

import Foundation

class JournalismViewModel: ObservableObject {
    @Published var articles = [Article]()
    @Published var upvotedArticles = [Article]()
    @Published var archivedArticles = [Article]()
    private let userService = UserService()
    
    private let service = ArticleService()
    let user: AppUser
    
    init(user: AppUser) {
        self.user = user
        self.fetchArticles()
        self.fetchUpvotedArticles()
        self.fetchArchivedArticles()
    }
    
    func articles(forFilter filter: JournalismFilterViewModel) -> [Article] {
        switch filter {
        case .feed:
            return articles
        case .archived:
            return archivedArticles
        }
    }
    
    func fetchArticles() {
        service.fetchArticles { articles in
            self.articles = articles
        }
    }
    
    func fetchUpvotedArticles() {
        guard let uid = user.id else { return }
        service.fetchUpvotedArticles(forUid: uid) { articles in
            self.upvotedArticles = articles
            for i in 0 ..< articles.count {
//                let uid = articles[i].uid
                self.userService.fetchUser(withUid: uid) { user in
                    self.upvotedArticles[i].user = user
                }
            }
        }
    }
    
    func fetchArchivedArticles() {
        guard let uid = user.id else { return }
        service.fetchArchivedArticles(forUid: uid) { articles in
            self.archivedArticles = articles
            for i in 0 ..< articles.count {
                //let uid = articles[i].uid
                self.userService.fetchUser(withUid: uid) { user in
                    self.archivedArticles[i].user = user
                }
            }
        }
    }
}

