//
//  VideoTestViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/25.
//

import Foundation
import SwiftUI
import PhotosUI
import Firebase
import FirebaseFirestoreSwift

class VideoViewModel: ObservableObject {
    
    @Published var videos = [Video]()
    private let service = VideoService()
    
    @Published var selectedItem: PhotosPickerItem? {
        didSet { Task { try await uploadVideo() } }
    }
    
    init() {
        Task { try await fetchVideo() }
    }
    
    func uploadVideo() async throws {
        
//        let caption = await VideoTestView.$caption
        
        guard let uid = Auth.auth().currentUser?.uid else { return }
    
        guard let item = selectedItem else { return }
        guard let videoData = try await item.loadTransferable(type: Data.self) else { return }
        
        guard let videoUrl = try await VideoUploader.uploadVideo(withData: videoData) else { return }
        
        let data = ["uid": uid,
                    "videoUrl": videoUrl,
//                    "caption": caption,
                    "upvote": 0,
                    "comment": 0,
                    "archive": 0,
                    "share": 0,
                    "timestamp": Timestamp(date: Date())] as [String: Any] //add archives, comments, post media
        //data to display
        
        Firestore.firestore().collection("videos").document()
            .setData(data) { error in
                if let error = error {
                    print("DEBUG: Failed to upload post with error: \(error.localizedDescription)")
                }
            }
        //writes data into firestore /communityPosts/uid/content
    }
    
    @MainActor
    func fetchVideo() async throws {
        let snapshot = try await Firestore.firestore().collection("videos").getDocuments()
        self.videos = snapshot.documents.compactMap({ try? $0.data(as: Video.self) })
    }
    
    
}
