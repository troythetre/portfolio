//
//  FeedPostView.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/24/24.
//

import SwiftUI

struct FeedPostView: View {
    
    var feedPost:FeedPost
    
    var body: some View {
            
        HStack {
            VStack(alignment: .leading) {
                Text(feedPost.headline)
                    .font(.system(size: 20))
                    .fontWeight(.bold)
                    .foregroundColor(.primary)
                    .padding(.top, 10)
                
                Text((feedPost.postDate?.formatted(date: .numeric, time: .omitted))!)
                    .font(.system(size: 15))
                    .fontWeight(.bold)
                    .foregroundColor(.primary)
                    .padding(.bottom, 10)
                
                Divider()
            }
            Spacer()
        }
    }
}

#Preview {
    FeedPostView(feedPost: FeedPost(headline: "Test Headline"))
}
