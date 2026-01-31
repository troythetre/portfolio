//
//  SideMenuHeaderView.swift
//  MyCampusGym
//
//  Created by Troy Wu on 2024/10/28.
//

import SwiftUI

struct SideMenuHeaderView: View {
    
    @EnvironmentObject var viewModel: AuthViewModel
    var profile:Profile
    
    var body: some View {
        HStack {
            Image(systemName: "person.circle.fill")
                .imageScale(.large)
                .foregroundStyle(.white)
                .frame(width: 48, height: 48)
                .background(.blue)
                .clipShape(RoundedRectangle(cornerRadius: 10))
                .padding(.vertical)
            
            VStack(alignment: .leading, spacing: 6) {
                Text(profile.fullName)
                    .font(.subheadline)
                
                Text(profile.email)
                    .font(.footnote)
                    .tint(.gray)
                
            }
        }
    }
}

#Preview {
    SideMenuHeaderView(profile: Profile()).environmentObject(AuthViewModel())
}
