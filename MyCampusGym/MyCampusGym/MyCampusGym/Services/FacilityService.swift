//
//  FacilityService.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/16/24.
//

import Foundation
import SwiftUI
import FirebaseFirestore

class FacilityService {
    
    let db = Firestore.firestore()
    
    func getFacilities(campusId:String, completion: @escaping ([Facility]) -> Void) {
        if(campusId != "") {
            
            db.collection("facilities")
                .whereField("campusId", isEqualTo: campusId)
                .order(by: "name")
                .getDocuments(source: .server) { (snapshot, error) in
                    if let error = error {
                        print("Error getting documents fs24: \(error)")
                        return
                    }
                    
                    guard let documents = snapshot?.documents else {
                        print("No documents found")
                        return
                    }
                    
                    let facilities: [Facility] = documents.compactMap { (facility) -> Facility? in
                        let data = facility.data()
                        
                        return Facility(
                            id:facility.documentID,
                            name:data["name"] as! String,
                            campusId:data["campusId"] as! String,
                            campusName:data["campusName"] as! String,
                            placeId:data["placeId"] as! String,
                            postalCode:data["postalCode"] as! String
                        )
                    }
                    completion(facilities)
                }
        }
    }
    
    func updatePlaceId(facilityId:String, placeId:String) {
        
        let documentRef = db.collection("facilities").document(facilityId)
        
        let data = [
            "placeId": placeId
        ] as [String : Any]
        
        documentRef.updateData(data) { error in
            if let error = error {
                print("Error updating document: \(error.localizedDescription)")
            } else {
                print("Document successfully updated")
            }
        }

    }
    
    func createFacility(campusId:String, campusName:String, facility:Facility) {
        
        db.collection("facilities").addDocument(data: [
            "campusId": campusId,
            "campusName": campusName,
            "name": facility.name,
            "placeId": facility.placeId,
            "postalCode": facility.postalCode
        ]) { error in
            if let error = error {
                print("Error adding document fs78: \(error)")
            } else {
                print("Document added with auto-generated ID fs80!")
            }
        }

    }
    
    func updateFacility(facility:Facility) {
        
        let documentRef = db.collection("facilities").document(facility.id)
        
        let data = [
            "campusId": facility.campusId,
            "campusName": facility.campusName,
            "id": facility.id,
            "name": facility.name,
            "placeId": facility.placeId,
            "postalCode": facility.postalCode
        ] as [String : Any]
        
        documentRef.updateData(data) { error in
            if let error = error {
                print("Error updating document fs101: \(error.localizedDescription)")
            } else {
                print("Document successfully updated fs103")
            }
        }

    }
    
}
