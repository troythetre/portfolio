//
//  StreamsView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/6.
//

import SwiftUI
import StreamVideo

struct Secrets {
    static let userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiV2VkZ2VfQW50aWxsZXMiLCJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL1dlZGdlX0FudGlsbGVzIiwiaWF0IjoxNzE3NzEwNDgyLCJleHAiOjE3MTgzMTUyODd9.CC0qGua8mCTInnOAHNmKRC_CpWXwJXsJiVTn07AHLys"
    static let userID = "Wedge_Antilles"
    static let callID = "9n4CaYI7GGrC"
    static let apiKey = "mmhfdzb5evj2"
}

struct StreamsView: View {
    @State var streamVideo: StreamVideo
    let call: Call
    
    init() {
        let user = User(id: Secrets.userID, name: "archive")
        
        let streamVideo = StreamVideo(apiKey: Secrets.apiKey, user: user, token: UserToken(rawValue: Secrets.userToken))
        let call = streamVideo.call(callType: .livestream, callId: Secrets.callID)
        self.streamVideo = streamVideo
        
        self.call = call
    }
    
    var body: some View {
        NavigationStack {
            NavigationLink("View") {
                EmptyView()
            }
            .padding()
            .background(
                RoundedRectangle(cornerRadius: 10)
                    .fill(.ultraThinMaterial)
            )
        }
    }
}

#Preview {
    StreamsView()
}
