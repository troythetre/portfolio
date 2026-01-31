//
//  VideoFeedCellUI.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/28.
//

import SwiftUI
import AVKit

struct VideoFeedCellUI: View {
//    @StateObject var viewModel = VideoViewModel() //calling back end view model
    let video: Video
    var body: some View {
        ZStack {
            Rectangle()
            VideoPlayer(player: AVPlayer(url: URL(string: video.videoUrl)!))
                .containerRelativeFrame([.horizontal, .vertical])
            VStack {
                Spacer()
                
                HStack {
                    VStack(alignment: .leading){
                        Text("carlos.sainz")
                            .fontWeight(.bold)
                        Text("caption type here like 808")
                    }
                    .foregroundStyle(.white)
                    .font(.subheadline)
                    
                    Spacer()
                    
                    HStack(spacing: 16) {
                        Button {
                            
                        } label: {
                            Image(systemName: "chevron.up")
                                .resizable()
                                .frame(width: 16, height: 16)
                                .foregroundStyle(.white)
                        }
                        
                        Button {
                            
                        } label: {
                            Image(systemName: "chevron.down")
                                .resizable()
                                .frame(width: 16, height: 16)
                                .foregroundStyle(.white)
                        }
                        
                        Button {
                            
                        } label: {
                            Image(systemName: "text.bubble")
                                .resizable()
                                .frame(width: 16, height: 16)
                                .foregroundStyle(.white)
                        }
                        
                        Button {
                            
                        } label: {
                            Image(systemName: "bookmark.fill")
                                .resizable()
                                .frame(width: 16, height: 16)
                                .foregroundStyle(.white)
                            
                        }
                        
                        Button {
                            
                        } label: {
                            Image(systemName: "square.and.arrow.up.fill")
                                .resizable()
                                .frame(width: 16, height: 16)
                                .foregroundStyle(.white)
                        }
                    }
                }
                .padding(.bottom, 80)
            }
            .padding()
        }
    }
}

//#Preview {
//    VideoFeedCellUI(video: <#T##Video#>)
//}
