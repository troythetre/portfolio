import SwiftUI

struct HomeProfileListView: View {
    @ObservedObject var viewModel = ArchivedProfileViewModel()
    
    var body: some View {
        NavigationView {
            ScrollView {
                LazyVStack {
                    let chunkedProfiles = viewModel.profiles.chunked(into: 3) // Precompute chunks to reduce type-checking burden
                    
                    ForEach(chunkedProfiles.indices, id: \.self) { index in
                        ProfileRow(profiles: chunkedProfiles[index])
                    }
                }
                .padding()
            }
        }
    }
}

struct ProfileRow: View {
    let profiles: [AppUser] // Adjust to match your model

    var body: some View {
        HStack {
            ForEach(profiles, id: \.id) { profile in
                NavigationLink(destination: ProfileView(user: profile)) {
                    ArchivedProfileView(profile: profile)
                }
            }
        }
        .padding(.bottom, 20)
    }
}

// Extension for Array Chunking
extension Array {
    func chunked(into size: Int) -> [[Element]] {
        stride(from: 0, to: count, by: size).map {
            Array(self[$0..<Swift.min($0 + size, count)])
        }
    }
}
