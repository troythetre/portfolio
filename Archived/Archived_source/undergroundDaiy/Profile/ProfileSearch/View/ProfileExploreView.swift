//
//  ExploreView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/17.
//

import SwiftUI

struct ProfileExploreView: View {
    
    @ObservedObject var viewModel = ExploreViewModel()
    
    var body: some View {
        VStack {
            SearchBar(text: $viewModel.searchedText)
                .padding()
            
            ScrollView {
                LazyVStack {
                    ForEach(viewModel.searchableUser) { user in
                        NavigationLink {
                            ProfileView(user: user)
                        } label: {
                            UserRowView(user: user)
                        }
                    }
                }
            }
        }
        .navigationBarTitle("Explore")
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    ProfileExploreView()
}
