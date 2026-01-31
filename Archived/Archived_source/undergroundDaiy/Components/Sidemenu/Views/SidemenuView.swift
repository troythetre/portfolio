//
//  SidemenuView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/17.
//

import SwiftUI
import Kingfisher

struct SidemenuView: View {
    
    @EnvironmentObject var authViewModel: AuthViewModel
    
    var body: some View { //quick profile window
        
        if let user = authViewModel.currentUser {
            VStack(alignment: .leading, spacing: 32) {
                VStack(alignment: .leading) {
                    HStack {
                        KFImage(URL(string: user.profileImageUrl))
                            .resizable()
                            .scaledToFill()
                            .clipShape(/*@START_MENU_TOKEN@*/Circle()/*@END_MENU_TOKEN@*/)
                            .frame(width: 48, height: 48)
                        
                        VStack(alignment: .leading, spacing: 4) {
                            Text(user.fullname)
                                .font(.headline)
                                .foregroundColor(.white)
                            
                            Text("@\(user.username)")
                                .font(.caption)
                                .foregroundColor(.gray)
                        }
                    }
                    UserStatsView() //displays following and followers
                        .padding(.vertical)
                }
                .padding(.leading)
                
                ForEach(SidemenuViewModel.allCases, id: \.rawValue) { viewModel in
                    if viewModel == .profile {
                        NavigationLink {
                            ProfileView(user: user)
                        } label: {
                            SidemenuOptionRowView(viewModel: viewModel)
                                .foregroundColor(.white)
                        }
                    } else if viewModel == .notification {
                        NavigationLink {
                            NotificationView()
                        } label: {
                            SidemenuOptionRowView(viewModel: viewModel)
                                .foregroundColor(.white)
                        }
                    } else if viewModel == .uploadVideo {
                        NavigationLink {
                            VideoTestView()
                        } label: {
                            SidemenuOptionRowView(viewModel: viewModel)
                                .foregroundColor(.white)
                        }
                    } else if viewModel == .settings {
                        NavigationLink {
                            SettingsView(user: user)
                        } label: {
                            SidemenuOptionRowView(viewModel: viewModel)
                                .foregroundColor(.white)
                        }
                    } else if viewModel == .logout {
                        Button {
                            authViewModel.signOut()
                        } label: {
                            SidemenuOptionRowView(viewModel: viewModel)
                                .foregroundColor(.white)
                        }
                        
                    } else {
                        SidemenuOptionRowView(viewModel: viewModel)
                    }
                }
                Spacer()
            }
            .background(Color(.black))
        }
    }
}

#Preview {
    SidemenuView()
}



