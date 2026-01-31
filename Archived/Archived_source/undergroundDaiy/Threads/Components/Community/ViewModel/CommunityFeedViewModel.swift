//
//  SingleCommunityFeedViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/7.
//

import Foundation

class CommunityFeedViewModel: ObservableObject {
    @Published var community: Community
    
    init(community: Community) {
        self.community = community
    }
}
