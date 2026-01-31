//
//  AdminUserView.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/23/24.
//

import SwiftUI

struct AdminUserView: View {
    
    var profile:Profile
    @State var users:[Profile] = [Profile]()
    var ps:ProfileService = ProfileService()
    
    var body: some View {
        List {
            ForEach(users) { user in
                Text(user.fullName)
            }
        }.onAppear {
            ps.getProfiles(campusId: profile.campusId) { p in
                users = p
            }
        }
    }
}

#Preview {
    AdminUserView(profile: Profile())
}
