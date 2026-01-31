//
//  beatRowView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2025/1/6.
//

import SwiftUI
import SDWebImageSwiftUI

struct beatRowView: View {
    @ObservedObject var viewModel: BeatViewModel
    
    init(beat: Beat) {
        self.viewModel = BeatViewModel(beat: beat)
    }
    
    var body: some View {
        HStack(spacing: 12) {
            if let coverArtURL = viewModel.beat.coverArtURL {
                WebImage(url: URL(string: coverArtURL))
                    .resizable()
                    .scaledToFit()
                    .cornerRadius(10)
                    .frame(width: 75, height: 75)
                    .shadow(radius: 10, y: 10)
            }
               
            VStack(alignment: .leading, spacing: 2) {
                MarqueeText(text: viewModel.beat.beatName, uniqueID: viewModel.beat.id!, textColor: .white)
                    .frame(width: 270, height: 20)
                    .padding(.top, 2)
                    .font(.system(size: 16))
                    .fontWeight(.semibold)
                
                HStack {
                    Text("@\(viewModel.beat.username)")
                        .font(.system(size: 14))
                        .foregroundStyle(Color(hex: "#06b9ff"))
                        .lineLimit(1)
                    Spacer()
                    HStack {
                        Image(systemName: "lock.fill")
                            .resizable()
                            .foregroundStyle(.white)
                            .frame(width: 10, height: 12)
                        Text("$\(viewModel.beat.price, specifier: "%.2f")")
                            .font(.system(size: 14))
                            .fontWeight(.bold)
                            .foregroundStyle(.white)
                    }
                    .padding(.horizontal, 14)
                    .padding(.vertical, 4)
                    .background(LinearGradient(
                        gradient: Gradient(colors: viewModel.beat.price > 0
                                           ? [Color(hex: "#ffde59"), Color(hex: "#ff914d")]
                                           : [Color(hex: "#0097b2"), Color(hex: "#7ed957")]),
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ))
                    .clipShape(Capsule())
                    .shadow(radius: 10)
                    .padding(.trailing, 8)
                }
                
                HStack {
                    HStack(spacing: 6) {
                        Image(systemName: "waveform")
                            .resizable()
                            .frame(width: 12, height: 12)
                            .foregroundStyle(.white)
                        Text("\(viewModel.beat.beatStreams)")
                            .foregroundStyle(.white)
                            .font(.system(size: 12))
                        Image(systemName: "circle.fill")
                            .resizable()
                            .frame(width: 2, height: 2)
                            .foregroundStyle(.white)
                        Image(systemName: "heart.fill")
                            .resizable()
                            .frame(width: 10, height: 10)
                            .foregroundStyle(.white)
                        Text("\(viewModel.beat.beatLikes)")
                            .font(.system(size: 12))
                            .foregroundStyle(.white)
                    }
                    
                    Spacer()
                    
                    Image(systemName: "ellipsis")
                        .foregroundStyle(.white)
                        .padding(.trailing, 10)
                }
            }
            .padding(.vertical)
        }
        .padding(.leading, 5)
        
    }
}
