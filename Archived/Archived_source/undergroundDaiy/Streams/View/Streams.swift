//
//  ViewD.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/12.
//

import SwiftUI

struct Streams: View {
    var body: some View {
        ZStack {
            Color.blue
            
            Image("logo")
                .resizable()
                .aspectRatio(contentMode: /*@START_MENU_TOKEN@*/.fill/*@END_MENU_TOKEN@*/)
                .frame(width: 300, height: 300)
        }
        
    }
}

struct Streams_Previews: PreviewProvider {
    static var previews: some View { Streams()
    }
}
