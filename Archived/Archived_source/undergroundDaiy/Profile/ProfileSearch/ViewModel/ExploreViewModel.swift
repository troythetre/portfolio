//
//  ExploreViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/24.
//

import Foundation

class ExploreViewModel: ObservableObject {
    @Published var users = [AppUser]()
    @Published var searchedText = ""
    
    var searchableUser: [AppUser] {
        if searchedText.isEmpty {
            return users
        } else {
            let lowercasedQuery = searchedText.lowercased()
            
            return users.filter({
                $0.username.contains(lowercasedQuery) ||
                $0.fullname.lowercased().contains(lowercasedQuery)
            })
        }
    }
    let service = UserService()
    
    init() {
        fetchUsers()
    }
    
    func fetchUsers() {
        service.fetchUsers { users in
            self.users = users
        }
    }
}
