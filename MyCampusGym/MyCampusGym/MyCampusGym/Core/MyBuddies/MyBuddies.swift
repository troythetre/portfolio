//
//  MyBuddies.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/10/24.
//

import SwiftUI

struct MyBuddies: View {
    
    @State private var filters: [String] = ["Weightlift", "Yoga", "Cardio", "Sports"]
    @State private var selectedFilter = "Weightlift"
    
    var body: some View {
        ZStack {
            //Color.white.ignoresSafeArea()
            
            VStack(spacing: 12) {
                header
                
                
                
                MyBuddiesFilterView(options: filters, selection: $selectedFilter)
                    .background(
                        Divider(), alignment: .bottom
                    )
                
                BuddiesCardView()
                
                Spacer()
            }
            .padding(8)
        }
    }
    
    private var header: some View {
        HStack(spacing: 0) {
            HStack(spacing: 0) {
                Image(systemName: "line.horizontal.3")
                    .padding(8)
                    .background(.opacity(0.001))
                    .onTapGesture {
                        
                    }
                
                Image(systemName: "arrow.uturn.left")
                    .padding(8)
                    .background(.opacity(0.001))
                    .onTapGesture {
                        
                    }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            
            
            Text("MyBuddies")
                .font(.title)
                .foregroundStyle(.blue)
                .frame(maxWidth: .infinity, alignment: .center)
               
                
            Image(systemName: "slider.horizontal.3")
                .padding(8)
                .background(.opacity(0.001))
                .onTapGesture {
                    
                }
                .frame(maxWidth: .infinity, alignment: .trailing)
                
        }
        .font(.title2)
        .fontWeight(.medium)
        .foregroundStyle(.primary)
    }
}

#Preview {
    MyBuddies()
}
