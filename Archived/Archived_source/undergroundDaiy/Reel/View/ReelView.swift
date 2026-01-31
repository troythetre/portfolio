//
//  ReelView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/23.
//

import SwiftUI
import AVKit

struct ReelView: View {
    
    @State var currentReel = ""
    
    //Extracting AV Player from media file
    @State var reel = MediaFileJSON.map { item -> Reel in
        
        let url = Bundle.main.path(forResource: item.url, ofType: "mp4") ?? ""
        
        let player = AVPlayer(url: URL(fileURLWithPath: url))
        
        return Reel(player: player, mediaFile: item)
    }
    
    var body: some View {
        
        //setting width and height for rotated view
        GeometryReader { proxy in
            
            let size = proxy.size
            
            //vertical page tab view
            TabView(selection: $currentReel) {
                
                ForEach($reel) { $reel in
                    
                    //ReelPlayer(reel: $reel)
                    //setting width
//                    .frame(width: size.width)
//                    .padding()
//                    //Rotating content
//                    .rotationEffect(.init(degrees: -90))
                }
            }
            //rotating view..
            .rotationEffect(.init(degrees: 90))
            //since view is rotated setting height as width
            .frame(width: size.height)
            .tabViewStyle(.page(indexDisplayMode: .never))
            //setting max width
            .frame(width: size.width)
        }
        
    }
}

#Preview {
    ReelView()
}

struct ReelPlayer {
    
    @Binding var reel: Reel
    
    var body: some View {
        
        VStack {
            
            Text("Hello")
            
            Spacer()
            
            Text("Hello")
                .frame(maxWidth: .infinity, alignment: .leading)
        }
    }
}
