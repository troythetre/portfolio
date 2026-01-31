//
//  MyBuddiesFilterView.swift
//  MyCampusGym
//
//  Created by Troy Wu on 2024/11/14.
//

import SwiftUI

struct MyBuddiesFilterView: View {
    
    var options: [String] = ["Weightlift", "Yoga", "Cardio", "Sports"]
    @Binding var selection: String
    @Namespace private var namespace
    
    var body: some View {
        HStack(alignment: .top, spacing: 32) {
            ForEach(options, id: \.self) { option in
                VStack {
                    Text(option)
                        .frame(maxWidth: .infinity)
                        .font(.subheadline)
                        .fontWeight(.medium)
                    
                    if selection == option {
                        RoundedRectangle(cornerRadius: 2)
                            .frame(height: 1.5)
                            .matchedGeometryEffect(id: "selection", in: namespace)
                    }
                }
                .padding(.top, 8)
                .background(Color.black.opacity(0.001))
                .foregroundStyle(selection == option ? Color.primary : .gray)
                .onTapGesture {
                    selection = option
                }
            }
        }
        .animation(.smooth, value: selection)
    }
}


