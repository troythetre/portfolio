//
//  Reel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/23.
//

import SwiftUI
import AVKit

struct Reel: Identifiable {
    
    var id = UUID().uuidString
    var player: AVPlayer?
    var mediaFile: MediaFile
}

