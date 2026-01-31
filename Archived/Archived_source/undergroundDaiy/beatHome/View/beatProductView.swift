//
//  beatProductView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2025/1/6.
//

import SwiftUI
import SDWebImageSwiftUI
import AVFoundation
import Firebase
import FirebaseFirestore

struct beatProductView: View {
    @ObservedObject var viewModel: BeatViewModel
    @ObservedObject var commentService: CommentService
    @State private var newCommentText = ""
    
    @State private var showOfferPage = false // State to control navigation
    @State private var audioPlayer: AVAudioPlayer?
    @State private var isPlaying = false
    @State private var currentTime: TimeInterval = 0.0  // State to track current time of audio
    
    init(beat: Beat, commentService: CommentService) {
        self.viewModel = BeatViewModel(beat: beat)
        self._commentService = ObservedObject(wrappedValue: commentService)
    }
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .center, spacing: 5) {
                    beatArt
                    VStack {
                        audioControls //Add audio controls here
                        actionButtons
                        producerAbout
                    }
                    .background(
                        LinearGradient(
                            gradient: Gradient(colors: [.gray, .black]), // White at the top, black at the bottom
                            startPoint: .top,                            // Gradient starts at the top
                            endPoint: .bottom                            // Gradient ends at the bottom
                        )
                        .edgesIgnoringSafeArea(.all)
                    )
                    
                    
                    VStack { // comment section
                        HStack {
                            Text("View all \(commentService.comments.count) comments")
                                .font(.system(size: 12))
                                .foregroundStyle(.gray)
                            Image(systemName: "chevron.down")
                                .resizable()
                                .frame(width: 12, height: 6)
                                .foregroundStyle(.gray)
                            Spacer()
                        }
                        .padding(.bottom, 16)

                        LazyVStack {
                            ForEach(commentService.comments) { comment in
                                commentRow(comment: comment)
                            }
                        }

                        HStack(alignment: .center, spacing: 8) {
                            TextField("Add a comment...", text: $newCommentText)
                                .padding(5)
                                .background(Color(.systemGray6))
                                .cornerRadius(20)
                                .padding(.leading, 16)

                            Button(action: {
                                // Make sure there's content in the comment and a valid beat ID
                                guard !newCommentText.isEmpty, let beatID = viewModel.beat.id else { return }
                                
                                // Post the comment and reset the input
                                commentService.addComment(toBeatID: beatID, text: newCommentText) {
                                    newCommentText = "" // Reset text after posting
                                }
                            }) {
                                // Define the button label explicitly using Text view
                                Image(systemName: "arrow.up.circle.fill")
                                    .font(.system(size: 20))
                                    .foregroundColor(.blue)
                            }
                            .padding(.trailing, 24)
                        }
                        .padding(.vertical, 10)
                    }
                    .padding(.leading, 6) //comment section
                    
                    VStack {
                        Divider()
                            .padding(.vertical, 8)
                        
                        VStack(alignment: .leading) {
                            Text("Similar sounds")
                                .font(.system(size: 14))
                                .fontWeight(.semibold)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding(.bottom, 8)
                        }
                        
                                           
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 40) {
                                ForEach(0..<5) { _ in
                                    similarSound
                                }
                            }
                        }
                        .padding(.bottom, 4)
                        
//                        LazyVStack(spacing: 4) {
//                            ForEach(beats, id: \.id) { beat in
//                                NavigationLink {
//                                    beatProductView(beat: beat)
//                                } label: {
//                                    beatRowView(beat: beat)
//                                }
//                            }
//                        }
                    }
                    .padding(.top, 16)
                }
                .frame(maxHeight: .infinity, alignment: .top)
                .padding()
            }
            .toolbar {
                        ToolbarItem(placement: .navigationBarTrailing) {
                            NavigationLink(destination: OfferView()) { // Navigate to OfferPage
                                Text("Offer")
                                    .font(.system(size: 16))
                                    .foregroundStyle(.white)
                                    .fontWeight(.bold)
                                    .padding(.horizontal, 20)
                                    .padding(.vertical, 2)
                                    .overlay(
                                        Capsule()
                                            .stroke(LinearGradient(
                                                gradient: Gradient(colors: [Color(hex: "#0097b2"), Color(hex: "#7ed957")]),
                                                startPoint: .topLeading,
                                                endPoint: .bottomTrailing
                                            ), lineWidth: 6)
                                    )
                                    .cornerRadius(10)
                                }
                            }
                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button(action: {
                                    print("Leading button tapped!")
                                }) {
                                    HStack {
                                        Image(systemName: "lock.fill")
                                            .resizable()
                                            .frame(width: 10, height: 12)
                                        Text("$0.99")
                                            .font(.system(size: 16))
                                            .fontWeight(.semibold)
                                    }
                                    .foregroundStyle(.white)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 2)
                                    .background(LinearGradient(
                                        gradient: Gradient(colors: [Color(hex: "#0097b2"), Color(hex: "#7ed957")]),
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    ))
                                    .clipShape(Capsule())
                                }
                            }
                        }
        }
        .onAppear {
            setUpAudio()
            commentService.fetchComments(forBeatID: viewModel.beat.id!)
        }
        
    }
}

