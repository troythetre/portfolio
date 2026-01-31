//
//  InboxView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/10.
//

import SwiftUI
import Kingfisher

struct InboxView: View {
    @State private var searchedText = ""
    @State private var showNewMessageView = false
    @EnvironmentObject var authViewModel: AuthViewModel
    @ObservedObject var viewModel = ExploreViewModel()
    
    var body: some View {
        NavigationStack {
            
            HStack {
                Text("Connections")
                    .font(.title2)
                    .fontWeight(.semibold)
                Image(systemName: "person.fill")
                Text("432")
                    .fontWeight(.semibold)
                
                Spacer()
                
                Text("COLLABS")
                    .font(.system(size: 12))
                    .fontWeight(.semibold)
                    .foregroundStyle(.black)
                    .padding(.horizontal, 4)
                    .padding(.trailing, 2)
                    .background(.white)
                    .clipShape(Capsule())
            }
            
            ScrollView {
                //ActiveUsersView()
                
                List {
                    ForEach(viewModel.searchableUser) { user in
                        InboxRowView(user: user)
                    }
                }
                .listStyle(PlainListStyle())
                .frame(height: UIScreen.main.bounds.height - 120)
            }
            .fullScreenCover(isPresented: $showNewMessageView, content: {
                NewMessageView()
            })
//            .toolbar {
//                ToolbarItem(placement: .navigationBarLeading) {
//                    if let user = authViewModel.currentUser {
//                        NavigationLink {
//                            ProfileView(user: user)
//                        } label: {
//                            HStack {
//                                CircularProfileView(size: .xSmall, user: user)
//                                
//                                Text("Inbox")
//                                    .font(.title)
//                                    .fontWeight(.semibold)
//                                    .foregroundStyle(.white)
//                            }
//                        }
//                    }
//                }
//                
//                ToolbarItem(placement: .navigationBarTrailing) {
//                    Button {
//                        showNewMessageView.toggle()
//                    } label: {
//                        Image(systemName: "square.and.pencil.circle.fill")
//                            .resizable()
//                            .frame(width: 32, height: 32)
//                            .foregroundStyle(.black, Color(.white))
//                    }
//                }
//            }
        }
        .preferredColorScheme(.dark)
        .accentColor(.white)
    }
}

#Preview {
    InboxView()
}
