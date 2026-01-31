//
//  BuddiesCardView.swift
//  MyCampusGym
//
//  Created by Troy Wu on 2024/11/14.
//

import SwiftUI

struct BuddiesCardView: View {
    @State private var xOffset: CGFloat = 0
    @State private var degrees: Double = 0
    @State private var currentImageIndex = 0
    @State private var showProfileModal = false
    
    @State private var mockImages = [
        "person-workout-1",
        "person-workout-2",
        "person-workout-3"
    ]
    
    var body: some View {
        ZStack(alignment: .bottom) {
            ZStack(alignment: .top) {
                Image(mockImages[currentImageIndex])
                    .resizable()
                    .scaledToFill()
                    .frame(width: SizeConstants.cardWidth, height: SizeConstants.cardHeight)
                    .overlay {
                        ImageScrollingOverlay(currentImageIndex: $currentImageIndex, imageCount: mockImages.count)
                    }
                
                CardImageIndicatorView(currentImageIndex: currentImageIndex, imageCount: mockImages.count)
                
                SwipeActionIndicatorView(xOffset: $xOffset)
            }
            
            BuddiesInfoView(showProfileModal: $showProfileModal)
        }
        .fullScreenCover(isPresented: $showProfileModal) {
            BuddiesProfileView()
        }
        .frame(width: SizeConstants.cardWidth, height: SizeConstants.cardHeight)
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .offset(x: xOffset)
        .rotationEffect(.degrees(degrees))
        .animation(.snappy, value: xOffset)
        .gesture(
            DragGesture()
                .onChanged(onDragChanged)
                .onEnded(onDragEnded)
        )
    }
}

private extension BuddiesCardView {
    func returnToCenter() {
        xOffset = 0
        degrees = 0
    }
    func swipeRight() {
        xOffset = 500
        degrees = 12
    }
    
    func swipeLeft() {
        xOffset = -500
        degrees = -12
    }
}

private extension BuddiesCardView {
    
    func onDragChanged(_ value: _ChangedGesture<DragGesture>.Value) {
        xOffset = value.translation.width
        degrees = Double(value.translation.width / 25)
    }
    
    func onDragEnded(_ value: _ChangedGesture<DragGesture>.Value) {
        let width = value.translation.width
        
        if abs(width) < abs(SizeConstants.screenCutoff) {
            returnToCenter()
            return 
        }
        
        if width >= SizeConstants.screenCutoff {
            swipeRight()
        } else {
            swipeLeft()
        }
    }
}

#Preview {
    BuddiesCardView()
        .padding(.vertical, 40)
        .padding(.horizontal, 16)
}
