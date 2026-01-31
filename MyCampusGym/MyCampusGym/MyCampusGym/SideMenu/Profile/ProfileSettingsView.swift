//
//  ProfileSettingsView.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/11/24.
//

import SwiftUI

struct ProfileSettingsView: View {
    
    @EnvironmentObject var viewModel:AuthViewModel
    @Binding var profile:Profile
    
    var body: some View {
        Form {
            Section("Personal Information") {
                ProfileSettingsRow(profile: $profile, field: $profile.firstName, label: "First Name")
                ProfileSettingsRow(profile: $profile, field: $profile.lastName, label: "Last Name")
                ProfileSettingsRow(profile: $profile, field: $profile.email, label: "Email", readOnly: true)
                //ProfileSettingsRow(profile: $profile, field: $profile.birthday, label: "Birthday")
            }
            
            Section("Profile Photo") {
                ProfileSettingsRow(profile: $profile, field: $profile.photoUrl, label: "Photo")
            }
            
            Section("Organization") {
                ProfileSettingsRow(profile: $profile, field: $profile.campusName, label: "Campus")
            }
        }
    }
}

#Preview {
    
    @Previewable @State var profile:Profile = Profile(id: "1234", birthday: Calendar.current.date(from: DateComponents(year: 2024, month: 11, day: 11)), firstName: "Harry", campusName: "Hogwarts", campusId: "12", uid: "1a2b3c4d5e6f7g8h9i0j")
    
    ProfileSettingsView(profile: $profile).environmentObject(AuthViewModel())
}
