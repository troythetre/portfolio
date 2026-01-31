//
//  ArtistCardView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/8/13.
//

import SwiftUI

struct ArtistCardView: View {
//    let artist: ArtistRecommendation
    @GestureState private var dragOffset: CGFloat = 0
    @State private var albumCurrentIndex: Int = 0
    private let albumImages : [String] = ["carti_music_2028", "nmnl", "izaya_tiji"]
    
    let grailsList: [UpcomingRelease] = [
        UpcomingRelease(artistName: "Izaya Tji", albumName: "Izaya flow", image: "izaya"),
        UpcomingRelease(artistName: "Ken Carson", albumName: "Vampire V2", image: "ken"),
        UpcomingRelease(artistName: "Iayze", albumName: "Reverence 4", image: "iayze"),
        UpcomingRelease(artistName: "Izaya Tji", albumName: "I Eat Humans 2", image: "izaya"),
        UpcomingRelease(artistName: "Ken Carson", albumName: "Sydney Sweeney V2", image: "ken"),
    ]
    
    var body: some View {
        GroupBox {
            ScrollView {
                VStack {
                    headerView
                    
                    VStack {
                        Text("Ken Carson")
                            .fontWeight(.bold)
                        Text("Joined Apr.1 2020")
                            .font(.caption)
                    }
                    .frame(alignment: .leading)
                    
                    aoty
                    grails
                    
                    VStack {
                        Text("MUSIC VIDEOS")
                            .font(.title3)
                            .fontWeight(.bold)
    
                        ZStack {
                            ForEach(0..<albumImages.count, id: \.self) { index in
                                Image(albumImages[index])
                                    .frame(width: 320, height: 260)
                                    .cornerRadius(25)
                                    .scaledToFit()
                                    .opacity(albumCurrentIndex == index ? 1.0: 0.5)
                                    .scaleEffect(albumCurrentIndex == index ? 1.2: 0.8)
                                    .offset(x: CGFloat(index - albumCurrentIndex) * 300 + dragOffset, y: 50)
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
                .background(Color(.tertiarySystemFill))
                .cornerRadius(12)
            }
            
        } label: {
            Label("National Anthem: Sydney Sweeney", systemImage: "music.mic")
                .font(.headline)
                .foregroundStyle(.red)
                .fontWeight(.bold)
        }
        .background(Color(.systemGray6))
        
        
    }
}

//#Preview {
//    ArtistCardView()
//}

extension ArtistCardView {
    var headerView: some View {
        ZStack {
            Image("izaya")
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(height: 130)
                .clipped()
            
            Image("ken")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(height: 80)
                .clipShape(Circle())
                .offset(y: 40)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal)
        }
    }
    
    var aoty: some View {
        VStack {
            Text("Albums of All Time")
                .font(.headline)
                .foregroundStyle(.white)
                .fontWeight(.bold)
                .clipShape(Rectangle())
                .cornerRadius(10)
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack {
                    ForEach(0 ..< 8) { index in
                        Image("izaya")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 80, height: 80)
                            .cornerRadius(5)
                        Spacer()
                    }
                }
                .frame(width: .infinity, alignment: .center)
                .padding()
            }
            
            
            
        }
        .clipShape(Rectangle())
        .background(Color(.red).opacity(0.8))
        .cornerRadius(20)
        .padding()
    }
    
    var grails: some View {
        VStack {
            Text("GRAILS")
                .font(.headline)
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack {
                    ForEach(grailsList) { grail in
                        ZStack {
                            RoundedRectangle(cornerRadius: 20)
                                .fill(Color(.orange).opacity(0.3))
                                .frame(width: 240, height: 40)
                            
                            HStack {
                                Image(grail.image)
                                    .resizable()
                                    .scaledToFit()
                                    .frame(width: 40, height: 40)
                                    .cornerRadius(5)
                                
                                Text(grail.albumName)
                                    .font(.title3)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                
                                Image(systemName: "play.circle.fill")
                                    .font(.system(size: 30))
                                    .foregroundStyle(.white)
                            }
                        }
                    }
                }
                .frame(width: .infinity, alignment: .center)
                .padding(.horizontal)
            }
            .frame(height: 100)
            .safeAreaPadding(.horizontal, 32)
            .scrollClipDisabled()
            .scrollTargetBehavior(.paging)
            
            
            
            
        }
        .clipShape(Rectangle())
        .background(Color(.blue).opacity(0.5))
        .cornerRadius(20)
        .padding()
    }
}
