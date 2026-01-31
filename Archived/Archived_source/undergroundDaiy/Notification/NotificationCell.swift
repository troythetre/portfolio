//
//  NotificationCell.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/12.
//

import SwiftUI
import Kingfisher

struct NotificationCell: View {
    
//    @ObservedObject var viewModel: ProfileViewModel
    
    var body: some View {
        HStack {
//            KFImage(URL(string: viewModel.user.profileImageUrl))
            Image(systemName: "person.crop.circle")
                .resizable()
                .frame(width: 28, height: 28)
            
            HStack {
                Text("808 archive")
                    .font(.footnote)
                    .fontWeight(.semibold) +
                Text(" liked one of your posts")
                    .font(.footnote) +
                
                Text("  6 hrs ago")
                    .font(.caption)
                    .foregroundStyle(.gray)
            }
            
            Spacer()
            
            Rectangle()
                .frame(width: 48, height: 48)
                .clipShape(RoundedRectangle(cornerRadius: 6))
        }
        .padding(.horizontal)
    }
}

#Preview {
    NotificationCell()
}
