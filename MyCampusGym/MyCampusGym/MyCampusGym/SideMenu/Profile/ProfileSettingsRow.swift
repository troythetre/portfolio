//
//  ProfileSettingsRow.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/14/24.
//

import SwiftUI

struct ProfileSettingsRow: View {
    
    @Binding var profile:Profile
    @Binding var field:String
    var label:String
    var readOnly:Bool = false
    
    
    var body: some View {
        NavigationLink {
            if(!readOnly) {
                if(label == "Campus") {
                    ProfileCampusEdit(profile: $profile, field: $field, label: label)
                } else if (label == "Photo") {
                    
                } else {
                    ProfileSettingEdit(profile: $profile, field: $field, label: label)
                }
            }
        } label: {
            HStack {
                Text(label).foregroundColor(Color.primary)
                Spacer()
                if(label == "Photo" && field == "") {
                    Text("Upload")
                        .font(.subheadline).foregroundColor(Color.gray)
                } else if (label == "Photo" && field != "") {
                    Text("Change")
                        .font(.subheadline).foregroundColor(Color.gray)
                } else {
                    Text(field)
                        .font(.subheadline).foregroundColor(Color.gray)
                }
            }
        }.disabled(readOnly)
    }
}

#Preview {
    
    @Previewable @State var profile:Profile = Profile(id: "1234", birthday: Calendar.current.date(from: DateComponents(year: 2024, month: 11, day: 11)), firstName: "Harry", campusName: "Hogwarts", campusId: "12", uid: "1a2b3c4d5e6f7g8h9i0j")
    
    ProfileSettingsRow(profile: $profile, field: $profile.firstName, label: "First Name")
}
