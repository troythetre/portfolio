//
//  ProductCardView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/7/19.
//

import SwiftUI

struct ProductCardView: View {
    @EnvironmentObject var cartManager: CartManager
    var product: Product
    
    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            
            
            
            VStack(alignment: .center) {
                
                Image(product.image)
                    .resizable()
                    .scaledToFit()
                    .cornerRadius(30)
                
                VStack {
                    Text(product.name)
                        .bold()
                    
                    Text(product.date)
                        .font(.caption)
                    Text(product.description)
                        .font(.caption2)
                    
                    Text("$\(product.price)")
                        .font(.caption)
                }
                .padding()
                .frame(width: 400, alignment: .center)
                    .background(.ultraThinMaterial)
                    .cornerRadius(40)
            }
            
            Button {
                cartManager.addToCart(product: product)
            } label: {

                Image(systemName: "plus")
                    .padding(10)
                    .foregroundStyle(.white)
                    .background(.blue)
                    .cornerRadius(50)
                    .padding()
            }
        }

//        ZStack(alignment: .topTrailing) {
//            ZStack(alignment: .bottom) {
//                Image(product.image)
//                    .resizable()
//                    .cornerRadius(20)
//                    .frame(width: 180)
//                    .scaledToFit()
//                
//                VStack(alignment: .leading) {
//                    Text(product.name)
//                        .bold()
//                    
//                    Text("$\(product.price)")
//                        .font(.caption)
//                }
//                .padding()
//                .frame(width: 180, alignment: .leading)
//                .background(.ultraThinMaterial)
//                .cornerRadius(20)
//            }
//            .frame(width: 180, height: 250)
//            .shadow(radius: 3)
//            
//            Button {
//                cartManager.addToCart(product: product)
//            } label: {
//                
//                Image(systemName: "plus")
//                    .padding(10)
//                    .foregroundStyle(.white)
//                    .background(.black)
//                    .cornerRadius(50)
//                    .padding()
//            }
//        }
    }
}

#Preview {
    ProductCardView(product: productList[0])
        .environmentObject(CartManager())
}
