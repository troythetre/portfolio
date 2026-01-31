//
//  ProfileSettingEdit.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/14/24.
//
import SwiftUI
struct ProfileCampusEdit: View {
    
    @Binding var profile: Profile
    @Binding var field:String
    var label:String
    var profileService:ProfileService = ProfileService()
    var campusService:CampusService = CampusService()
    @Environment(\.dismiss) var dismiss
    @State var campuses:[Campus] = [Campus]()
    @State var selected:String = ""
    @State var selectedDomains:[String] = [String]([""])
    @State var showAlert:Bool = false
    @State var isValid:Bool = false
    
    var body: some View {
        Form {
            Section() {
                Button {
                    if selectedDomains.count > 1 || selectedDomains[0] != "" {
                        selectedDomains.forEach { d in
                            if profile.email.contains(d) {
                                profileService.updateCampus(profile: profile, campusId: selected)
                                dismiss()
                                print("entered if")
                                isValid = true
                                return
                            }
                        }
                        if !isValid {
                            showAlert = true
                        }
                    }
                } label: {
                    Text("Save")
                        .frame(maxWidth: .infinity, alignment: .center)
                }
                .alert(isPresented: $showAlert) {
                    Alert(
                        title: Text("Error"),
                        message: Text("Your email address is not valid for the selected campus."),
                        dismissButton: .default(Text("OK"))
                    )
                }
                Section() {
                    ForEach(campuses) { c in
                        Button {
                            selected = c.id
                            selectedDomains = c.domains
                            print("CampusId set to \(c.name) (\(c.id))")
                        } label: {
                            HStack {
                                Text(c.name)
                                    .foregroundColor(.primary)
                                if(c.id == selected) {
                                    Spacer()
                                    Image(systemName: "checkmark")
                                }
                            }
                        }
                    }
                }
            }.onAppear {
                campusService.getCampuses() { c in
                    campuses = c
                    print("Campus list has \(campuses.count)")
                }
                print("profile has campusId: \(profile.campusId)")
                selected = profile.campusId
            }
        }
    }
}
#Preview {
    
    @Previewable @State var profile:Profile = Profile(id: "1234", birthday: Calendar.current.date(from: DateComponents(year: 2024, month: 11, day: 11)), firstName: "Harry", campusName: "Hogwarts", campusId: "12", uid: "1a2b3c4d5e6f7g8h9i0j")
    
    ProfileCampusEdit(profile: $profile, field: $profile.firstName, label:"First Name")
    
}
