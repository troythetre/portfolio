//
//  TikTokUIFeedCell.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/4.
//

import SwiftUI
import AVKit

struct TikTokUIFeedCell: View {
    let video: Video
    var player: AVPlayer
    
    init(video: Video) {
        self.video = video
        self.player = AVPlayer(url: URL(string: video.videoUrl)!)
    }
    
    var body: some View {
        ZStack {
            CustomVideoPlayer(player: player)
                .containerRelativeFrame([.horizontal, .vertical])
            
            VStack {
                Spacer()
                
                HStack(alignment: .bottom) {
                    VStack(alignment: .leading) {
                        Text(video.uid)
                            .fontWeight(.semibold)
                        
                        Text(video.caption!)
                    }
                    .foregroundStyle(.white)
                    .font(.subheadline)
                    
                    Spacer()
                    
                    VStack(spacing: 28) {
                        
                        Circle()
                            .frame(width: 48, height: 48)
                            .foregroundStyle(.gray)
                        
                        Button {
                            
                        } label: {
                            VStack {
                                Image(systemName: "chevron.up")
                                    .resizable()
                                    .frame(width: 20, height: 20)
                                    .foregroundStyle(.white)
                                
                                Spacer()
                                
                                Text("27")
                                    .font(.caption)
                                    .foregroundStyle(.white)
                                    .bold()
                            }
                            
                        }
                        
                        Button {
                            
                        } label: {
                            Image(systemName: "chevron.down")
                                .resizable()
                                .frame(width: 20, height: 20)
                                .foregroundStyle(.white)
                        }
                        
                        Button {
                            
                        } label: {
                            VStack {
                                Image(systemName: "text.bubble")
                                    .resizable()
                                    .frame(width: 28, height: 28)
                                    .foregroundStyle(.white)
                                
                                Text("27")
                                    .font(.caption)
                                    .foregroundStyle(.white)
                                    .bold()
                            }
                        }
                        
                        Button {
                            
                        } label: {
                            VStack {
                                Image(systemName: "bookmark.fill")
                                    .resizable()
                                    .frame(width: 20, height: 28)
                                    .foregroundStyle(.white)
                                
                                Text("27")
                                    .font(.caption)
                                    .foregroundStyle(.white)
                                    .bold()
                            }
                            
                        }
                    }
                }
                .padding(.bottom, 80)
            }
            .padding()
        }
        .onAppear {
            player.play()
        }
        
    }
}

//#Preview {
//    TikTokUIFeedCell(reel: reel)
//}
