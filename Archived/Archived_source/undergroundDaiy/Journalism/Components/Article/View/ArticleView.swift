//
//  ViewC.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/12.
//

import SwiftUI
import Kingfisher

struct ArticleView: View {

    @ObservedObject var viewModel: ArticleViewModel
    
    init(article: Article) {
        self.viewModel = ArticleViewModel(article: article)
    }
    
    var body: some View {
        ZStack {
            Color(.black)
                .ignoresSafeArea()
            ScrollView {
                VStack(alignment: .leading) {
                    Text(viewModel.article.title)
                        .font(.largeTitle)
                        .fontWeight(.semibold)
                        .foregroundColor(Color.white)
        
                    KFImage(URL(string: viewModel.article.articleImage))
                        .resizable()
                        .cornerRadius(15.0)
                        .aspectRatio(contentMode: .fit)
                        .padding(.all)
                    
                    Text(viewModel.article.description)
                        .foregroundColor(Color.white)
                        .frame(width: .infinity, alignment: .leading)
                        .padding(.top)
                    
                    Text("Date: May 15 16:32:32")
                        .foregroundColor(Color.white)
                        .frame(width: .infinity, alignment: .leading)
                        .padding(.top)
                    
                    Spacer()
                    
                    HStack(alignment: .center) {
                        Image(systemName: "chevron.up")
                        Text("Likes: \(viewModel.article.likes)")
                        Spacer()
                        Image(systemName: "bookmark.fill")
                        Text("Archives: \(viewModel.article.archive)")
                        Spacer()
                        Image(systemName: "bookmark")
                        Text("Comments: \(viewModel.article.comment)")
                    }
                    
                    Spacer()
                    
                    Text(viewModel.article.content)
                        .foregroundColor(Color(.white))
                    
                }
            }
            
            
        }
//        }
//        .navigationTitle("Article")
//            .foregroundColor(.white)
        
    }
}

//struct ArticleView_Previews: PreviewProvider {
//    static var previews: some View {
//        ArticleView()
//    }
//}
