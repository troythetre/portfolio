//
//  headline.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/12/30.
//

import Foundation

struct Open: Identifiable, Hashable {
    var id = UUID()
    var title: String
    var artistUsername: String
    var image: String
    var gifUrl: String
}

let opens: [Open] = [
    Open(title: "Asian Rock", artistUsername: "lazerdim700", image: "netalbum", gifUrl: "https://media1.giphy.com/media/GfiH70LJ0QPvGQ7Xhj/giphy.gif?cid=6c09b952pipz2s6h2haq8d75d58unaybk5qv95m03lvo23ud&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g"),
    Open(title: "Rehhab (prod. ok)", artistUsername: "osamason", image: "osamasonheadline", gifUrl: "https://media0.giphy.com/media/k8a7PvG0Emc0jjhixi/giphy.gif?cid=6c09b952q1mz0wzp95fvnqrz53doc0flitv2cqnpyc8bo7is&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g"),
    Open(title: "JT To My Uzi (prod. Yeat)", artistUsername: "izayatiji", image: "izayaheadline", gifUrl: "https://media3.giphy.com/media/vu3b9lOUqsrPEf27FS/giphy.gif"),
]
