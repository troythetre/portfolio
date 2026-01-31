//
//  SidemenuOptionRowView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/18.
//

import SwiftUI

struct SidemenuOptionRowView: View {
    let viewModel: SidemenuViewModel
    var body: some View {
        HStack(spacing: 16) {
            Image(systemName: viewModel.imageName) //displays profile picture
                .font(.headline)
                .foregroundColor(.gray)
            
            Text(viewModel.title) //displays username
                .font(.subheadline)
            
            Spacer()
        }
        .frame(height: 40)
        .padding(.horizontal)
    }
}

struct SidemenuOptionReview_Previews: PreviewProvider {
    static var previews: some View {
        SidemenuOptionRowView(viewModel: .profile)
    }
}
