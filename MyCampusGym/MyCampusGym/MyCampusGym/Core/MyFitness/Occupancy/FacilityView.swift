//
//  FacilityView.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/23/24.
//

import SwiftUI

struct FacilityView: View {
    
    @Binding var facility:Facility
    @Binding var facilities:[Facility]
    var editView:String
    var fs:FacilityService = FacilityService()
    var profile:Profile
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        Form {
            Button {
                if(facility.id != "") {
                    fs.updateFacility(facility: facility)
                    presentationMode.wrappedValue.dismiss()
                } else {
                    fs.createFacility(campusId: profile.campusId, campusName: profile.campusName, facility: facility)
                    facilities.append(facility)
                    presentationMode.wrappedValue.dismiss()
                }
            } label: {
                if(facility.id != "") {
                    Text("Save")
                }
                else {
                    Text("Create")
                }
            }
            
            Section(header: Text("Facility Details")) {
                TextField("Name", text: $facility.name)
                TextField("Postal Code", text: $facility.postalCode)
            }
            Section(header: Text("Google Place (Optional)")) {
                TextField("PlaceId", text: $facility.placeId)
            }
        }
    }
}

#Preview {
    FacilityView(facility: .constant(Facility()), facilities: .constant([Facility]()), editView:"edit", profile:Profile())
}
