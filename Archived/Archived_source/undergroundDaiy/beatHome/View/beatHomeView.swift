//
//  beatHomeView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2025/1/6.
//

import SwiftUI
import SDWebImageSwiftUI
import FirebaseFirestore

struct Beat: Identifiable, Decodable {
    @DocumentID var id: String?  // Use this for Firestore's auto-generated ID
    var beatName: String
    var price: Double
    var fileURL: String
    var fileName: String
    var coverArtURL: String?
    var userID: String
    var username: String
    var userProfilePicture: String
    var beatStreams: Int
    var beatLikes: Int
    var beatComments: Int
    var beatArchives: Int
    var timestamp: Date
    
    var user: AppUser?
    var didLike: Bool? = false
    var didDislike: Bool? = false
    var didComment: Bool? = false
    var didArchive: Bool? = false
    var didShare: Bool? = false
}

struct beatHomeView: View {
    
    //@State var beat: Beat?
    @State var beats: [Beat] = []
    @State private var isLoading: Bool = true
    @State private var errorMessage: String? = nil
    
    @State var trending: Trending?
    @State var currentIndex = 0
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 6) {
                Divider()
                    .foregroundStyle(.white)
                    .padding(.vertical, 8)
                
                Text("Tap In")
                    .fontWeight(.bold)
                    .font(.system(size: 22))
                headlineSlideshow
                // Display beats in list view
                
                VStack {
                    Text("More trending opens")
                        .font(.system(size: 12))
                        .padding(.horizontal, 16)
                        .background(Color.gray)
                        .clipShape(Capsule())
                        .frame(maxWidth: .infinity, alignment: .center)
                }
                .padding(.vertical, 12)
                
                Divider()
                    .foregroundStyle(.white)
                    .padding(.vertical, 8)
                    .padding(.top, 4)
                
                //Display error message if there is an issue
                if let errorMessage = errorMessage {
                    Text(errorMessage)
                        .foregroundStyle(.red)
                        .padding()
                }
                
//                ForEach(beats, id: \.id) { beat in
//                    NavigationLink {
//                        beatProductView(beat: beat)
//                    } label: {
//                        beatRowView(beat: beat)
//                    }
//                }
                
                // Display the beats if they exist
                ForEach(beats, id: \.id) { beat in
                    NavigationLink {
                        beatProductView(beat: beat, commentService: CommentService())
                    } label: {
                        beatRowView(beat: beat)
                    }
                }
                
                Spacer()
            }
            .onAppear {
                fetchBeats()
            }
        }
    }
    
    func fetchBeats() {
        let db = Firestore.firestore()
        db.collection("beats").order(by: "timestamp", descending: true) //order beats by uploading date & time
            .getDocuments { snapshot, error in
                if let error = error {
                    errorMessage = "Error fetching beats: \(error.localizedDescription)"
                    isLoading = false
                    return
                }
                
                // Log snapshot for debugging
                print("Fetched beats: \(String(describing: snapshot?.documents))")
                
                // Check if documents exist
                if snapshot?.documents.isEmpty == true {
                    print("No documents found!")
                }
                
                //Parse the beats from Firestore
                beats = snapshot?.documents.compactMap{ document in
                    var beat = try? document.data(as: Beat.self)
                    if beat == nil {
                        print("Error decoding beat from document: \(document.documentID)")
                    }
                    return beat
                } ?? []
                
                isLoading = false
            }
    }
}

//VStack(alignment: .leading, spacing: 6) {
//    Divider()
//    Text("Tap In")
//        .fontWeight(.bold)
//        .font(.system(size: 22))
//    headlineSlideshow
//    // Display beats in list view
//    beatHomeView()
//        .padding(.top, 10)
//    Spacer() // Pin the NavigationStack to the top
//}

struct TrendingView: View {
    var trending: Trending?
    
    var body: some View {
        ZStack {
            // The animated GIF
            AnimatedImage(url: URL(string: trending!.gifUrl))
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(width: 250, height: 250)
                .clipShape(RoundedRectangle(cornerRadius: 15))
                .shadow(radius: 10)
                .opacity(0.3)

            VStack {
                // Top section with text and artist info
                VStack(spacing: 8) {  // Adjust spacing between elements
                    Text("*NEW* - \(trending!.title)")
                        .font(.title3)
                        .foregroundColor(.white)
                    
                    HStack(spacing: 10) {
                        Image(systemName: "music.note")
                            .resizable()
                            .frame(width: 15, height: 15)
                        Text("songName")
                            .font(.system(size: 10))
                            .foregroundColor(.white)
                        Spacer()
                    }

                    HStack(spacing: 12) {
                        Image("izayatijitypebeat")  // Assuming you have an image asset
                            .resizable()
                            .frame(width: 25, height: 25)
                            .clipShape(Circle())
                        
                        VStack(spacing: 2) {
                            Text("@(artistHandle)")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "#06b9ff"))
                            
                            Text("artistName")
                                .font(.system(size: 10))
                                .foregroundColor(.white)
                                .padding(.horizontal, 12)
                                .overlay(Capsule().stroke(Color.purple, lineWidth: 0.5))
                                .clipShape(Capsule())
                        }
                        Spacer()
                    }
                }
                .padding(16)  // Padding around the text content
                
                Spacer()

                // Bottom section with stats and buttons
                HStack {
                    Spacer()
                    HStack(spacing: 20) {
                        Image(systemName: "heart.fill")
                            .resizable()
                            .frame(width: 14, height: 14)
                        Text("stats.likes")
                            .font(.system(size: 12))
                            .foregroundStyle(.gray)
                        
                        Image(systemName: "play.square.stack.fill")
                            .resizable()
                            .frame(width: 14, height: 14)
                        Text("stats.plays")
                            .font(.system(size: 12))
                            .foregroundStyle(.gray)
                        
                        Button {
                            // Button action
                        } label: {
                            Image(systemName: "lock.fill")
                                .foregroundStyle(.white)
                                .padding(.horizontal, 24)
                                .background(Color.green)
                                .clipShape(Capsule())
                                .shadow(radius: 5)
                        }
                    }
                    .padding(.horizontal, 16) // Padding for the buttons and stats section
                }
                .padding(.bottom, 20)  // Bottom padding for the ZStack
            }
            .frame(width: 250, height: 250, alignment: .center)
            .background(Color.gray.opacity(0.2))
            .cornerRadius(15)
            .shadow(radius: 10)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity) // This ensures ZStack takes up the available space
    }
}

