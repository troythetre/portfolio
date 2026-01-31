//
//  BuddiesProfileView.swift
//  MyCampusGym
//
//  Created by Troy Wu on 2024/11/25.
//

import SwiftUI

struct BuddiesProfileView: View {
    @Environment(\.dismiss) var dismiss
    @State private var currentImageIndex = 0
    @State private var mockImages = [
        "person-workout-1",
        "person-workout-2",
        "person-workout-3"
    ]
    
    var body: some View {
        VStack {
            HStack {
                Text("Charlie Davis")
                    .font(.title2)
                    .fontWeight(.semibold)
                
                Text("23")
                    .font(.title2)
                
                Spacer()
                
                Button {
                    dismiss()
                } label: {
                    Image(systemName: "arrow.down.circle.fill")
                        .imageScale(.large)
                        .fontWeight(.bold)
                        .foregroundStyle(.blue)
                }
            }
            .padding(.horizontal)
            
            ScrollView {
                VStack {
                    ZStack(alignment: .top) {
                        Image(mockImages[currentImageIndex])
                            .resizable()
                            .scaledToFill()
                            .frame(width: SizeConstants.cardWidth, height: SizeConstants.cardHeight)
                            .overlay {
                                ImageScrollingOverlay(currentImageIndex: $currentImageIndex, imageCount: mockImages.count)
                            }
                        
                        CardImageIndicatorView(currentImageIndex: currentImageIndex, imageCount: mockImages.count)
                    }
                    
                    VStack(alignment: .leading, spacing: 12) {
                        Text("About me")
                            .fontWeight(.semibold)
                        
                        Text("Serious bodybuilding inquries only")
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
                    .background(Color(.secondarySystemBackground))
                    .font(.subheadline)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                    
                }
                
                VStack(alignment: .leading, spacing: 12) {
                    Text("Essentials")
                    
                    HStack {
                        Image(systemName: "person")
                        
                        Text("Man")
                        
                        Spacer()
                    }
                    .font(.subheadline)
                    
                    HStack {
                        Image(systemName: "arrow.down.forward.and.arrow.up.backward.circle")
                        
                        Text("Straight")
                        
                        Spacer()
                    }
                    .font(.subheadline)
                    
                    HStack {
                        Image(systemName: "book")
                        
                        Text("Student")
                        
                        Spacer()
                    }
                    .font(.subheadline)
                }
            }
        }
    }
}

#Preview {
    BuddiesProfileView()
}