extension beatProductView {
    
    var beatArt: some View {
        ZStack(alignment: .topLeading) {
            WebImage(url: URL(string: viewModel.beat.coverArtURL!))
                .resizable()
                .frame(width: 440, height: 400)
                
            
            VStack(alignment: .leading, spacing: 2) {
                Text(viewModel.beat.beatName)
                    .font(.headline)
                    .fontWeight(.bold)
                    .padding(.horizontal, 10)
                    .background(.black)
                HStack {
                    Image(systemName: "calendar")
                    Text("September 25, 2024")
                        .foregroundStyle(.gray)
                        .font(.footnote)
                }
                .padding(.horizontal, 10)
                .background(.black)
                .padding(.bottom, 20)
                
                Text("0:30 / 1:34")
                    .font(.caption)
                    .fontWeight(.bold)
                    .padding(.horizontal, 10)
                    .background(.black)
            }
            .padding(.leading, 10)
            .padding(.vertical, 15)
            
            WaveformView(audioPlayer: $audioPlayer, currentTime: $currentTime)
                .padding(.vertical, 8)
                .frame(width: 440, height: 100) // Adjust the height of the waveform overlay as needed
                .background(Color.black.opacity(0.5)) // Optional: Add a semi-transparent background to the waveform
                .clipShape(RoundedRectangle(cornerRadius: 10))
                .padding(.top, 270) // Adjust this to position the waveform properly on the beat art
        }
    }
    
    func setUpAudio() {
        guard let url = URL(string: viewModel.beat.fileURL), UIApplication.shared.canOpenURL(url) else {
            print("Invalid or inaccessible audio URL")
            return
        }
        do {
            let data = try Data(contentsOf: url) // Fetch audio data
            print("Audio data fetched successfully")
            audioPlayer = try AVAudioPlayer(data: data)
            audioPlayer?.prepareToPlay()
        } catch {
            print("Failed to initialize audio player: \(error)")
        }
    }
    
    var audioControls: some View { 
        HStack {
            Button(action: togglePlayPause) {
                Image(systemName: isPlaying ? "pause.circle.fill" : "play.circle.fill")
                    .resizable()
                    .frame(width: 50, height: 50)
                    .foregroundStyle(.white)
            }
            .padding(.horizontal, 10)

            Text(isPlaying ? "Playing..." : "Paused")
                .font(.headline)
                .foregroundStyle(.white)
        }
        .padding(.vertical, 10)
    }
    
    func togglePlayPause() {
        guard let player = audioPlayer else {
            print("Audio player is not initialized")
            return
        }
        print("Audio player initialized successfully")
        print("Current playback state: \(player.isPlaying)")
        if player.isPlaying {
            player.pause()
            isPlaying = false
        } else {
            player.play()
            isPlaying = true
        }
    }
    
    var actionButtons: some View {
        HStack {
            HStack {
                Image(systemName: "waveform")
                    .resizable()
                    .frame(width: 16, height: 16)
                Text("\(viewModel.beat.beatStreams)")
                    .font(.system(size: 12))
                    .foregroundStyle(.white)
            }
    
            Spacer()
            
            Button {
                if viewModel.beat.didLike ?? false {
                    viewModel.unlikeBeat()
                } else {
                    viewModel.likeBeat()
                }
            } label: {
                HStack {
                    Image(systemName: viewModel.beat.didLike ?? false ? "heart.fill": "heart")
                        .resizable()
                        .frame(width: 16, height: 16)
                        .foregroundStyle(.red)
                    Text("\(viewModel.beat.beatLikes)")
                        .font(.system(size: 12))
                        .foregroundStyle(.white)
                }
            }
            
            Spacer()
            
            Button {
                viewModel.beat.didArchive ?? false ?
                viewModel.unarchiveBeat() :
                viewModel.archiveBeat()
            } label: {
                Image(systemName: viewModel.beat.didArchive ?? false ? "bookmark.fill": "bookmark")
                    .resizable()
                    .frame(width: 14, height: 16)
            }
            
            Spacer()
            
            Image(systemName: "paperplane")
                .resizable()
                .frame(width: 16, height: 16)
            
            Spacer()
            
            HStack {
                Image(systemName: "ellipsis")
                    .resizable()
                    .frame(width: 16, height: 4)
            }
        }
        .frame(maxWidth: .infinity, alignment: .center)
        .padding()
        .padding(.horizontal, 8)
    }
    
