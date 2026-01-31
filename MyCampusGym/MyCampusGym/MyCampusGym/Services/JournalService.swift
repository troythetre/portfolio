//
//  JournalService.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/10/24.
//

import SwiftUI
import Foundation
import FirebaseFirestore

class JournalService {
    
    let db = Firestore.firestore()
    
    func getWorkouts(uid:String, completion: @escaping ([Workout]) -> Void) {
        if(uid != "") {
            
            db.collection("workouts")
                .whereField("uid", isEqualTo: uid)
                .order(by: "startTime", descending: true)
                .getDocuments(source: .server) { (snapshot, error) in
                    if let error = error {
                        print("Error getting documents js24: \(error)")
                        return
                    }
                    
                    guard let documents = snapshot?.documents else {
                        print("No documents found")
                        return
                    }
                    
                    let workouts: [Workout] = documents.compactMap { (workout) -> Workout? in
                        let data = workout.data()
                        
                        // Extract and parse the skills map
                        guard let exerciseMap = data["exercises"] as? [[String: Any]] else {
                            print("Missing or invalid exercises in document: \(workout.documentID)")
                            return nil
                        }
                        
                        let exercises: [Exercise] = exerciseMap.compactMap { value in
                            guard let name = value["name"] as? String,
                                  let sets = value["sets"] as? Int,
                                  let reps = value["reps"] as? Int,
                                  let weight = value["weight"] as? String else {
                                print("Invalid exercise data for in document: \(workout.documentID)")
                                return nil
                            }
                            return Exercise(
                                name: name,
                                sets: sets,
                                reps: reps,
                                weight: weight)
                        }
                        
                        return Workout(
                            startTime: ((data["startTime"] as? Timestamp)?.dateValue())!,
                            endTime: ((data["endTime"] as? Timestamp)?.dateValue())!,
                            exercises: exercises,
                            breakfast: data["breakfast"] as! String,
                            lunch: data["lunch"] as! String,
                            dinner: data["dinner"] as! String,
                            snacks: data["snacks"] as! String
                        )
                    }
                    completion(workouts)
                }
        }
    }
    
    func createWorkout(uid:String, workout:Workout) {
        
        var exercises: [[String:Any]] = [[String:Any]]()
        
        for exercise in workout.exercises {
            let newDict = [
                "name": exercise.name,
                "sets": exercise.sets,
                "reps": exercise.reps,
                "weight": exercise.weight
            ] as [String : Any]
            exercises.append(newDict)
        }
        
        db.collection("workouts").addDocument(data: [
            "startTime": workout.startTime,
            "endTime": workout.endTime,
            "exercises": exercises,
            "breakfast": workout.breakfast,
            "lunch": workout.lunch,
            "dinner": workout.dinner,
            "snacks": workout.snacks,
            "uid": uid
        ]) { error in
            if let error = error {
                print("Error adding document: \(error)")
            } else {
                print("Document added with auto-generated ID!")
            }
        }

    }
    
}
