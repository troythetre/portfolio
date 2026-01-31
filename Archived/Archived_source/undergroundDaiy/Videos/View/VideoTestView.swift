//
//  VideoTestView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/25.
//

import SwiftUI
import PhotosUI
import AVKit //videoplayer
import Kingfisher


struct VideoTestView: View {
    
    @State static var caption = ""
    @State static var tag = ""
    @State static var sound = ""
    
    @StateObject var viewModel = VideoViewModel() //calling view model for backend implementation
    @Environment(\.presentationMode) var presentationMode
    @EnvironmentObject var authViewModel: AuthViewModel
    
    var body: some View {
        VStack(alignment: .leading) {
            VStack {
                TextField("Enter video caption", text: VideoTestView.$caption)
                    .font(.subheadline)
                    .padding(12)
                    .background(Color(.systemGray6))
                    .cornerRadius(10)
                    .padding(.horizontal, 24)
                
                TextField("Enter tag", text: VideoTestView.$tag)
                    .font(.subheadline)
                    .padding(12)
                    .background(Color(.systemGray6))
                    .cornerRadius(10)
                    .padding(.horizontal, 24)
                
                TextField("Enter tag", text: VideoTestView.$sound)
                    .font(.subheadline)
                    .padding(12)
                    .background(Color(.systemGray6))
                    .cornerRadius(10)
                    .padding(.horizontal, 24)
                
                Button {
                    
                } label: {
                    Text("Finish Upload Video")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .padding(12)
                        .foregroundColor(.white)
                        .frame(width: 360, height: 44)
                        .background(Color(.systemBlue))
                        .cornerRadius(10)
                }
            }
                
            
        }
        .navigationTitle("Upload Video")
        .navigationBarTitleDisplayMode(.large)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                PhotosPicker(selection: $viewModel.selectedItem,
                             matching: .any(of: [.videos, .not(.images)])) {
                    Image(systemName: "plus")
                        .foregroundColor(.white)
                }
            }
        }
    }
}
            
        
                
        
            
                
//            ScrollView {
//                ForEach(viewModel.videos) { video in
//                    VideoPlayer(player: AVPlayer(url: URL(string: video.videoUrl)!)) //video to display
//                        .frame(height: 250)
//                }
//            }
            


#Preview {
    VideoTestView()
}
