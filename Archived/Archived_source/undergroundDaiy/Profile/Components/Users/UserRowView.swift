//
//  UserRowView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/17.
//

import SwiftUI
import Kingfisher

struct UserRowView: View {
    
    let user: AppUser
    
    var body: some View {
        HStack(spacing: 12) {
            KFImage(URL(string: user.profileImageUrl))
                .resizable()
                .scaledToFill()
                .clipShape(/*@START_MENU_TOKEN@*/Circle()/*@END_MENU_TOKEN@*/)
                .frame(width: 56, height: 56)
          
            VStack {
                Text(user.username)
                    .font(.subheadline).bold()
                    .foregroundColor(.white)
                
                Text(user.fullname)
                    .font(.subheadline)
                    .foregroundColor(.gray)
            }
            
            Spacer()
        }
        .padding(.horizontal)
        .padding(.vertical, 4)
    }
}

//#Preview {
//    UserRowView()
//}
