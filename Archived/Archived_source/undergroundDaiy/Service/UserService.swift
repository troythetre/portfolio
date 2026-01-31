//
//  UserService.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/23.
//

import Firebase
import FirebaseFirestoreSwift

struct UserService {
    
    func fetchUser(withUid uid: String, completion: @escaping(AppUser) -> Void ) {
        Firestore.firestore().collection("users")
            .document(uid)
            .getDocument { snapshot, _ in
                guard let snapshot = snapshot else { return }
                
                guard let user = try? snapshot.data(as: AppUser.self) else { return }
                completion(user)
            }
    }
    
    func fetchUsers(completion: @escaping([AppUser]) -> Void) {
        Firestore.firestore().collection("users")
            .getDocuments { snapshot, _ in
                guard let documents = snapshot?.documents else { return }
                let users = documents.compactMap({ try? $0.data(as: AppUser.self) })
                completion(users)
            }
    }
}
