//
//  Workout.swift
//  MyCampusGym
//
//  Created by Anthony Mendizabal on 10/31/24.
//

import SwiftUI
import Foundation

struct Workout: Identifiable {
    let id = UUID()
    var startTime: Date
    var endTime: Date
    var exercises: [Exercise]
    var breakfast: String
    var lunch: String
    var dinner: String
    var snacks: String
}

struct Exercise: Identifiable {
    let id = UUID()
    var name: String
    var sets: Int
    var reps: Int
    var weight: String
}


