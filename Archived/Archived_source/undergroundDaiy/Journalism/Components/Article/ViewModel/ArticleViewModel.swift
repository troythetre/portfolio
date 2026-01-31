//
//  ArticleViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/25.
//

import Foundation

class ArticleViewModel: ObservableObject {
    @Published var article: Article
    private let service = ArticleService()
    
    init(article: Article) {
        self.article = article
        checkIfUserUpvotedArticle()
        checkIfUserArchivedArticle()
    }
    
    func upvoteArticle() {
        service.upvoteArticle(article) {
            self.article.didLike = true
        }
    }
    
    func downvoteArticle() {
        service.downvoteArticle(article) {
            self.article.didLike = false
        }
    }
    
    func archiveArticle() {
        service.archiveArticle(article) {
            self.article.didArchive = true
        }
    }
    
    func unarchiveArticle() {
        service.unarchiveArticle(article) {
            self.article.didArchive = false
        }
    }
    
    func checkIfUserUpvotedArticle() {
        service.checkIfUserUpvotedArticle(article) { didLike in
            if didLike {
                self.article.didLike = true
            }
        }
    }
    
    func checkIfUserDownvotedArticle() {
        service.checkIfUserUpvotedArticle(article) { didLike in
            if !(didLike) {
                self.article.didLike = false
            }
        }
    }
    
    func checkIfUserArchivedArticle() {
        service.checkIfUserArchivedArticle(article) { didArchive in
            if didArchive {
                self.article.didArchive = true
            }
        }
    }
}
