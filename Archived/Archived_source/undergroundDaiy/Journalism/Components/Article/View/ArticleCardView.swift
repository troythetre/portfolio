//
//  JournalismArticlesFeedView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/25.
//

import SwiftUI
import Kingfisher

struct ArticleCardView: View {
    
    @ObservedObject var viewModel: ArticleViewModel
    
    init(article: Article) {
        self.viewModel = ArticleViewModel(article: article)
    }
    
    var body: some View {
        VStack { 
            VStack {
                KFImage(URL(string: viewModel.article.articleImage))
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                
                HStack {
                    VStack {
                        Text(viewModel.article.description)
                            .font(.headline)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.leading)
                        Text(viewModel.article.title)
                            .font(.title)
                            .fontWeight(.black)
                            .foregroundColor(.primary)
                            .lineLimit(3)
                            .multilineTextAlignment(.leading)
                        Text(viewModel.article.content)
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.leading)
                    }
                    .layoutPriority(100)
                    Spacer()
                }
                .padding()
                
                HStack(spacing: 1) {
                    Button {
                        viewModel.article.didLike ?? false ?
                        viewModel.downvoteArticle() :
                        viewModel.upvoteArticle()
                    } label: {
                        Image(systemName: viewModel.article.didLike ?? false ? "chevron.up": "chevron.up")
                            .font(.subheadline)
                            .foregroundColor(viewModel.article.didLike ?? false ? .blue: .white)
                        Text("\(viewModel.article.likes)")
                    }
                    Button {
                        print("DEBUG: dislike article")
                    } label: {
                        Image(systemName: viewModel.article.didLike ?? true ? "chevron.down": "chevron.down")
                            .font(.subheadline)
                            .foregroundColor(.white)
                    }
                    
                    Spacer()
                    
                    Button {
                        //action goes here..
                    } label: {
                        Image(systemName: "text.bubble.fill")
                            .font(.subheadline)
                            .foregroundColor(.white)
                        Text("\(viewModel.article.comment)")
                            .foregroundStyle(.white)
                    }
                    
                   Spacer()
                    
                    Button {
                        viewModel.article.didArchive ?? false ?
                        viewModel.unarchiveArticle() :
                        viewModel.archiveArticle()
                    } label: {
                        Image(systemName: "bookmark.fill")
                            .font(.subheadline)
                            .foregroundColor(viewModel.article.didArchive ?? false ? .yellow: .white)
                        Text("\(viewModel.article.archive)")
                            .foregroundStyle(.white)
                    }
                    
                   Spacer()
                    
                    Button {
                        print("DEBUG: share article")
                    } label: {
                        Image(systemName: "square.and.arrow.up.fill")
                            .font(.subheadline)
                            .foregroundColor(.white)
                    }
                }
                .foregroundColor(.white)
                .background(
                    RoundedRectangle(cornerRadius: 20).stroke(Color.gray, lineWidth: 0.1).fill(Color.black)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                        .strokeBorder(Color.gray, lineWidth: 0.1)
                )
                
            }
            .cornerRadius(10)
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(Color(.sRGB,
                                  red: 150/255,
                                  green: 150/255,
                                  blue: 150/255,
                                  opacity: 0.2),
                            lineWidth: 1)
            )
            .padding(.bottom)
        }
        .padding()
    }
}

//#Preview {
//    ArticleCardView()
//}
