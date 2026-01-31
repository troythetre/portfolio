//
//  ViewA.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/12.
//

import SwiftUI
import AVKit
import Kingfisher

struct RadioView: View {
    
    @State private var searchedText = ""
    
    @State private var artistCurrentIndex: Int = 0
    @GestureState private var dragOffset: CGFloat = 0
    private let artistImages : [String] = ["izaya", "iayze", "ken"]
    
    @State private var albumCurrentIndex: Int = 0
    private let albumImages : [String] = ["carti_music_2028", "nmnl", "izaya_tiji"]
    
    var body: some View {
        NavigationStack {
            Spacer()
            HStack {
                TextField("Search on 808archive", text: $searchedText)
                    .font(.subheadline)
                    .padding(20)
                    .background(Color(.systemGray6))
                    .cornerRadius(10)
                    .padding(.horizontal, 24)
            }
            .padding(.vertical)
            
            ScrollView {
                LazyVStack(alignment: .center) {
                    artistRanking
                    albumRanking
                }
            }
        }
        .navigationTitle("Radio").font(.headline).fontWeight(.bold)
        .foregroundColor(.white)
        .navigationBarTitleDisplayMode(.large)
    }
}
                
extension RadioView {
    var artistRanking: some View {
        VStack {
            Text("Artists Ranking")
                .font(.title)
                .fontWeight(.bold)
                .font(.system(size: 24))
                .position(x: 160, y: 12)
            
            ZStack {
                ForEach(0..<artistImages.count, id: \.self) { index in
                    Image(artistImages[index])
                        .frame(width: 200, height: 360)
                        .cornerRadius(25)
                        .scaledToFit()
                        .opacity(artistCurrentIndex == index ? 1.0: 0.5)
                        .scaleEffect(artistCurrentIndex == index ? 1.2: 0.8)
                        .offset(x: CGFloat(index - artistCurrentIndex) * 300 + dragOffset, y: 50)
                }
            }
            .gesture(
                DragGesture()
                    .onEnded({ value in
                        let threshold: CGFloat = 50
                        if value.translation.width > threshold {
                            withAnimation {
                                artistCurrentIndex = max(0, artistCurrentIndex - 1)
                            }
                        } else if value.translation.width < -threshold {
                            withAnimation {
                                artistCurrentIndex = min(artistImages.count - 1, artistCurrentIndex + 1)
                            }
                        }
                    })
            )
        }
    }
    
    var albumRanking: some View {
        VStack {
            Text("Album Ranking")
                .font(.title)
                .fontWeight(.bold)
                .font(.system(size: 24))
                .position(x: 160, y: 120)
            
            ZStack {
                ForEach(0..<albumImages.count, id: \.self) { index in
                    Image(albumImages[index])
                        .frame(width: 300, height: 300)
                        .cornerRadius(25)
                        .opacity(albumCurrentIndex == index ? 1.0: 0.5)
                        .scaleEffect(albumCurrentIndex == index ? 1.2: 0.8)
                        .offset(x: CGFloat(index - albumCurrentIndex) * 300 + dragOffset, y: 140)
                }
            }
            .gesture(
                DragGesture()
                    .onEnded({ value in
                        let threshold: CGFloat = 50
                        if value.translation.width > threshold {
                            withAnimation {
                                albumCurrentIndex = max(0, albumCurrentIndex - 1)
                            }
                        } else if value.translation.width < -threshold {
                            withAnimation {
                                albumCurrentIndex = min(albumImages.count - 1, albumCurrentIndex + 1)
                            }
                        }
                    })
            )
        }
    }
}
