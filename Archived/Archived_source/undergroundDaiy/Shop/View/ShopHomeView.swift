//
//  ShopHome.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/7/19.
//

import SwiftUI

struct ShopHomeView: View {
    @StateObject var cartManager = CartManager()
    var columns = [GridItem(.adaptive(minimum: 160), spacing: 20)]
    @State private var searchedText = ""
    @State private var selectedFilter: ShopHomeFilterViewModel = .trending //tab view
    
    @Namespace var animation //navigation between articles
    
    
    var body: some View {
        NavigationView {
            
            ScrollView {
                HStack {
                    TextField("Search on 808archive", text: $searchedText)
                        .font(.subheadline)
                        .padding(12)
                        .background(Color(.systemGray6))
                        .cornerRadius(10)
                        .padding(.horizontal, 24)
                }
                .padding(.vertical)
                filterBar.padding(.vertical)
                LazyVGrid(columns: columns, spacing: 20) {
                    ForEach(productList, id: \.id) { product in
                        NavigationLink {
                            ProductCardView(product: product)
                                .environmentObject(cartManager)
                        } label: {
                            ProductCard(product: product)
                                .environmentObject(cartManager)
                        }
                        
                        
                    }
                }
            }
            .navigationTitle(Text("Shop"))
            .toolbar {
                NavigationLink {
                    CartView()
                        .environmentObject(cartManager)
                } label: {
                    CartButton(numOfProducts: cartManager.products.count)
                }
                
            }
        }
        .navigationViewStyle(StackNavigationViewStyle())
        
    }
    
}

#Preview {
    ShopHomeView()
}

extension ShopHomeView {
    var filterBar: some View {
        HStack {
            ForEach(ShopHomeFilterViewModel.allCases, id: \.rawValue) { item in //posts, upvotes, downvotes, archives
                VStack {
                    Text(item.title)
                        .font(.subheadline)
                        .fontWeight(selectedFilter == item ? .semibold: .regular) //if selected, fontWeight = semibold
                        .foregroundColor(selectedFilter == item ? .white: .gray) //if selected, color = white
                    
                    if selectedFilter == item {
                        Capsule()
                            .foregroundColor(.white)
                            .frame(height: 3)
                            .matchedGeometryEffect(id: "filter", in: animation)
                    } else {
                        Capsule()
                            .foregroundColor(Color(.clear))
                            .frame(height: 3)
                    }
                }
                .onTapGesture {
                    withAnimation(.easeInOut) {
                        self.selectedFilter = item
                    }
                }
            }
        }
        .overlay(Divider().offset(x: 0, y: 16))
    }
}
