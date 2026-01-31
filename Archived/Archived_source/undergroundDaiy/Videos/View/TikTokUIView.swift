//
//  TikTokUIView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/4.
//

import SwiftUI

struct TikTokUIView: View {
    
    @StateObject var viewModel = VideoViewModel() //calling back end view model
    
    var body: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(viewModel.videos) { video in
                    TikTokUIFeedCell(video: video)
                }
            }
            .scrollTargetLayout()
        }
        .scrollTargetBehavior(.paging)
        .ignoresSafeArea()
    }
}

#Preview {
    TikTokUIView()
}
