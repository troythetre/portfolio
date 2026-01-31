//
//  FeedPostScrollView.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/30/24.
//

import SwiftUI

struct FeedPostScrollView: View {
    
    var fps:FeedPostService = FeedPostService()
    var fs:FirestoreService = FirestoreService()
    var ps:ProfileService = ProfileService()
    
    @EnvironmentObject var viewModel:AuthViewModel
    @Binding var isSheetPresented:Bool
    @State var newPost:FeedPost = FeedPost()
    @State var profile:Profile = Profile()
    @State var feedPosts:[FeedPost] = [FeedPost]()

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack {
                ForEach(feedPosts) { post in
                    NavigationLink {
                        FeedPostThreadView(feedPost: post, profile: profile)
                    } label: {
                        FeedPostView(feedPost: post)
                            .padding(.leading, 10)
                    }
                }
            }.onAppear {
                ps.getProfile(uid: viewModel.currentSessionUser?.id ?? "") { p in
                    print("Print returned profile")
                    print(p)
                    profile = p
                    fps.getFeedPosts(campusId: p.campusId) { fp in
                        feedPosts = fp
                    }
                }
            }
            .sheet(isPresented: $isSheetPresented) {
                NavigationView {
                    Form {
                        Section("Headline") {
                            TextField("Title your post", text: $newPost.headline)
                        }
                        
                        Section("Content") {
                            TextEditor(text: $newPost.content)
                                .frame(height: 150)
                        }
                    }
                    .toolbar {
                        Button {
                            newPost.postTime = fs.standardTimeToString(time: Date().formatted(date:.omitted, time:.standard))
                            newPost.postDate = Date()
                            fps.createPost(newPost:newPost, profile:profile)
                            fps.getFeedPosts(campusId: profile.campusId) { fp in
                                feedPosts = fp
                            }
                            //feedPosts.insert(newPost, at: 0)
                            newPost = FeedPost()
                            isSheetPresented = false
                        } label: {
                            Text("Post")
                        }
                        .padding()
                    }
                }
            }
        }
    }
}

#Preview {
    
    @Previewable @State var isSheetPresentedPreview:Bool = false
    
    let feedPosts:[FeedPost] = [
        FeedPost(headline: "Test 1"),
        FeedPost(headline: "Test 2")
    ]
    
    FeedPostScrollView(isSheetPresented: $isSheetPresentedPreview, feedPosts: feedPosts)
        .environmentObject(AuthViewModel())
}