    var producerAbout: some View {
        HStack {
            WebImage(url: URL(string: viewModel.beat.userProfilePicture))
                .resizable()
                .scaledToFill()
                .frame(width: 120, height: 120)
                .clipShape(.circle)
                .shadow(radius: 10)
            
            VStack(alignment: .leading, spacing: 8) {
                Text("@\(viewModel.beat.username)")
                    .font(.headline)
                    .foregroundStyle(Color(hex: "#06b9ff"))
                Text("Producer")
                    .font(.subheadline)
                    .padding(.horizontal, 12)
                    .overlay(
                        Capsule()
                            .stroke(LinearGradient(
                                gradient: Gradient(colors: [Color(hex: "#5de0e6"), Color(hex: "#004aad")]),
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ), lineWidth: 2) // Hollow capsule with a stroke
                    )
                HStack {
                    Image(systemName: "person.fill")
                        .foregroundStyle(.white)
                        .frame(width: 8, height: 8)
                    Text("583 followers")
                        .font(.system(size: 12))
                        .foregroundStyle(.white)
                }
                HStack {
                    Text("Contact producer..")
                        .font(.system(size: 12))
                    Image(systemName: "message.fill")
                        .resizable()
                        .frame(width: 12, height: 12)
                        .foregroundStyle(Color(hex: "#06b9ff"))
                    
                }
                .padding(.horizontal, 8)
                .background(.gray)
                .clipShape(Capsule())

            }
            
            Spacer()
        }
        .padding(.bottom, 8)
    }
    
    func commentRow(comment: Comment) -> some View {
        HStack {
            WebImage(url: URL(string: comment.userProfilePicture))
                .resizable()
                .scaledToFill()
                .frame(width: 40, height: 40)
                .clipShape(.circle)
                .shadow(radius: 5)

            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text("@\(comment.username)")
                        .font(.system(size: 14))
                        .foregroundStyle(Color(hex: "#06b9ff"))
                    Text(comment.timestamp.formatted(date: .abbreviated, time: .shortened))
                        .font(.system(size: 12))
                        .foregroundStyle(.gray)
                }

                Text(comment.text)
                    .font(.system(size: 12))
                    .foregroundStyle(.white)
            }
            Spacer()
        }
        .padding(.bottom, 4)
    }
    
    var comment: some View {
        HStack {
            WebImage(url: URL(string: viewModel.beat.userProfilePicture))
                .resizable()
                .scaledToFill()
                .frame(width: 40, height: 40)
                .clipShape(.circle)
                .shadow(radius: 10)
            
            VStack {
                HStack {
                    Text("@\(viewModel.beat.username)")
                        .font(.system(size: 14))
                        .font(.headline)
                        .foregroundStyle(Color(hex: "#06b9ff"))
                    Text("30m ago")
                        .font(.system(size: 12))
                        .foregroundStyle(.gray)
                    
                    Spacer()
                }
                
                HStack {
                    Text("Wow, this only a buck")
                        .font(.system(size: 12))
                        .foregroundStyle(.white)
                    
                    Spacer()
                }
            }
            Spacer()
        }
        .padding(.leading, 10)
    }
    
    var similarSound: some View {
        VStack(alignment: .center, spacing: 8) {
            // Centered Circular Image
            WebImage(url: URL(string: viewModel.beat.userProfilePicture))
                .resizable()
                .scaledToFill()
                .frame(width: 140, height: 140)
                .clipShape(Circle())
                .shadow(radius: 5)

            // Text and details aligned to the left
            VStack(alignment: .leading, spacing: 4) {
                // Username
                Text("@\(viewModel.beat.username)")
                    .font(.system(size: 14))
                    .fontWeight(.semibold)
                    .foregroundStyle(Color(hex: "#06b9ff"))
                    .lineLimit(1)

                // Producer Label
                Text("Producer")
                    .font(.system(size: 10))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .overlay(
                        Capsule()
                            .stroke(LinearGradient(
                                gradient: Gradient(colors: [Color(hex: "#5de0e6"), Color(hex: "#004aad")]),
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ), lineWidth: 1)
                    )
                    .lineLimit(1)

                // Follower Count
                HStack(spacing: 4) {
                    Image(systemName: "person.fill")
                        .resizable()
                        .frame(width: 10, height: 10)
                        .foregroundStyle(.gray)
                    Text("583 followers")
                        .font(.system(size: 10))
                        .foregroundStyle(.gray)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading) // Align text to the left
            .padding(.leading, 10)
        }
        .frame(width: 120) // Ensure a fixed width
    }
}



