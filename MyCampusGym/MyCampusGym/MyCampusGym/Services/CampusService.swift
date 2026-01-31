//
//  CampusService.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/21/24.
//
import Foundation
import SwiftUI
import FirebaseFirestore
class CampusService {
    
    let db = Firestore.firestore()
    
    func getCampuses(completion: @escaping ([Campus]) -> Void) {
        
        db.collection("campuses")
            .order(by: "name")
            .getDocuments(source: .server) { (snapshot, error) in
                if let error = error {
                    print("Error getting documents cs23: \(error)")
                    return
                }
                print("Campuses in snapshot \(snapshot!.documents.count)")
                guard let documents = snapshot?.documents else {
                    print("No documents found")
                    return
                }
                
                let campuses: [Campus] = documents.compactMap { (campus) -> Campus? in
                    let data = campus.data()
                    
                    // Convert domain string to string array
                    let domainString = data["domains"] as? String ?? ""
                    let domainSubstrings = domainString.split(separator: ",")
                    let domains = domainSubstrings.map { String($0) }
                    
                    // Return constructed Campus struct
                    return Campus(
                        name:data["name"] as! String,
                        id:campus.documentID,
                        domains:domains
                    )
                }
                completion(campuses)
            }
    }
    
    func getCampus(id:String, completion: @escaping (Campus) -> Void) {
        
        db.collection("campuses").whereField("id", isEqualTo: id).getDocuments() { (snapshot, error) in
            if let error = error {
                print("Error getting documents cs49: \(error)")
                return
            }
            
            guard let document = snapshot?.documents.first else {
                print("No documents founds")
                return
            }
            
            let data = document.data()
            
            // Convert domain string to string array
            let domainString = data["domains"] as? String ?? ""
            let domainSubstrings = domainString.split(separator: ",")
            let domains = domainSubstrings.map { String($0) }
            
            completion( Campus(
                name:data["name"] as! String,
                id: document.documentID,
                domains: domains
                )
            )
        }
    }
}
