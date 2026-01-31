//
//  HomeFilterView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/12/30.
//

import SwiftUI

struct HomeFilterView: View {
    @State private var activeCategory: HomeViewCategories = .all
    @Environment(\.colorScheme) private var scheme
    @Namespace private var animation
    var body: some View {
        ScrollView(.horizontal) { //filter bar
            HStack(spacing: 12) {
                ForEach(HomeViewCategories.allCases, id: \.rawValue) { category in
                    Button(action: {
                        withAnimation(.snappy) {
                            activeCategory = category
                        }
                    }) {
                        Text(category.rawValue)
                            .font(.callout)
                            .foregroundStyle(activeCategory == category ? (scheme == .dark ? .black : .white) : Color.primary)
                            .padding(.vertical, 8)
                            .padding(.horizontal, 15)
                            .background {
                                if activeCategory == category {
                                    Capsule()
                                        .fill(Color.primary)
                                        .matchedGeometryEffect(id: "ACTIVECATEGORY", in: animation)
                                } else {
                                    Capsule()
                                        .fill(.background)
                                }
                            }
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .frame(height: 50)
        .scrollIndicators(.hidden)
    }
}

#Preview {
    HomeFilterView()
}
