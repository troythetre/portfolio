//
//  ArtistRecommendation.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/8/13.
//

import Foundation

struct ArtistRecommendation: Identifiable {
    var id = UUID()
    
    let headerImage: String
    let profileImage: String
    let name: String
    let followerCount: Int
    let genre: String
    let songName: String
}

let artist1 = ArtistRecommendation(headerImage: "izaya", profileImage: "ken", name: "Izaya Tiji", followerCount: 6700, genre: "Underground Rap", songName: "I Eat Humans")
let artist2 = ArtistRecommendation(headerImage: "ken", profileImage: "iayze", name: "Iayze", followerCount: 3500, genre: "Underground Rap", songName: "Frostbit")
let artist3 = ArtistRecommendation(headerImage: "iayze", profileImage: "ken", name: "Ken Carson", followerCount: 5300, genre: "Opium", songName: "Succubus")
