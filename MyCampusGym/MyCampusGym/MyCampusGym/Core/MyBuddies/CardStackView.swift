//
//  CardStackView.swift
//  MyCampusGym
//
//  Created by Troy Wu on 2024/11/24.
//

import SwiftUI

struct CardStackView: View {
    var body: some View {
        NavigationStack {
            VStack(spacing: 16) {
                ZStack {
                    ForEach(0 ..< 10) { card in
                        BuddiesCardView()
                    }
                }
            }
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Image(.myCampusGym)
                        .resizable()
                        .scaledToFill()
                        .frame(width: 88)
                }
            }
        }
    }
}

#Preview {
    CardStackView()
}
