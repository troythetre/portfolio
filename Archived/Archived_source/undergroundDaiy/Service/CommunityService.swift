//
//  CommunityService.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/7.
//

//import Firebase
//
//struct CommunityService {
//    
//    func fetchCommunities(completion: @escaping([SingleCommunity]) -> Void) {
//        Firestore.firestore().collection("Community")
//            .order(by: "timestamp", descending: true)
//            .getDocuments { snapshot, _ in
//                guard let documents = snapshot?.documents else {
//                    return }
//                let communities = documents.compactMap({ try? $0.data(as: SingleCommunity.self)})
//                completion(communities)
//            }
//    }
//}
