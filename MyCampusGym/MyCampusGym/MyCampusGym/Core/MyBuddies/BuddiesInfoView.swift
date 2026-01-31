//
//  BuddiesInfoView.swift
//  MyCampusGym
//
//  Created by Troy Wu on 2024/11/24.
//

import SwiftUI

struct BuddiesInfoView: View {
    @Binding var showProfileModal: Bool
    
    var body: some View {
        VStack(alignment: .leading) {
            HStack {
                Text("Charlie")
                    .font(.title)
                    .fontWeight(.heavy)
                
                Text("23")
                    .font(.title)
                    .fontWeight(.semibold)
                
                Spacer()
                
                Button {
                    showProfileModal.toggle()
                } label: {
                    Image(systemName: "arrow.up.circle")
                        .fontWeight(.bold)
                        .imageScale(.large)
                }
            }
            
            Text("Student | Intern")
                .font(.subheadline)
                .lineLimit(2)
        }
        .foregroundStyle(.white)
        .padding()
        .background(
            LinearGradient(colors: [.clear, .black], startPoint: .top, endPoint: .bottom)
        )
    }
}

#Preview {
    BuddiesInfoView(showProfileModal: .constant(false))
}
