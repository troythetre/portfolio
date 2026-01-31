//
//  FacilityRowView.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/18/24.
//

import SwiftUI

struct FacilityRowView: View {
    
    var facility:Facility
    var fs:FacilityService = FacilityService()
    var adminView:Bool = false
    
    var body: some View {
        VStack(alignment: .leading) {
            Text(facility.name).font(.title).foregroundColor(.primary)
            if(adminView == false) {
                HStack {
                    Circle()
                        .fill(Color.green)
                        .frame(width: 5, height: 5)
                    Text("Open").foregroundColor(.primary)
                    Text(" | ").foregroundColor(.primary)
                    Circle()
                        .fill(Color.gray)
                        .frame(width: 5, height: 5)
                    Text("Occupancy Not Available").foregroundColor(.primary)
                }.font(.subheadline)
            }
        }
        .onAppear {
            if(facility.placeId == "Not Found" || facility.placeId == ""){
                print("Getting PlaceID for \(facility.name)")
                let helper = GooglePlacesHelper()
                helper.fetchPlaceID(for: facility.name) { fetchedPlaceID in
                    DispatchQueue.main.async {
                        fs.updatePlaceId(
                            facilityId: facility.id,
                            placeId: fetchedPlaceID ?? "Not Found")
                    }
                }
            }
        }
    }
}

#Preview {
    FacilityRowView(facility: Facility(name:"Facility Name"))
}
