//
//  ProfileView.swift
//  MyCampusGym
//
//  Created by Troy Wu on 2024/10/21.
//

import SwiftUI

struct ProfileView: View {
    
    @EnvironmentObject var viewModel:AuthViewModel
    @Environment(\.dismiss) var dismiss
    @State var profile:Profile = Profile()
    private let profileService:ProfileService = ProfileService()
    
    var body: some View {
        List {
            Section {
                NavigationLink{
                    ProfileSettingsView(profile: $profile).environmentObject(viewModel)
                } label: {
                    HStack {
                        Text(viewModel.currentSessionUser?.initials ?? "T")
                            .font(.title)
                            .fontWeight(.semibold)
                            .foregroundStyle(.white)
                            .frame(width: 72, height: 72)
                            .background(Color(.systemGray3))
                            .clipShape(Circle())
                        
                        VStack(alignment: .leading, spacing: 4) {
                            Text(profile.fullName)
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .padding(.top, 4)
                            
                            Text(profile.email)
                                .font(.footnote)
                                .foregroundColor(.gray)
                        }
                    }
                }
                
            }
            
            Section("General") {
                HStack {
                    ProfileViewRow(imageName: "gear",
                                   title: "Version",
                                   tintColor: Color(.systemGray))
                    
                    Spacer()
                    
                    Text("1.0.0")
                        .font(.subheadline)
                        .foregroundStyle(.gray)
                }
            }
            
            Section("Account") {
                Button {
                    print("Sign out..")
                    viewModel.signOut()
                    print("Signed Out")
                } label: {
                    ProfileViewRow(imageName: "arrow.left.circle.fill",
                                   title: "Sign Out",
                                   tintColor: .red)
                }
                
                Button {
                    print("Delete account..")
                } label: {
                    ProfileViewRow(imageName: "xmark.circle.fill",
                                   title: "Delete Account",
                                   tintColor: .red)
                }
            }
        }.onAppear {
            profileService.getProfile(uid: viewModel.currentSessionUser?.id ?? "") { p in
                profile = p
            }
        }
    }
}

#Preview {
    
    @Previewable @State var profile:Profile = Profile(id: "1234", birthday: Calendar.current.date(from: DateComponents(year: 2024, month: 11, day: 11)), firstName: "Harry", campusName: "Hogwarts", campusId: "12", uid: "1a2b3c4d5e6f7g8h9i0j")
    ProfileView().environmentObject(AuthViewModel())
}
