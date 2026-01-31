//
//  MediaFile.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/23.
//

import SwiftUI

//Sample Model and Reel Videos

struct MediaFile: Identifiable {
    var id = UUID().uuidString
    var url: String
    var title: String
    var isExpanded: Bool = false
}

var MediaFileJSON = [
    
    MediaFile(url: "osamason", title: "lil o's snippet"),
    MediaFile(url: "keef", title: "love sosa.."),
    MediaFile(url: "izaya", title: "king of underground"),
    MediaFile(url: "summrs", title: "bird business.."),

]
