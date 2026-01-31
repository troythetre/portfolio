//
//  WorkoutDetailView.swift
//  MyCampusGym
//
//  Created by Anthony Mendizabal on 10/31/24.
//

import SwiftUI

struct WorkoutDetailView: View {
    let workout: Workout
    
    var body: some View {
        Form {
            Section(header: Text("Workout Details")) {
                Text("Start Time: \(workout.startTime.formatted())")
                Text("End Time: \(workout.endTime.formatted())")
            }
            
            Section(header: Text("Nutrition")) {
                Text("Breakfast: \(workout.breakfast)")
                Text("Lunch: \(workout.lunch)")
                Text("Dinner: \(workout.dinner)")
                Text("Snacks: \(workout.snacks)")
            }
            
            Section(header: Text("Exercises")) {
                ForEach(workout.exercises) { exercise in
                    VStack(alignment: .leading) {
                        Text(exercise.name).font(.headline)
                        Text("Sets: \(exercise.sets), Reps: \(exercise.reps), Weight: \(exercise.weight) lbs")
                    }
                }
            }
        }
        .navigationTitle("Workout Details")
    }
}


#Preview {
    let sampleWorkout = Workout(
        startTime: Date(),
        endTime: Date(),
        exercises: [
            Exercise(name: "Push-ups", sets: 3, reps: 15, weight: "0"),
            Exercise(name: "Squats", sets: 4, reps: 12, weight: "100")
        ],
        breakfast: "Oatmeal and eggs",
        lunch: "Salad with chicken",
        dinner: "Grilled salmon",
        snacks: "Protein bar"
    )
    
    return WorkoutDetailView(workout: sampleWorkout)
}
