//
//  CardModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/8/16.
//

import Foundation
import UIKit
import SwiftUI

struct CardModel: Identifiable {
    var id = UUID().uuidString
    var cardName: String
    var profileIcon: String
    var artistName: String
    var artistGenre: String
    var artistSubDescription: String
    var cardDescription: String
    var category: String
    var bannerTitle: String
    var artwork: String
    var color: Color
}

var cardItems: [CardModel] = [
    CardModel(cardName: "daf", 
              profileIcon: "ken",
              artistName: "Ken Carson",
              artistGenre: "Opium",
              artistSubDescription: "#1 trending in OGM",
              cardDescription: "five extra tracks added including Sydney Sweeney and Leather Jacket",
              category: "New Release",
              bannerTitle: "A Great Chaos (Deluxe)",
              artwork: "agcdeluxe",
              color: Color.gray
             ),
            
    CardModel(cardName: "daf",
              profileIcon: "izaya",
              artistName: "Izaya Tiji",
              artistGenre: "Underground",
              artistSubDescription: "King of the Underground",
              cardDescription: "Top track from Izaya Tiji's community vault",
              category: "Recommended playlist: Unreleased Grail",
              bannerTitle: "Izaya Tiji Flow",
              artwork: "izaya_cover", 
              color: Color.mint
             ),
]
