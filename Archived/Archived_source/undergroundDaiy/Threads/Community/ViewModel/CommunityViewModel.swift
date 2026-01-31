//
//  SingleCommunityViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/5.
//

import Foundation
import FirebaseFirestore

class CommunityViewModel: ObservableObject {
    
    @Published var community = [Community]()
    
    private var db = Firestore.firestore()
    
    func fetchCommunity() {
        db.collection("Community").addSnapshotListener { (QuerySnapshot, error) in
            guard let documents = QuerySnapshot?.documents else {
                print("No documents")
                return
            }
            
            self.community = documents.map { (QueryDocumentSnapshot) -> Community in
                let data = QueryDocumentSnapshot.data()
                let name = data["communityName"] as? String ?? ""
                print(name)
                let description = data["communityDescription"] as? String ?? ""
                let imageUrl = data["communityProfileUrl"] as? String ?? ""
                let username = data["communityUsername"] as? String ?? ""
                return Community(communityName: name, 
                                 communityDescription: description,
                                 communityProfileUrl: imageUrl,
                                 communityUsername: username
                )
            }
        }
    }
}
