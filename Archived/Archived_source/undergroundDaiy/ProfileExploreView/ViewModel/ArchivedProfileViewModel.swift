//
//  ProfileViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2025/1/27.
//

import Firebase
import FirebaseFirestore
import Combine

class ArchivedProfileViewModel: ObservableObject {
    @Published var profiles = [AppUser]()
    private var db = Firestore.firestore()
    
    init() {
        fetchProfiles()
    }
    
    func fetchProfiles() {
        db.collection("users").getDocuments { (snapshot, error) in
            if let error = error {
                print("Error getting profiles: \(error)")
                return
            }
            
            if let snapshot = snapshot {
                self.profiles = snapshot.documents.compactMap { document in
                    try? document.data(as: AppUser.self)
                }
            }
        }
    }
}
