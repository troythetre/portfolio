//
//  TweetRowView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/17.
//

import SwiftUI
import Kingfisher

struct PostView: View {
    @ObservedObject var viewModel: PostViewModel
    
    init(post: Post) {
        self.viewModel = PostViewModel(post: post)
    }
    
    var body: some View {
        HStack {
            //Profile image + user info + tweet
            if let user = viewModel.post.user {
                KFImage(URL(string: viewModel.post.threadImageUrl!))
                    .resizable()
                    .frame(width: 60, height: 60)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(viewModel.post.caption)
                        .font(.system(size: 14))
                        .fontWeight(.semibold)
                    HStack {
                        KFImage(URL(string: user.profileImageUrl))
                            .resizable()
                            .frame(width: 20, height: 20)
                            .clipShape(Circle())
                        Text("bought by")
                            .font(.system(size: 10))
                        Text("@\(user.username)")
                            .foregroundStyle(Color(hex: "#06b9ff"))
                            .font(.system(size: 10))
                    }
                    HStack {
                        Image(systemName: "airplayaudio")
                            .resizable()
                            .frame(width: 10, height: 10)
                            .foregroundStyle(.blue)
                        Text("800")
                            .font(.system(size: 10))
                        Image(systemName: "circle.fill")
                            .resizable()
                            .frame(width: 2.5, height: 2.5)
                        Image(systemName: "heart.fill")
                            .resizable()
                            .frame(width: 10, height: 10)
                            .foregroundStyle(.red)
                        Text("42")
                            .font(.system(size: 10))
                    }
                }
                
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading) // Align the HStack to the very left
        .padding(.leading, 26)
    }
}

                
//                HStack (alignment: .top, spacing: 12) {
//                    KFImage(URL(string: user.profileImageUrl))
//                        .resizable()
//                        .scaledToFill()
//                        .frame(width: 56, height: 56)
//                        .clipShape(/*@START_MENU_TOKEN@*/Circle()/*@END_MENU_TOKEN@*/)
//                        
//                    //User info and post caption
//                    VStack (alignment: .leading, spacing: 4) {
//                        //User info
//                        
//                        HStack {
//                            Text(user.fullname)
//                                .font(.subheadline).bold()
//                            
//                            Text("@\(user.username)")
//                                .foregroundColor(.gray)
//                                .font(.caption)
//                            
//                            Text("3d")
//                                .foregroundStyle(.gray)
//                                .font(.caption)
//                        }
//                        
//                        HStack {
//                            if viewModel.post.tag != "" {
//                                Button {
//                                    print("DEBUG: Enter a community view via tag")
//                                } label: {
//                                    Text(viewModel.post.tag ?? "")
//                                        .font(.subheadline).bold()
//                                        .frame(width: 75, height: 24)
//                                        .foregroundColor(.white)
//                                        .background(
//                                            RoundedRectangle(cornerRadius: 20).stroke(Color.gray, lineWidth: 0.1).fill(Color.blue)
//                                        )
//                                        .overlay(
//                                            RoundedRectangle(cornerRadius: 20, style: .continuous)
//                                                .strokeBorder(Color.gray, lineWidth: 0.1)
//                                        )
//                                }
//                            }
//                            
//                        }
//                        //Post caption
//                        Text(viewModel.post.caption)
//                            .font(.subheadline)
//                            .multilineTextAlignment(/*@START_MENU_TOKEN@*/.leading/*@END_MENU_TOKEN@*/)
//                    }
//                }
//            }
//}
            
//            VStack(alignment: .leading) {
//                HStack {
//                    if viewModel.post.threadImageUrl != "" {
//                        KFImage(URL(string: viewModel.post.threadImageUrl!))
//                            .resizable()
//                            .scaledToFit()
//                            .frame(width: 400, height: 320)
//                            .clipShape(RoundedRectangle(cornerRadius: 25))
//                    }
//                    
//                }
//            }
            
//            //For action buttons
//            HStack(spacing: 16) {
//                Button {
//                    viewModel.post.didLike ?? false ?
//                    viewModel.unlikePost() :
//                    viewModel.likedPost()
//                } label: {
//                    Image(systemName: viewModel.post.didLike ?? false ? "chevron.up": "chevron.up")
//                        .font(.subheadline)
//                        .foregroundColor(viewModel.post.didLike ?? false ? .blue: .white)
//                    Text("\(viewModel.post.likes)")
//                        .foregroundColor(.white)
//                    
//                }
//                Button {
//                    print("DEBUG: downvote button")
//                } label: {
//                    Image(systemName: viewModel.post.didLike ?? true ? "chevron.down": "chevron.down")
//                        .font(.subheadline)
//                        .foregroundColor(.white)
//                }
//                Spacer()
//                Button {
//                    //action goes here..
//                } label: {
//                    Image(systemName: "text.bubble.fill")
//                        .font(.subheadline)
//                        .foregroundColor(.white)
//                    Text("\(viewModel.post.comments)")
//                        .foregroundColor(.white)
//                }
//                Spacer()
//                Button { //not implemented
//                    viewModel.post.didArchive ?? false ?
//                    viewModel.unarchivePost() :
//                    viewModel.archivePost()
//                } label: {
//                    Image(systemName: "bookmark.fill")
//                        .font(.subheadline)
//                        .foregroundColor(viewModel.post.didArchive ?? false ? .yellow: .white)
//                    Text("\(viewModel.post.archives)")
//                        .foregroundColor(.white)
//                }
//                Spacer()
//                Button { //not implemented
//                    //action goes here..
//                } label: {
//                    Image(systemName: "square.and.arrow.up.fill")
//                        .font(.subheadline)
//                        .foregroundColor(.white)
//                }
//            }
//            .padding()
//            .foregroundColor(.gray)
//            
//            Divider()
            
//        }
//    }
//}
