//
//  LivestreamView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/6.
//

import SwiftUI
import StreamVideoSwiftUI

struct LivestreamView: View {
    let callID: String
    
    var body: some View {
        VStack {
            LivestreamPlayer(type: .livestream, id: callID)
        }
    }
}

//#Preview {
//    LivestreamView()
//}
