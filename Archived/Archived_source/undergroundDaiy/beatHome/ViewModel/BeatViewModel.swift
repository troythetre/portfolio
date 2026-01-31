//
//  BeatViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2025/3/10.
//

import Foundation

class BeatViewModel: ObservableObject {
    @Published var beat: Beat
    private let service = BeatService()
    
    init(beat: Beat) {
        self.beat = beat
        checkIfUserLikedBeat()
        checkIfUserArchivedBeat()
    }
    
    func likeBeat() {
        service.likeBeat(beat) {
            self.beat.didLike = true
        }
    }
    
    func unlikeBeat() {
        service.unlikeBeat(beat) {
            self.beat.didLike = false
        }
    }
    
    func archiveBeat() {
        service.archiveBeat(beat) {
            self.beat.didArchive = true
        }
    }
    
    func unarchiveBeat() {
        service.unarchiveBeat(beat) {
            self.beat.didArchive = false
        }
    }
    
    func checkIfUserLikedBeat() {
        service.checkIfUserLikedBeat(beat) { didLike in
            if didLike {
                self.beat.didLike = true
            }
        }
    }
    
    func checkIfUserDislikedBeat() {
        service.checkIfUserLikedBeat(beat) { didLike in
            if !(didLike) {
                self.beat.didLike = false
            }
        }
    }
    
    func checkIfUserArchivedBeat() {
        service.checkIfUserArchivedBeat(beat) { didArchive in
            if didArchive {
                self.beat.didArchive = true
            }
        }
    }
}
