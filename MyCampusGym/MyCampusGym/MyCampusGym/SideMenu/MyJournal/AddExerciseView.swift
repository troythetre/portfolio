//
//  AddExerciseView.swift
//  MyCampusGym
//
//  Created by Anthony Mendizabal on 10/31/24.
//

import SwiftUI

struct AddExerciseView: View {
    @Binding var workout: Workout
    @State private var exerciseName: String = ""
    @State private var sets: String = ""
    @State private var reps: String = ""
    @State private var weight: String = ""
    @Environment(\.presentationMode) var presentationMode

    var body: some View {
        Form {
            TextField("Exercise Name", text: $exerciseName)
            
            TextField("Sets", text: $sets)
                .keyboardType(.numberPad)
            TextField("Reps", text: $reps)
                .keyboardType(.numberPad)
            TextField("Weight (lbs)", text: $weight)
                .keyboardType(.decimalPad)
            
            Button("Add Exercise") {
                if let setsInt = Int(sets), let repsInt = Int(reps), let weightDouble = Double(weight) {
                    let formattedWeight = weightDouble == floor(weightDouble) ? "\(Int(weightDouble))" : String(format: "%.1f", weightDouble)
                    let newExercise = Exercise(name: exerciseName, sets: setsInt, reps: repsInt, weight: formattedWeight)
                    workout.exercises.append(newExercise)
                    presentationMode.wrappedValue.dismiss()
                }
            }
        }
        .navigationTitle("Add Exercise")
    }
}


#Preview {
    let sampleWorkout = Workout(
        startTime: Date(),
        endTime: Date(),
        exercises: [],
        breakfast: "",
        lunch: "",
        dinner: "",
        snacks: ""
    )
     
    AddExerciseView(workout: .constant(sampleWorkout))
    
}

