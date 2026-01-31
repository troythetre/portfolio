import Foundation

class UserProfileViewModel: ObservableObject {
    @Published var beats = [Beat]()
    @Published var likedBeats = [Beat]()
    @Published var archivedBeats = [Beat]()
    
    private let userService = UserService()
    private let service = BeatService()
    let user: AppUser
    
    private var userCache: [String: AppUser] = [:] // Caching users to avoid redundant network requests
    
    init(user: AppUser) {
        self.user = user
        self.fetchUserBeats()
        self.fetchLikedBeats()
        self.fetchArchivedBeats()
    }
    
    var actionButtonTitle: String {
        return user.isCurrentUser ? "Edit Profile" : "Follow"
    }
    
    func beats(forFilter filter: FilterViewModel) -> [Beat] {
        switch filter {
        case .archive:
            return beats
        case .sold:
            return likedBeats
        case .saved:
            return archivedBeats
        case .library:
            return beats
        }
    }
    
    func fetchUserBeats() {
        guard let uid = user.id else {
            print("❌ Error: User ID is nil")
            return
        }
        service.fetchBeats(forUid: uid) { beats in
            DispatchQueue.main.async {
                self.beats = beats.map { beat in
                    var newBeat = beat
                    newBeat.user = self.user
                    return newBeat
                }
            }
        }
    }
    
    func fetchLikedBeats() {
        guard let uid = user.id else { return }
        service.fetchLikedBeats(forUid: uid) { beats in
            self.assignUsersToBeats(beats) { updatedBeats in
                DispatchQueue.main.async {
                    self.likedBeats = updatedBeats
                }
            }
        }
    }
    
    func fetchArchivedBeats() {
        guard let uid = user.id else { return }
        service.fetchArchivedBeats(forUid: uid) { beats in
            self.assignUsersToBeats(beats) { updatedBeats in
                DispatchQueue.main.async {
                    self.archivedBeats = updatedBeats
                }
            }
        }
    }
    
    /// Assigns users to beats efficiently using caching.
    private func assignUsersToBeats(_ beats: [Beat], completion: @escaping ([Beat]) -> Void) {
        var updatedBeats = beats
        let group = DispatchGroup()
        
        for i in 0 ..< updatedBeats.count {
            let uid = updatedBeats[i].userID
            
            if let cachedUser = userCache[uid] {
                updatedBeats[i].user = cachedUser
            } else {
                group.enter()
                userService.fetchUser(withUid: uid) { user in
                    DispatchQueue.main.async {
                        if i < updatedBeats.count { // Prevent out-of-bounds errors
                            updatedBeats[i].user = user
                            self.userCache[uid] = user // Store user in cache
                        }
                        group.leave()
                    }
                }
            }
        }
        
        group.notify(queue: .main) {
            completion(updatedBeats)
        }
    }
}
