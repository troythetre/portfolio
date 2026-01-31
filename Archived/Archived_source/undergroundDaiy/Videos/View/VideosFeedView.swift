//
//  VideosFeedView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/25.
//

import SwiftUI
import PhotosUI
import AVKit
import Kingfisher

struct VideosFeedView: View {
    
    @State var player = AVPlayer()
    @State var currentVideo = "" //the video tab user is on
    @StateObject var uploadViewModel = VideoViewModel() //calling back end view model
    
    var body: some View {
        //Setting width and height for rotated view...
        GeometryReader { proxy in
            
            let size = proxy.size
            
            //vertical tab view
            TabView(selection: $currentVideo) {
                ForEach(uploadViewModel.videos) { video in
                    
                    VStack {
                        VideosView(video: video)
                            .onAppear() {
                                player.play()
                            }
                    }
                    .frame(width: size.width)
                    //Rotating content...
                    .rotationEffect(.init(degrees: -90))
                    .ignoresSafeArea(.all, edges: .top)
                }
            }
            //Rotating view..
            .rotationEffect(.init(degrees: 90))
            //since view is rotated setting height as width..
            .frame(width: size.height)
            .tabViewStyle(.page(indexDisplayMode: .never))
            //setting max width...
            .frame(width: size.width)
        }
        .ignoresSafeArea(.all, edges: .top)
        .background(Color.black.ignoresSafeArea())
    }
}

//#Preview {
//    VideosFeedView()
//}
