//
//  OfferView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2025/1/15.
//

import SwiftUI

struct OfferView: View {
    @State private var userInput: String = ""  // Binding to store user input
    var body: some View {
        VStack(alignment: .leading) {
            Text("Offer Proposal")
                .font(.system(size: 24))
            
            HStack {
                Image("izayatijitypebeat")
                    .resizable()
                    .frame(width: 60, height: 60)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                VStack(alignment: .leading) {
                    Text("Summrs x Desire type beat")
                        .font(.system(size: 14))
                        .fontWeight(.semibold)
                    Text("@prod. jxy!")
                        .font(.system(size: 12))
                        .foregroundStyle(.blue)
                    HStack {
                        Image(systemName: "waveform")
                            .resizable()
                            .frame(width: 10, height: 10)
                        Image(systemName: "heart.fill")
                            .resizable()
                            .frame(width: 10, height: 10)
                            .foregroundStyle(.red)
                    }
                    
                    
                }
            }
            
            VStack {
                Text("My Offer")
                    .font(.system(size: 10))
                    .fontWeight(.semibold)
                
                // TextField for entering offer code
                TextField("USD", text: $userInput)
                    .padding()
                    .background(Color.white)
                    .cornerRadius(10)
                    .shadow(radius: 5)
                    .padding(.horizontal, 20)
            }
            
            Spacer()
        }
    }
}

#Preview {
    OfferView()
}
