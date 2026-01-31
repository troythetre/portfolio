//
//  Product.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/7/19.
//

import Foundation

struct Product: Identifiable {
    var id = UUID()
    var name: String
    var image: String
    var price: Int
    var description: String
    var date: String
    var category: String
}

var productList = [Product(name: "Ken Carson concert shirt", image: "item1", price: 150, description: "Ken Carson concert shirt", date: "07-19-2023", category: "streetwear"),
                   Product(name: "Destroy Lonely worn Balenciaga Boots", image: "item2", price: 800, description: "Destroy Lonely worn Balenciaga Boots", date: "07-19-2023", category: "outerwear"),
                   Product(name: "RR## tray", image: "item3", price: 80, description: "RR## tray", date: "07-19-2023", category: "trending"),
                   Product(name: "Lil Uzi Vert throwback shirt", image: "item4", price: 350, description: "Lil Uzi Vert throwback shirt", date: "07-19-2023", category: "merch"),
                   Product(name: "That's an Awful Lot of Cough Syrup jeans", image: "item5", price: 600, description: "That's an Awful Lot of Cough Syrup jeans", date: "07-19-2023", category: "bundle"),
                   Product(name: "RR casual shirt", image: "item6", price: 60, description: "RR casual shirt", date: "07-19-2023", category: "streetwear"),
                   Product(name: "Summrs Polaroid", image: "item7", price: 100, description: "Summrs Polaroid", date: "07-19-2023", category: "outerwear"),
                   Product(name: "Rick Owens shirt", image: "item8", price: 950, description: "Rick Owens shirt", date: "07-19-2023", category: "trending"),
                   Product(name: "Matthew Williams x Givenchy jeans", image: "item9", price: 3000, description: "Matthew Williams x Givenchy jeans", date: "07-19-2023", category: "trending"),
]
