//
//  SettingsRowView.swift
//  MyCampusGym
//
//  Created by Troy Wu on 2024/10/22.
//

import SwiftUI

struct ProfileViewRow: View {
    let imageName: String
    let title: String
    let tintColor: Color
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: imageName)
                .imageScale(.small)
                .font(.title)
                .foregroundColor(tintColor)
            
            Text(title)
                .font(.subheadline)
                .foregroundColor(.primary)
        }
    }
}

#Preview {
    ProfileViewRow(imageName: "gear", title: "Version", tintColor: Color(.systemGray))
}
