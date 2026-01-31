//
//  ArchivedProfileView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2025/1/27.
//

import SwiftUI

struct ArchivedProfileView: View {
    var profile: AppUser
    
    var body: some View {
        VStack {
            AsyncImage(url: URL(string: profile.profileImageUrl)) { image in
                image.resizable()
                    .scaledToFill()
                    .frame(width: 90, height: 90)
                    .clipShape(Circle())
                    .cornerRadius(20)
            } placeholder: {
                ProgressView()
            }
            
            MarqueeText(text: "@\(profile.username)", uniqueID: profile.id!, textColor: Color(hex: "#06b9ff"))
                .frame(width: 90, height: 20)
                .padding(.top, 2)
            
            HStack {
                MarqueeText(text: profile.tag, uniqueID: profile.id!, textColor: .white)
                    .font(.system(size: 6))
                    .padding(.horizontal, 6)
                    .frame(maxWidth: .infinity)
                    .lineLimit(1)
                    .multilineTextAlignment(.center)
                    .background(
                        Capsule()
                            .stroke(Color(hex: "#06b9ff"), lineWidth: 2)
                    )
                
                Spacer()
                
                Text("12k")
                    .font(.footnote)
                    .foregroundStyle(.gray)
                    
            }
            
            
                
            
        }
        .frame(width: 90) //adjust as needed
        .padding()
    }
}

