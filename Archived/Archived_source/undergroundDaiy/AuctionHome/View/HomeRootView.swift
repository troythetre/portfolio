//
//  homeRootView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/12/30.
//

import SwiftUI
import FirebaseFirestore

struct HomeRootView: View {
    @State private var searchedText = ""
    @State private var results: [Beat] = [] // This will hold your search results.
    @State private var activeCategory: HomeViewCategories = .all
    @Environment(\.colorScheme) private var scheme
    @Namespace private var animation
    private let db = Firestore.firestore() // Firestore instance
    
    var body: some View {
        NavigationStack {
            VStack{
                Divider()
                HStack { //search bar
                    TextField("Search the archive", text: $searchedText)
                        .font(.subheadline)
                        .padding(10)
                        .background(Color(.systemGray6))
                        .cornerRadius(20)
                        .padding(.horizontal, 24)
                        .onChange(of: searchedText) { _ in
                            performSearch() // Trigger search on text change
                        }
                }
                .padding(.vertical)
                
                FilterBarView(activeCategory: $activeCategory)
                
                if !results.isEmpty {
                    // Display search results if available
                    List(results) { beat in
                        NavigationLink(destination: beatProductView(beat: beat, commentService: CommentService())) {
                            HStack(spacing: 15) {
                                // Load cover art from URL
                                AsyncImage(url: URL(string: beat.coverArtURL ?? "")) { image in
                                    image
                                        .resizable()
                                        .scaledToFill()
                                } placeholder: {
                                    Color.gray // Placeholder color while loading
                                }
                                .frame(width: 50, height: 50)
                                .clipShape(RoundedRectangle(cornerRadius: 10))

                                VStack(alignment: .leading, spacing: 5) {
                                    Text(beat.beatName)
                                        .font(.headline)
                                    Text(beat.username)
                                        .font(.subheadline)
                                        .foregroundColor(.gray)
                                }
                            }
                            .padding(.vertical, 5)
                        }
                        
                    }
                } else {
                    if activeCategory == .all {
                        auctionAllView()
                    }
                    
                    if activeCategory == .beats {
                        beatHomeView()
                    }
                    
                    if activeCategory == .opens {
                        opensHomeView()
                    }
                    
                    if activeCategory == .tracks {
                        auctionAllView()
                    }
                    
                    if activeCategory == .profiles {
                        HomeProfileListView()
                    }
                }
            }
        }
    }
    
    func performSearch() {
        guard !searchedText.isEmpty else {
            results = []
            return
        }
        
        print("Searching Firestore for: \(searchedText)")
        
        db.collection("beats")
            .whereField("beatName", isGreaterThanOrEqualTo: searchedText)
            .whereField("beatName", isLessThanOrEqualTo: searchedText + "\u{f8ff}") //prefix search
            .getDocuments(completion: { (snapshot, error) in
                if let error = error {
                    print("Error fetching data: \(error.localizedDescription)")
                    return
                }
                
                guard let documents = snapshot?.documents else {
                    print("No documents found.")
                    results = []
                    return
                }
                
                DispatchQueue.main.async {
                    // Map results to the results array
                    results = documents.compactMap { doc in
                        let data = doc.data()
                        return Beat(
                            id: doc.documentID,
                            beatName: data["beatName"] as? String ?? "",
                            price: Double(data["price"] as? Int ?? 0),
                            fileURL: data["fileURL"] as? String ?? "",
                            fileName: data["fileName"] as? String ?? "",
                            coverArtURL: data["coverArtURL"] as? String ?? "",
                            userID: data["userID"] as? String ?? "",
                            username: data["username"] as? String ?? "",
                            userProfilePicture: data["userProfilePicture"] as? String ?? "",
                            beatStreams: data["beatStreams"] as? Int ?? 0,
                            beatLikes: data["beatLikes"] as? Int ?? 0,
                            beatComments: data["beatComments"] as? Int ?? 0,
                            beatArchives: data["beatArchives"] as? Int ?? 0,
                            timestamp: (data["timestamp"] as? Timestamp)?.dateValue() ?? Date()
                        )
                    }
                }
            })
    }
    
    
}

// Filter Bar View as an extension to make it reusable
struct FilterBarView: View {
    @Binding var activeCategory: HomeViewCategories
    @Namespace private var animation
    @Environment(\.colorScheme) private var scheme
    
    var body: some View {
        ScrollView(.horizontal) {
            HStack(spacing: 12) {
                ForEach(HomeViewCategories.allCases, id: \.rawValue) { category in
                    Button(action: {
                        withAnimation(.snappy) {
                            activeCategory = category
                        }
                    }) {
                        Text(category.rawValue)
                            .font(.callout)
                            .fontWeight(.semibold)
                            .foregroundStyle(activeCategory == category ? (scheme == .dark ? .black : .white) : Color.primary)
                            .padding(.vertical, 8)
                            .padding(.horizontal, 15)
                            .background {
                                if activeCategory == category {
                                    Capsule()
                                        .fill(Color.primary)
                                        .matchedGeometryEffect(id: "ACTIVECATEGORY", in: animation)
                                } else {
                                    Capsule()
                                        .fill(.background)
                                }
                            }
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .frame(height: 50)
        .scrollIndicators(.hidden)
    }
}
