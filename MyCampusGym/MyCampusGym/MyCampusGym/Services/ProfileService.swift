//
//  ProfileService.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/11/24.
//

import SwiftUI
import Foundation
import FirebaseFirestore

class ProfileService {
    let db = Firestore.firestore()
    let fs:FirestoreService = FirestoreService()
    
    func createProfile(uid:String, email:String, completion: @escaping (Profile) -> Void) {
        
        db.collection("profiles").addDocument(data: [
            "uid": uid,
            "email": email,
            "birthday": "",
            "campusName": "",
            "campusId": "",
            "firstName": "",
            "id": "",
            "isAdmin": false
        ]) { error in
            if let error = error {
                print("Error adding document: \(error)")
            } else {
                print("Document added with auto-generated ID!")
            }
        }
        
        db.collection("profiles").whereField("uid", isEqualTo: uid).getDocuments() { (querySnapshot, error) in
            if let documents = querySnapshot?.documents, let document = documents.first {
                let data = [
                    "id": document.documentID
                ]
                
                let documentRef = self.db.collection("profiles").document(data["id"] ?? "")
                
                documentRef.updateData(data) { error in
                    if let error = error {
                        print("Error updating document: \(error.localizedDescription)")
                    } else {
                        print("Document successfully updated")
                    }
                }
            }
        }
    }
    
    func getProfile(uid:String, completion: @escaping (Profile) -> Void) {
        
        db.collection("profiles").whereField("uid", isEqualTo: uid).getDocuments() { (querySnapshot, error) in
            if let error = error {
                print("Error querying document: \(error.localizedDescription)")
                return
            }
            
            print("Document Retrieved. Count: \(querySnapshot!.documents.count)")
            
            // Handle the results
            if let documents = querySnapshot?.documents, let document = documents.first {
                let data = document.data()
                
                completion(Profile(
                    id: document.documentID,
                    birthday: self.fs.stringToDate(date: data["birthday"] as! String),
                    firstName: data["firstName"] as? String ?? "",
                    lastName: data["lastName"] as? String ?? "",
                    campusName: data["campusName"] as? String ?? "",
                    campusId: data["campusId"] as? String ?? "",
                    uid: data["uid"] as? String ?? "",
                    email: data["email"] as? String ?? "",
                    isAdmin: data["isAdmin"] as? Bool ?? false
                ))
            }
        }
    }
    
    func getProfiles(campusId:String, completion: @escaping ([Profile]) -> Void) {
        
        db.collection("profiles")
            .whereField("campusId", isEqualTo: campusId)
            .order(by: "firstName")
            .getDocuments(source: .server) { (snapshot, error) in
                if let error = error {
                    print("Error getting documents ps88: \(error)")
                    return
                }
                
                guard let documents = snapshot?.documents else {
                    print("No documents found ps93")
                    return
                }
                
                let profiles: [Profile] = documents.compactMap { (profile) -> Profile? in
                    let data = profile.data()
                    
                    return Profile(
                        id: profile.documentID,
                        birthday: self.fs.stringToDate(date: data["birthday"] as! String),
                        firstName: data["firstName"] as? String ?? "",
                        lastName: data["lastName"] as? String ?? "",
                        campusName: data["campusName"] as? String ?? "",
                        campusId: data["campusId"] as? String ?? "",
                        uid: data["uid"] as? String ?? "",
                        email: data["email"] as? String ?? "",
                        isAdmin: data["isAdmin"] as? Bool ?? false
                    )
                }
                completion(profiles)
            }
    }
    
    func saveProfile(profile:Profile) {
        
        let documentRef = db.collection("profiles").document(profile.id)
        
        let data = [
            "id": profile.id,
            "birthday": fs.dateToString(date: profile.birthday),
            "firstName": profile.firstName,
            "lastName": profile.lastName,
            "campusName": profile.campusName,
            "campusId": profile.campusId,
            "uid": profile.uid,
            "email": profile.email,
            "isAdmin": profile.isAdmin
        ] as [String : Any]
        
        documentRef.updateData(data) { error in
            if let error = error {
                print("Error updating document: \(error.localizedDescription)")
            } else {
                print("Document successfully updated")
            }
        }
        
    }
    
    func updateCampus(profile:Profile, campusId:String) {
        let documentRef = db.collection("profiles").document(profile.id)
        
        let campusService = CampusService()
        
        campusService.getCampus(id: campusId) { campus in
            let data = [
                "campusId": campusId,
                "campusName": campus.name
            ]
            
            documentRef.updateData(data) { error in
                if let error = error {
                    print("Error updating document: \(error.localizedDescription)")
                } else {
                    print("Documet successfully updated")
                }
            }
        }
        
        
    }
}
