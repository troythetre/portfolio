//
//  AuthenticationHeaderView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/20.
//

import SwiftUI

struct AuthHeaderView: View {
    let title1: String
    let title2: String
    var body: some View {
        //header view
        VStack(alignment: .leading) {
            HStack {
                Spacer()
            }
            
//            Image("logo")
//                .resizable()
//                .frame(width: 400, height: 400)
//                .multilineTextAlignment(.center)
            
            Text(title1)
                .font(.largeTitle)
                .fontWeight(.semibold)
            
            Text(title2)
                .font(.largeTitle)
                .fontWeight(.semibold)
        }
        .frame(height: 260)
        .padding(.leading)
        .background(Color(.black))
        .foregroundColor(.white)
        .clipShape(roundedShape(corners: [.bottomRight]))
    }
}

#Preview {
    AuthHeaderView(title1: "Sign up for registration", title2: "Be a part of the community")
}
