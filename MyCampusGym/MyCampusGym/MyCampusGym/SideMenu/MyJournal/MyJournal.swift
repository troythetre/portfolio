//
//  MyJournal.swift
//  MyCampusGym
//
//  Created by Anthony Mendizabal on 10/31/24.
//

import SwiftUI

struct MyJournalView: View {
    @EnvironmentObject var viewModel: AuthViewModel
    @State var workouts: [Workout] = [Workout]()
    @State private var showingNewWorkout = false
    @State var journalService:JournalService = JournalService()
    
    var body: some View {
        NavigationView {
            List{
                Button("Add New Workout") {
                    showingNewWorkout = true
                }
                if(workouts.count > 0) {
                    ForEach(workouts) { workout in
                        
                        NavigationLink(destination: WorkoutDetailView(workout: workout)) {
                            VStack(alignment: .leading) {
                                Text("Workout on \(workout.startTime.formatted())").font(.headline)
                                Text("Exercises: \(workout.exercises.count)")
                            }
                        }
                    }
                }
            }
            .navigationTitle("My Journal")
            .sheet(isPresented: $showingNewWorkout) {
                WorkoutView(workouts: $workouts, showingNewWorkout: $showingNewWorkout, journalService: $journalService).environmentObject(viewModel)
            }.onAppear {
                journalService.getWorkouts(uid: viewModel.currentSessionUser?.id ?? "hbvFjTdD7QSs6d8qbBDKc4j7tYb2") { w in
                    if !w.isEmpty {
                        workouts = w
                    }
                }
            }
        }
    }
}

#Preview {
    
    MyJournalView()
        .environmentObject(AuthViewModel())

}
