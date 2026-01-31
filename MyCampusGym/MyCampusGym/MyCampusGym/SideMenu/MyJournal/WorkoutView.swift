//
//  WorkoutView.swift
//  MyCampusGym
//
//  Created by Anthony Mendizabal on 10/31/24.
//

import SwiftUI

struct WorkoutView: View {
    @Binding var workouts: [Workout]
    @Binding var showingNewWorkout: Bool
    @Binding var journalService: JournalService
    @State private var workout = Workout(startTime: Date(), endTime: Date(), exercises: [], breakfast: "", lunch: "", dinner: "", snacks: "")
    @State private var isAddingExercise = false
    @EnvironmentObject var viewModel:AuthViewModel

    var body: some View {

        Form {
            Section(header: Text("Workout Details")) {
                DatePicker("Start Time", selection: $workout.startTime, displayedComponents: .hourAndMinute)
                DatePicker("End Time", selection: $workout.endTime, displayedComponents: .hourAndMinute)
            }

            Section(header: Text("Nutrition (Optional)")) {
                TextField("Breakfast", text: $workout.breakfast)
                TextField("Lunch", text: $workout.lunch)
                TextField("Dinner", text: $workout.dinner)
                TextField("Snacks", text: $workout.snacks)
            }

            Section(header: Text("Exercises")) {
                Button("Add Exercise") {
                    isAddingExercise = true
                }
                
                ForEach(workout.exercises) { exercise in
                    VStack(alignment: .leading) {
                        Text(exercise.name).font(.headline)
                        Text("Sets: \(exercise.sets), Reps: \(exercise.reps), Weight: \(exercise.weight) lbs")
                    }
                }
            }
            
            HStack {
                Spacer()
                Button("SAVE WORKOUT") {
                    workouts.append(workout)
                    journalService.createWorkout(uid: viewModel.currentSessionUser?.id ?? "hbvFjTdD7QSs6d8qbBDKc4j7tYb2", workout: workout)
                    workout = Workout(startTime: Date(), endTime: Date(), exercises: [], breakfast: "", lunch: "", dinner: "", snacks: "")
                    showingNewWorkout = false
                }
                Spacer()
            }
        }
        .sheet(isPresented: $isAddingExercise) {
            AddExerciseView(workout: $workout)
        }
    }
}

#Preview {

    @Previewable @State var sampleWorkouts = [Workout]()
    @Previewable @State var showingNewWorkout = true
    @Previewable @State var journalService:JournalService = JournalService()

    WorkoutView(workouts: $sampleWorkouts, showingNewWorkout: $showingNewWorkout, journalService: $journalService)
        .environmentObject(AuthViewModel())

}

