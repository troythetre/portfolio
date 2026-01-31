//
//  CustomTabView.swift
//  MyCampusGym
//
//  Created by Troy Wu on 2024/10/30.
//

import SwiftUI

struct CustomTabView: View {
    @Binding var tabSelection: Int
    @Namespace private var animationNamespace
    
    let tabBarItems: [(image: String, title: String)] = [
        ("house", "Home"),
        ("magnifyingglass", "Search"),
        ("heart", "Favorites"),
        ("person", "Profile"),
        ("gear", "Settings"),
    ]
    var body: some View {
        ZStack {
            Capsule()
                .frame(height: 80)
                .foregroundStyle(Color(.secondarySystemBackground))
                .shadow(radius: 2)
            
            HStack {
                ForEach(0..<5) { index in
                    Button {
                        tabSelection = index + 1
                    } label: {
                        VStack(spacing: 8) {
                            Spacer()
                            
                            Image(systemName: tabBarItems[index].image)
                            
                            Text(tabBarItems[index].title)
                            
                            if index + 1 == tabSelection {
                                Capsule()
                                    .frame(height: 8)
                                    .foregroundColor(.blue)
                                    .matchedGeometryEffect(id: "selectedTabId", in: animationNamespace)
                                    .offset(y: 3)
                            } else {
                                Capsule()
                                    .frame(height: 8)
                                    .foregroundStyle(.clear)
                                    .offset(y: 3)
                            }
                        }
                        .foregroundStyle(index + 1 == tabSelection ? .blue: .gray)
                    }
                }
            }
            .frame(height: 80)
            .clipShape(Capsule())
        }
        .padding(.horizontal)
    }
}

#Preview {
    CustomTabView(tabSelection: .constant(1))
        //.previewLayout(.sizeThatFits)
        .padding(.vertical)
}
