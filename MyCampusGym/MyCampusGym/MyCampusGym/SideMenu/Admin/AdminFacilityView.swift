//
//  AdminFacilityView.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/23/24.
//

import SwiftUI

struct AdminFacilityView: View {
    
    var profile:Profile
    var fs:FacilityService = FacilityService()
    @State var facilities:[Facility] = [Facility]()
    @State var isPresented:Bool = false
    @State var selectedFacility:Facility = Facility()
    @State var editView:String = ""
    
    var body: some View {
        
        List {
            Button("Add New Facility") {
                selectedFacility = Facility()
                editView = "edit"
                isPresented = true
            }
            ForEach(facilities) { facility in
                Button {
                    selectedFacility = facility
                    editView = "edit"
                    isPresented = true
                } label: {
                    FacilityRowView(facility:facility, adminView: true)
                }
            }
        }.onAppear {
            fs.getFacilities(campusId: profile.campusId) { f in
                facilities = f
            }
        }
        .sheet(isPresented: $isPresented) {
            FacilityView(facility:$selectedFacility, facilities:$facilities, editView: "edit", profile:profile)
        }
        .onChange(of: isPresented) {
            fs.getFacilities(campusId: profile.campusId) { f in
                facilities = f
            }
        }
    }
}

#Preview {
    AdminFacilityView(profile:Profile(), selectedFacility: Facility())
}
