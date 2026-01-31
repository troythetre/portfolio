//
//  OccupancyView.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/16/24.
//

import SwiftUI

struct OccupancyView: View {
    
    @State var profile:Profile
    let facilityService = FacilityService()
    @State var facilities:[Facility] = [Facility]()
    
    var body: some View {
        if(facilities.count > 0){
            List {
                ForEach(facilities) { facility in
                    FacilityRowView(facility:facility)
                }
            }.onAppear() {
                facilityService.getFacilities(campusId: profile.campusId) { f in
                    facilities = f
                }
            }
        }
        else {
            VStack {
                Text("No Facilities Found.\nEnsure you have selected a\nCampus in your profile.")
                    .multilineTextAlignment(.center)
            }.onAppear() {
                facilityService.getFacilities(campusId: profile.campusId) { f in
                    facilities = f
                }
            }
        }
    }
}

#Preview {
    OccupancyView(profile:Profile())
}
