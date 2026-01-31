//
//  FeedPostsView.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/24/24.
//

import SwiftUI

struct FeedPostsView: View {
    
    var body: some View {
        VStack {
            ScrollView (.horizontal, showsIndicators: false) {
                HStack(spacing: 15) {
                    ForEach(1...6, id: \.self) { index in
                        Image("MyCampusGym")
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(width: 70, height: 70)
                            .clipShape(Circle())
                    }
                }
            }
        }
    }
}

#Preview {
    FeedPostsView()
}
