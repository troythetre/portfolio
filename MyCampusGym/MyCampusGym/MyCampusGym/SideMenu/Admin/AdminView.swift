//
//  AdminView.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/23/24.
//

import SwiftUI

struct AdminView: View {
    
    var profile:Profile
    
    var body: some View {
        GeometryReader { proxy in
            ScrollView(showsIndicators: false) {
                LazyVGrid(columns: [GridItem(spacing:5, alignment: .center),
                                    GridItem(spacing:5, alignment: .center)],
                          alignment: .center) {
                    NavigationLink {
                        AdminFacilityView(profile:profile, selectedFacility: Facility())
                    } label: {
                        AdminIconView(label:"Facilities", imageName: "building.2.crop.circle", size: proxy.size)
                    }
                    
                    NavigationLink {
                        AdminUserView(profile:profile)
                    } label: {
                        AdminIconView(label:"Users", imageName:"person.2.badge.gearshape.fill", size: proxy.size)
                    }
                    
                }.padding(.top, 25)
            }
        }
    }
}

#Preview {
    AdminView(profile:Profile())
}
