//
//  AdminIconView.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/23/24.
//

import SwiftUI

struct AdminIconView: View {
    
    var label:String
    var imageName:String
    var size:CGSize
    
    var body: some View {
        
        VStack {
            Image(systemName: imageName)
            
            Text(label)
        }
        .frame(maxWidth: (size.width)/3, maxHeight: size.height/4)
        .padding()
        .background(
            Color.gray.opacity(0.2)
        )
        .cornerRadius(10)
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(Color.primary, lineWidth: 2)
        )
        
    }
    
}

#Preview {
    AdminIconView(label: "Facilities", imageName:"building", size:CGSize(width:300, height:600))
}
