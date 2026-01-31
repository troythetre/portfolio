//
//  FeedView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/17.
//

import SwiftUI
import Kingfisher

struct ThreadFeedView: View {
    @State private var searchedText = ""
    @State private var showNewPostView = false
    @ObservedObject var viewModel = ThreadFeedViewModel()
    @State private var selectedFilter: ThreadFilterViewModel = .hot
    @Namespace var animation
    
    var body: some View {
        VStack {
            VStack {
                Text("Community")
                    .font(.title).bold()
                Text("")
                HStack {
                    TextField("Search on community", text: $searchedText)
                        .font(.subheadline)
                        .padding(12)
                        .background(Color(.systemGray6))
                        .cornerRadius(10)
                        .padding(.horizontal, 24)
                }
                filterBar
            }
            
            if selectedFilter == .hot {
                ZStack(alignment: .bottomTrailing) {
                    ScrollView {
                        LazyVStack {
                            ForEach(viewModel.posts) { post in //displays every post in database
                                PostView(post: post)
                                    .padding()
                            }
                        }
                    }
                    Button {
                        showNewPostView.toggle() //post button
                    } label: {
                        Image(systemName: ("paperplane.fill"))
                            .resizable()
                            .renderingMode(/*@START_MENU_TOKEN@*/.template/*@END_MENU_TOKEN@*/)
                            .frame(width: 30, height: 30)
                            .padding()
                    }
                    .background(Color(.white))
                    .foregroundColor(.blue)
                    .clipShape(/*@START_MENU_TOKEN@*/Circle()/*@END_MENU_TOKEN@*/)
                    .padding()
                    .fullScreenCover(isPresented: $showNewPostView) {
                        NewPostView() //bring new post view in full screen
                    }
                }
                .navigationBarTitleDisplayMode(.inline)
            }
            
            if selectedFilter == .exploreCommunities {
                CommunityListView()
            }
        }
    }
}

//#Preview {
//    CommunityFeedView()
//}

extension ThreadFeedView {
    var filterBar: some View {
        HStack {
            ForEach(ThreadFilterViewModel.allCases, id: \.rawValue) { item in
                VStack {
                    Text(item.title)
                        .font(.subheadline)
                        .fontWeight(selectedFilter == item ? .semibold: .regular)
                        .foregroundColor(selectedFilter == item ? .white: .gray)
                    
                    if selectedFilter == item {
                        Capsule()
                            .foregroundColor(.white)
                            .frame(height: 3)
                            .matchedGeometryEffect(id: "filter", in: animation)
                    } else {
                        Capsule()
                            .foregroundColor(Color(.clear))
                            .frame(height: 3)
                    }
                }
                .onTapGesture {
                    withAnimation(.easeInOut) {
                        self.selectedFilter = item
                    }
                }
            }
        }
        .overlay(Divider().offset(x: 0, y: 16))
    }
    
    var exploreCommunities: some View {
        HStack(spacing: 12) {
            Image(systemName: "shippingbox.fill")
                .resizable()
                .scaledToFill()
                .clipShape(/*@START_MENU_TOKEN@*/Circle()/*@END_MENU_TOKEN@*/)
                .foregroundColor(.white)
                .frame(width: 56, height: 56)
          
            VStack {
                Text("Community")
                    .font(.subheadline).bold()
                    .foregroundColor(.white)
                
                Text("community name")
                    .font(.subheadline)
                    .foregroundColor(.gray)
            }
            Spacer()
        }
        .padding(.horizontal)
        .padding(.vertical, 4)
    }
}
