//
//  VideoObjectViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/9.
//

import Foundation

class VideoObjectViewModel: ObservableObject {
    @Published var video: Video //Model - Post
    private let service = VideoService()
    
    init(video: Video) {
        self.video = video //initialize post
        checkIfUserUpvotedVideo()
        checkIfUserArchivedVideo()
    }
    
    func upvoteVideo() {
        service.likedVideo(video) {
            self.video.didUpvote = true
            print("DEBUG: \(self.video.user)")
        }
    }
    
    func unlikeVideo() {
        service.unlikeVideo(video) {
            self.video.didUpvote = false
        }
    }
    
    func archiveVideo() {
        service.archiveVideo(video) {
            self.video.didArchive = true
        }
    }
    
    func unarchiveVideo() {
        service.unarchiveVideo(video) {
            self.video.didArchive = false
        }
    }
    
    func checkIfUserUpvotedVideo() {
        service.checkIfUserUpvotedVideo(video) { didUpvote in
            if didUpvote {
                self.video.didUpvote = true
            }
        }
    }
    
    func checkIfUserArchivedVideo() {
        service.checkIfUserArchivedVideo(video) { didArchive in
            if didArchive {
                self.video.didArchive = true
            }
        }
    }
}
