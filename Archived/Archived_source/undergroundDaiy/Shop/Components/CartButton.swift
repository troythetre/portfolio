//
//  CardButton.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/7/19.
//

import SwiftUI

struct CartButton: View {
    
    var numOfProducts: Int
    
    var body: some View {
        ZStack(alignment: .topTrailing) {
            Image(systemName: "cart")
                .padding(.top, 5)
                .foregroundColor(.white)
            
            if numOfProducts > 0 {
                Text("\(numOfProducts)")
                    .font(.caption).bold()
                    .foregroundStyle(.white)
                    .frame(width: 15, height: 15)
                    .background(.blue)
                    .cornerRadius(50)
            }
        }
    }
}

#Preview {
    CartButton(numOfProducts: 8)
}
