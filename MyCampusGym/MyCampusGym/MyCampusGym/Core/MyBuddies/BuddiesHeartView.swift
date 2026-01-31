//
//  BuddiesHeartView.swift
//  MyCampusGym
//
//  Created by Troy Wu on 2024/11/17.
//

import SwiftUI

struct BuddiesHeartView: View {
    var body: some View {
        ZStack {
            Circle()
                .fill(.blue)
                .frame(width: 40, height: 40)
            
            Image(systemName: "bubble.fill")
                .foregroundStyle(.black)
                .font(.system(size: 22))
                .offset(y: 2)
            
            Image(systemName: "heart.fill")
                .foregroundStyle(.blue)
                .font(.system(size: 10))
        }
    }
}

#Preview {
    BuddiesHeartView()
}
