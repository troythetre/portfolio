//
//  GooglePlacesService.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/19/24.
//

import Foundation
import SwiftUI
//import GooglePlaces

struct GooglePlacesHelper {
    
    @State var errorMessage:String?
    
    func fetchPlaceID(for locationName: String, completion: @escaping (String?) -> Void) {
        /*
        let placesClient = GMSPlacesClient.shared()
        
        let filter = GMSAutocompleteFilter()
        filter.types = []
        
        placesClient.findAutocompletePredictions(
            fromQuery: locationName,
            filter: filter,
            sessionToken: nil
        ) { (predictions, error) in
            if let error = error {
                print("Error fetching place predictions: \(error.localizedDescription)")
                completion(nil)
                return
            }
            
            guard let predictions = predictions, let firstPrediction = predictions.first else {
                print("No predictions found for \(locationName)")
                completion(nil)
                return
            }
            
            completion(firstPrediction.placeID)
        }*/
    }

    func fetchOpeningHours(for placeID: String) {
        /*let placesClient = GMSPlacesClient.shared()
        
        // Specify the fields you want to fetch
        let fields: GMSPlaceField = [.openingHours, .name]
        
        placesClient.fetchPlace(fromPlaceID: placeID, placeFields: fields, sessionToken: nil) { place, error in
            if let error = error {
                self.errorMessage = error.localizedDescription
                return
            }
            
            guard let place = place else {
                self.errorMessage = "Failed to fetch place details."
                return
            }
            
            if let openingHours = place.openingHours {
                // Format the opening hours
                let weekdayText = openingHours.weekdayText?.joined(separator: "\n") ?? "No data available"
                //self.openingHours = "Opening Hours:\n\(weekdayText)"
            } else {
                //self.openingHours = "No opening hours available."
            }
        }*/
    }
    
}
