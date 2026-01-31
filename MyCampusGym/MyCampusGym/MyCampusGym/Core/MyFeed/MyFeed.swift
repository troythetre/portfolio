//
//  SettingsView.swift
//  MyCampusGym
//
//  Created by Troy Wu on 2024/10/30.
//

import SwiftUI

struct MyFeed: View {

    @State var feedPosts:[FeedPost] = [FeedPost]()
    @State var isSheetPresented:Bool = false

    var ps:ProfileService = ProfileService()
    var fps:FeedPostService = FeedPostService()
    
    @EnvironmentObject var viewModel:AuthViewModel
    
    var body: some View {
        VStack {
            FeedHeaderView(isSheetPresented: $isSheetPresented, posts: $feedPosts)
                .environmentObject(viewModel)
                .padding()
            
            FeedPostsView()
            
            HStack {
                Text("Followed By You")
                    .fontWeight(.bold)
                    .font(.title2)
                
                Spacer()
                
                Text("View More")
                    .fontWeight(.regular)
                    .font(.title3)
                    .foregroundStyle(.gray)
            }
            .padding()
            
            FeedPostScrollView(isSheetPresented: $isSheetPresented)
            
            Spacer()
        }
    }
}

#Preview {
    MyFeed()
        .environmentObject(AuthViewModel())
}
