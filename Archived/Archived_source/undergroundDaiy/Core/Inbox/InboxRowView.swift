//
//  InboxRowView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/10.
//

import SwiftUI
import Kingfisher

struct InboxRowView: View {
    
    @ObservedObject var viewModel: ProfileViewModel
    
    init(user: AppUser) {
        self.viewModel = ProfileViewModel(user: user)
    }
    
    var body: some View {
        NavigationLink(destination: DirectMessageView(user: viewModel.user)) {
            HStack(alignment: .top, spacing: 12) {
                CircularProfileView(size: .medium, user: viewModel.user)
                
                VStack(alignment: .leading) {
                    NavigationLink(destination: ProfileView(user: viewModel.user)) {
                        HStack {
                            Text("@\(viewModel.user.username)")
                                .font(.system(size: 12))
                                .fontWeight(.semibold)
                                .foregroundColor(Color(hex: "#06b9ff"))
                            
                            Text("Producer")
                                .font(.system(size: 12))
                                .padding(.horizontal, 4)
                                .overlay(
                                    Capsule()
                                        .stroke(Color(hex: "#06b9ff"), lineWidth: 2)
                                )
                                .clipShape(Capsule())
                        }
                    }
                    
                    Text("$5 for collab?")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundStyle(.white)
                        .lineLimit(2)
                        .frame(maxWidth: UIScreen.main.bounds.width - 100, alignment: .leading)
                    
                    Text("19m")
                        .font(.caption2)
                        .foregroundStyle(.gray)
                }
                
                HStack {
                    Image(systemName: "chevron.right")
                }
                .font(.footnote)
                .foregroundColor(.gray)
            }
            .frame(height: 72)
        }
    }
}

//#Preview {
//    InboxRowView()
//}
