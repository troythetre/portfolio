//
//  MyFitness.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 10/31/24.
//

import SwiftUI

struct MyFitness: View {
    
    @EnvironmentObject var viewModel: AuthViewModel
    var profileService = ProfileService()
    @State var profile:Profile = Profile(campusName:"Test Campus")
    var safeHeight:Double = 0
    
    var body: some View {
        
        NavigationView() {
            
            VStack(spacing: 16) {
                NavigationLink {
                    MyClassesView()
                } label: {
                    IconView(imageName: "classesIcon", text: "Classes")
                        .frame(maxWidth: safeHeight / 2, maxHeight: safeHeight / 2)
                }
                
                NavigationLink {
                    OccupancyView(profile:profile)
                } label: {
                    IconView(imageName: "facilityIcon", text: "Facility Hours\n& Occupancy")
                        .frame(maxWidth: safeHeight / 2, maxHeight: safeHeight / 2)
                    
                }
            }
            .padding(.bottom, 50)
            .onAppear() {
                profileService.getProfile(uid: viewModel.currentSessionUser?.id ?? "") { p in
                    profile = p
                }
            }
            .padding()
        }
    }
}

struct IconView: View {
    let imageName: String
    let text: String
    
    var body: some View {
        ZStack {
            
            Image(imageName)
                .resizable()
                .scaledToFill()
                .clipped()
            
            
            Color.black.opacity(0.5)
            
            
            Text(text)
                .font(.largeTitle)
                .foregroundColor(.white)
                .bold()
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .cornerRadius(10)
    }
}

#Preview {
    
    GeometryReader { geometry in
        let safePreviewHeight = geometry.size.height - geometry.safeAreaInsets.top - geometry.safeAreaInsets.bottom
        MyFitness(safeHeight: safePreviewHeight).environmentObject(AuthViewModel())
    }
}
