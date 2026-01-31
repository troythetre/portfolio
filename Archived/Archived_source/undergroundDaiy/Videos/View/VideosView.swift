////
////  VideosView.swift
////  undergroundDaiy
////
////  Created by Troy Wu on 2024/5/28.
////
//
import SwiftUI
import AVKit

struct VideosView: View {
    
    @ObservedObject var viewModel: VideoObjectViewModel
    
    init(video: Video) {
        self.viewModel = VideoObjectViewModel(video: video)
    }
    
    var body: some View {
        
        VideoPlayer(player: AVPlayer(url: URL(string: viewModel.video.videoUrl)!))
            .scaledToFill()
            .containerRelativeFrame([.horizontal, .vertical])
            .frame(width: 300)
        
        //captions & buttons
        VStack(alignment: .center) {
//            if let user = viewModel.video.user {
//                HStack {
//                    Text(user.fullname)
//                        .fontWeight(.bold)
//                    Text(viewModel.video.caption ?? "")
//                }
//            }
            
            
            
            if let user = viewModel.video.user {
                HStack {
                    Text(user.username)
                        .fontWeight(.bold)
                    Text(viewModel.video.caption ?? "")
                }
            } else {
                HStack {
                    Text(viewModel.video.caption ?? "")
                }
            }
            
            
            
            

            HStack(spacing: 32) {
                Button {
                    viewModel.video.didUpvote ?? false ?
                    viewModel.unlikeVideo() :
                    viewModel.upvoteVideo()
                } label: {
                    Image(systemName: viewModel.video.didUpvote ?? false ? "chevron.up": "chevron.up")
                        .resizable()
                        .font(.subheadline)
                        .foregroundColor(viewModel.video.didUpvote ?? false ? .blue: .white)
                        .frame(width: 16, height: 16)
                    Text("\(viewModel.video.upvote)")
                        .foregroundStyle(.white)
                }

                Button {
                    viewModel.video.didUpvote ?? true ?
                    viewModel.upvoteVideo() :
                    viewModel.unlikeVideo()
                } label: {
                    Image(systemName: "chevron.down")
                        .resizable()
                        .frame(width: 16, height: 16)
                        .foregroundStyle(.white)
                }

                Button {

                } label: {
                    HStack {
                        Image(systemName: viewModel.video.didComment ?? false ? "text.bubble.fill": "text.bubble")
                            .resizable()
                            .frame(width: 20, height: 20)
                            .font(.subheadline)
                            .foregroundColor(viewModel.video.didComment ?? false ? .blue: .white)
                        Text("\(viewModel.video.comment)")
                            .foregroundStyle(.white)
                    }
                }

                Button {
                    viewModel.video.didArchive ?? false ?
                    viewModel.unarchiveVideo() :
                    viewModel.archiveVideo()
                } label: {
                    HStack {
                        Image(systemName: viewModel.video.didArchive ?? false ? "bookmark.fill": "bookmark")
                            .resizable()
                            .frame(width: 16, height: 20)
                            .font(.subheadline)
                            .foregroundColor(viewModel.video.didArchive ?? false ? .yellow: .white)
                        Text("\(viewModel.video.archive)")
                            .foregroundStyle(.white)
                    }
                }
            }
        }
        .font(.subheadline).bold()
        .frame(width: 320, height: 80)
        .foregroundColor(.white)
        .background(
            RoundedRectangle(cornerRadius: 20).stroke(Color.gray, lineWidth: 2).fill(Color.black)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .strokeBorder(Color.black, lineWidth: 2)
        )
    }
}

//#Preview {
//    VideosFeedView()
//}
