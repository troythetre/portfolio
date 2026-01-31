//
//  ProfileSettingEdit.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/14/24.
//

import SwiftUI

struct ProfileSettingEdit: View {
    
    @Binding var profile: Profile
    @Binding var field:String
    var label:String
    var profileService:ProfileService = ProfileService()
    @Environment(\.dismiss) var dismiss
    @FocusState private var isFocused:Bool
    
    var body: some View {
        ZStack {
            VStack {
                HStack {
                    Spacer()
                    Button {
                        profileService.saveProfile(profile:profile)
                        dismiss()
                    } label: {
                        Text("Save")
                    }
                }
                Spacer()
            }
            VStack(alignment: .leading) {
                Text(label).font(.title2)
                TextField("", text: $field).focused($isFocused)
                Divider().frame(height: 2).background(Color.primary)
                Spacer()
            }
            .onAppear {
                isFocused = true
            }
        }.padding()
    }
}

#Preview {
    
    @Previewable @State var profile:Profile = Profile(id: "1234", birthday: Calendar.current.date(from: DateComponents(year: 2024, month: 11, day: 11)), firstName: "Harry", campusName: "Hogwarts", campusId: "12", uid: "1a2b3c4d5e6f7g8h9i0j")
    
    ProfileSettingEdit(profile: $profile, field: $profile.firstName, label:"First Name")
}
