//
//  Color.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2025/1/8.
//

import SwiftUI

extension Color {
    // Initialize Color with hex string (e.g., "#FF5733")
    init(hex: String) {
        var hexSanitized = hex.hasPrefix("#") ? String(hex.dropFirst()) : hex
        
        // Make sure it's a valid 6-digit hex (RGB)
        guard hexSanitized.count == 6 else {
            self.init(.gray)  // Default to gray if the hex code is invalid
            return
        }
        
        let scanner = Scanner(string: hexSanitized)
        var rgb: UInt64 = 0
        scanner.scanHexInt64(&rgb)
        
        let r = Double((rgb & 0xFF0000) >> 16) / 255.0
        let g = Double((rgb & 0x00FF00) >> 8) / 255.0
        let b = Double(rgb & 0x0000FF) / 255.0
        
        self.init(red: r, green: g, blue: b)
    }
}
