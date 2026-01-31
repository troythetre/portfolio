//
//  FeedHeaderView.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/24/24.
//

import SwiftUI

struct FeedHeaderView: View {
    
    @Binding var isSheetPresented:Bool
    @Binding var posts:[FeedPost]
    
    @State var newPost:FeedPost = FeedPost()
    @State var profile:Profile = Profile()
    
    var ps:ProfileService = ProfileService()
    var fps:FeedPostService = FeedPostService()
    var fs:FirestoreService = FirestoreService()
    
    @EnvironmentObject var viewModel:AuthViewModel
    
    var body: some View {
        
        HStack {
            HStack {
                Image("MyCampusGym")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 70, height: 70)
                    .clipShape(Circle())
                VStack {
                    Text("User")
                        .font(.system(size: 30))
                        .fontWeight(.bold)
                    
                    Text("@_user")
                        .font(.system(size: 15))
                        .fontWeight(.light)
                        .foregroundStyle(.gray)
                }
            }
            
            Spacer()
            
            Button {
                isSheetPresented = true
            } label: {
                Image(systemName: "square.and.pencil")
                    .font(.system(size: 33))
                    .foregroundColor(Color.secondary
                        .opacity(0.7))
            }
        }
        .onAppear {
            ps.getProfile(uid: viewModel.currentSessionUser?.id ?? "") { p in
                profile = p
            }
        }        
    }
}
