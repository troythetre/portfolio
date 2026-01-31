//
//  FeedPostThreadView.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/30/24.
//


import SwiftUI

struct FeedPostThreadView: View {
    
    var feedPost:FeedPost
    var profile:Profile
    @State var feedPostComments:[FeedPost] = [FeedPost]()
    @State var newComment:FeedPost = FeedPost()
    
    var fps:FeedPostService = FeedPostService()
    
    var body: some View {
        Text(feedPost.headline)
            .font(.headline)
            .padding(.top, 5)
        
        VStack {
            HStack {
                Text(feedPost.content)
                Spacer()
            }
            HStack {
                Text("\(feedPost.likesCount) likes | \(feedPostComments.count) comments")
                    .font(.subheadline)
                    .foregroundColor(Color.gray)
                Spacer()
            }
            .padding(.top, 2)
        }
        .padding()
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(.black),
            alignment: .bottom
        )
        .onTapGesture {
            hideKeyboard()
        }
        
        ScrollView(showsIndicators: false) {
            ForEach(feedPostComments) { comment in
                VStack {
                    HStack {
                        Text(comment.content)
                        Spacer()
                        VStack {
                            Image(systemName: "hand.thumbsup.fill")
                            Text("\(feedPost.likesCount)")
                                .padding(.top, 1)
                        }
                        .foregroundColor(Color.gray)
                    }
                }
                .padding()
                Divider()
            }
        }
        .onAppear {
            fps.getFeedPostComments(parentFeedPostId: feedPost.id) { c in
                feedPostComments = c
            }
        }
        .onTapGesture {
            hideKeyboard()
        }
        Spacer()
        HStack {
            TextField("New Comment", text: $newComment.content)
                .padding()
            Spacer()
            Image(systemName: "paperplane.circle.fill").padding().onTapGesture {
                if(newComment.content != "") {
                    fps.createPost(newPost: newComment, profile: profile, parentFeedPostId: feedPost.id)
                    fps.getFeedPostComments(parentFeedPostId: feedPost.id) { n in
                        feedPostComments = n
                        hideKeyboard()
                        newComment = FeedPost()
                    }
                }
            }
        }
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(.black),
            alignment: .top
        )
    }
}

extension View {
    func hideKeyboard() {
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
    }
}


#Preview {
    FeedPostThreadView(feedPost:FeedPost(content: "Preview Content", headline: "Preview Headline"), profile: Profile())
}
