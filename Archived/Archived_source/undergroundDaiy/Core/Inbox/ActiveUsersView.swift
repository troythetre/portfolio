//
//  ActiveUsersView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/10.
//

import SwiftUI
import Kingfisher

struct ActiveUsersView: View {
    
    @ObservedObject var viewModel = ExploreViewModel()
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 32) {
                ForEach(viewModel.searchableUser) { user in
                    VStack {
                        ZStack(alignment: .bottomTrailing) {
                            CircularProfileView(size: .large, user: user)
                            
                            ZStack {
                                Circle()
                                    .fill(.white)
                                    .frame(width: 18, height: 18)
                                Circle()
                                    .fill(Color(.systemGreen))
                                    .frame(width: 12, height: 12) //online status dot
                            }
                        }
                        
                        Text(user.username)
                            .font(.subheadline)
                            .foregroundColor(.white)
                            .fontWeight(.semibold)
                    }
                }
            }
            .padding()
        }
        .frame(height: 106)
    }
}

#Preview {
    ActiveUsersView()
}