extension beatHomeView {
    var headlineSlideshow: some View {
        // Horizontal ScrollView (Slideshow)
        ScrollViewReader { scrollViewProxy in
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(0..<trendings.count, id: \.self) { index in
                        ZStack {
                            AnimatedImage(url: URL(string: trendings[index].gifUrl))
                                .resizable()
                                .scaledToFill()  // To maintain image proportions while filling the frame
                                .frame(width: 275, height: 275)
                                .clipShape(RoundedRectangle(cornerRadius: 15))  // Ensure rounded corners are applied
                                .shadow(radius: 10, y: 10)
                                .padding()
                                .opacity(0.65)
                                .onTapGesture {
                                    // Handle image tap and center it on tap
                                    currentIndex = index
                                    withAnimation {
                                        scrollViewProxy.scrollTo(index, anchor: .center)
                                    }
                                }
                            
                            // Top of ZStack
                            VStack(alignment: .leading, spacing: 2) {
                                Text(trendings[index].title)
                                    .fontWeight(.bold)
                                    .font(.system(size: 16))
                                    .padding(.leading, 10)
                                HStack(spacing: 2) {
                                    Image(trendings[index].image)
                                        .resizable()
                                        .frame(width: 30, height: 30)
                                        .clipShape(.circle)
                                    VStack(spacing: 1) {
                                        Text("@\(trendings[index].artistUsername)")
                                            .foregroundStyle(Color(hex: "#06b9ff"))
                                            .font(.system(size: 14))
                                        
                                        Text("Producer")
                                            .font(.system(size: 10))
                                            .foregroundStyle(.white)
                                            .padding(.horizontal, 12)
                                            .overlay(
                                                Capsule()
                                                    .stroke(LinearGradient(
                                                        gradient: Gradient(colors: [Color(hex: "#5de0e6"), Color(hex: "#004aad")]),
                                                        startPoint: .topLeading,
                                                        endPoint: .bottomTrailing
                                                    ), lineWidth: 2)
                                            )
                                            .clipShape(Capsule())
                                    }
                                    Spacer()
                                
                                    Image(systemName: "ellipsis")
                                        .resizable()
                                        .frame(width: 10, height: 3)
                                        .padding(.trailing, 45)
                                }
                                .padding(.leading, 25)
                            }
                            .frame(alignment: .leading)
                            .foregroundColor(.white)  // Set text color to white for contrast
                            .position(x: 160, y: 140)  // Position the text on top of the image
                            .offset(y: -90)  // Move the text to the top (adjust as necessary)
                            .padding(.leading, 5)
                            
                            //Bottom of Zstack
                            VStack {
                                Spacer()
                                HStack {
                                    Image(systemName: "waveform")
                                        .resizable()
                                        .frame(width: 14, height: 14)
                                    Text("110k")
                                        .font(.system(size: 12))
                                        .foregroundStyle(.white)
                                    Image(systemName: "circle.fill")
                                        .resizable()
                                        .frame(width: 2, height: 2)
                                    Image(systemName: "heart.fill")
                                        .resizable()
                                        .foregroundStyle(.red)
                                        .frame(width: 14, height: 14)
                                    Text("1.4M")
                                        .font(.system(size: 12))
                                        .foregroundStyle(.white)
                                    Image("circle.fill")
                                        .resizable()
                                        .frame(width: 4, height: 4)
                                    Button {
                                        
                                    } label: {
                                        Image(systemName: "lock.fill")
                                            .resizable()
                                            .frame(width: 6, height: 10)
                                            .foregroundStyle(.white)
                                            .padding(.horizontal, 24)
                                            .padding(.vertical, 3)
                                            .background(LinearGradient(
                                                gradient: Gradient(colors: [Color(hex: "#0097b2"), Color(hex: "#7ed957")]),
                                                startPoint: .topLeading,
                                                endPoint: .bottomTrailing
                                            ))
                                            .clipShape(Capsule())
                                            .shadow(radius: 5)
                                    }
                                }
                                .padding(.horizontal)
                                .frame(maxWidth: .infinity, maxHeight: 60)
                            }
                            .padding(.bottom, 10)
                            
                        }
                        .tag(index)  // Tag for scroll position reference
                        .id(index)   // Assign unique id to each item
                    }
                }
                .padding(.horizontal, 20)  // Adjust horizontal padding
            }
            .frame(height: 260) // Adjust the height of the horizontal scroll view
            .padding(.vertical, 5) // Add space above and below the scroll view
            
            // Scroll to the current item when the index changes
            .onChange(of: currentIndex) { newIndex in
                withAnimation {
                    scrollViewProxy.scrollTo(newIndex, anchor: .center)
                }
            }
            
            // Ensure that the first item is centered when the view appears
            .onAppear {
                scrollViewProxy.scrollTo(currentIndex, anchor: .center)
            }
        }
    }
}
