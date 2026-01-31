//
//  UserStatsView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/17.
//

import SwiftUI

struct UserStatsView: View {
    var body: some View {
        HStack (spacing: 24) {
            HStack (spacing: 4) {
                Text("807")
                    .font(.subheadline).bold()
                    .foregroundColor(.white)
                
                Text("Following")
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            
            HStack {
                Text("6.9M")
                    .font(.subheadline)
                    .bold()
                    .foregroundColor(.white)
                
                Text("Followers")
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            
        }
    }
}

#Preview {
    UserStatsView()
}
