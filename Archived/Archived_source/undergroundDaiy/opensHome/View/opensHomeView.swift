import SwiftUI
import SDWebImageSwiftUI
import FirebaseFirestore

struct opensHomeView: View {
    @State var trending: Trending?
    @State var opens: [ArtistOpen] = []
    @State private var isLoading: Bool = true
    @State private var errorMessage: String? = nil
    let gifUrl: String = "https://media1.giphy.com/media/hAqL0H7V6KsZV06h6e/200w.gif?cid=82a1493bfqupf5elblx62s07q08ets44s316a4he9sudreav&ep=v1_gifs_related&rid=200w.gif&ct=g"
    
    var body: some View {
        ScrollView {
            VStack(alignment: .center) {
                Divider()
                
                // Header Section
                VStack(alignment: .leading) {
                    Text("Tap In")
                        .fontWeight(.bold)
                        .font(.system(size: 28))
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal)
                        .padding(.leading, 10)
                }
                .padding(.bottom, 10)
                
                opensHeadline()
                
                // Trending Section
                VStack {
                    Text("More trending opens")
                        .font(.system(size: 12))
                        .padding(.horizontal, 16)
                        .background(Color.gray)
                        .clipShape(Capsule())
                        .frame(maxWidth: .infinity, alignment: .center)
                }
                //.padding(.vertical, 20)
                
                Divider()
                    .padding(.bottom, 10)
                
                ForEach(opens, id: \.id) { open in
                    opensListing(open: open)
                        .padding(.vertical, 2)
                }
                
                

            }
            .frame(maxWidth: .infinity) // Ensure VStack takes the full width
            .padding(.bottom, 20) // Add padding at the bottom to ensure last item is scrollable
            .onAppear {
                fetchOpens()
            }
        }
        .edgesIgnoringSafeArea(.all)
    }
    
    func opensListing(open: ArtistOpen) -> some View {
        // Second ZStack with GIF
        ZStack {
            AnimatedImage(url: URL(string: open.coverArtURL!))
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(width: 400, height: 180)
                .clipShape(RoundedRectangle(cornerRadius: 15))
                .shadow(radius: 10)
                .opacity(0.3)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(open.beatName)
                    .fontWeight(.bold)
                    .font(.system(size: 14))
                
                HStack(spacing: 10) {
                    Image(open.userProfilePicture)
                        .resizable()
                        .frame(width: 20, height: 20)
                        .clipShape(Circle())
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text("@\(open.username)")
                            .foregroundStyle(Color(hex: "#06b9ff"))
                            .font(.system(size: 12))
                        
                        Text("Artist")
                            .font(.system(size: 10))
                            .foregroundStyle(.white)
                            .padding(.horizontal, 12)
                            .overlay(
                                Capsule()
                                    .stroke(LinearGradient(
                                        gradient: Gradient(colors: [Color(hex: "#ff5757"), Color(hex: "#8c52ff")]),
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    ), lineWidth: 2)
                            )
                            .clipShape(Capsule())
                    }
                    Spacer()
                }
                
                
            }
            .foregroundColor(.white)
            .padding(.horizontal)
            .offset(y: -60)
            
            //Bottom of Zstack
            VStack {
                Spacer()
                HStack {
                    HStack {
                        Image(systemName: "waveform")
                            .resizable()
                            .frame(width: 16, height: 16)
                        Text("110k")
                            .font(.system(size: 14))
                            .foregroundStyle(.white)
                        Image(systemName: "circle.fill")
                            .resizable()
                            .frame(width: 2, height: 2)
                        Image(systemName: "heart.fill")
                            .resizable()
                            .foregroundStyle(.red)
                            .frame(width: 16, height: 16)
                        Text("1.4M")
                            .font(.system(size: 14))
                            .foregroundStyle(.white)
                        Button {
                            
                        } label: {
                            Image(systemName: "lock.fill")
                                .resizable()
                                .frame(width: 8, height: 12)
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
                    .frame(maxWidth: .infinity, alignment: .trailing) // Align HStack to the right
                }
                
                
            }
            .padding(.bottom, 15)
        }
        .frame(width: 350, height: 180)
        //.padding(.bottom, 20)
    }
    
    func opensHeadline() -> some View {
        // ZStack with GIF and Content
        ZStack {
            AnimatedImage(url: URL(string: gifUrl))
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(width: 450, height: 350)
                .clipShape(Rectangle())
                .shadow(radius: 10)
                .opacity(0.3)
            
            LinearGradient(
                gradient: Gradient(colors: [
                    Color.black.opacity(0.8), // Fade at the top
                    Color.clear,              // Fully visible in the middle
                    Color.black.opacity(0.8)  // Fade at the bottom
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
            .blendMode(.overlay)

            
            //top text
            VStack(alignment: .leading, spacing: 4) {
                Text("Penthouse Shordy")
                    .fontWeight(.bold)
                    .font(.system(size: 18))
                
                HStack(spacing: 5) {
                    Image("izayatijitypebeat")
                        .resizable()
                        .frame(width: 30, height: 30)
                        .clipShape(Circle())
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text("@domcorleo")
                            .foregroundStyle(Color(hex: "#06b9ff"))
                            .font(.system(size: 12))
                        
                        Text("Artist")
                            .font(.system(size: 10))
                            .foregroundStyle(.white)
                            .padding(.horizontal, 12)
                            .background(Color.clear)
                            .overlay(
                                Capsule()
                                    .stroke(LinearGradient(
                                        gradient: Gradient(colors: [Color(hex: "#ff5757"), Color(hex: "#8c52ff")]),
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    ), lineWidth: 2)
                            )
                            .clipShape(Capsule())
                    }
                    Spacer()
                }
            }
            .foregroundColor(.white)
            .padding(.horizontal)
            .padding(.leading, 12)
            .offset(y: -130) // Adjust text position
            
            //Bottom of Zstack
            VStack {
                Spacer()
                HStack {
                    HStack {
                        Image(systemName: "waveform")
                            .resizable()
                            .frame(width: 16, height: 16)
                        Text("110k")
                            .font(.system(size: 14))
                            .foregroundStyle(.white)
                        Image(systemName: "circle.fill")
                            .resizable()
                            .frame(width: 2, height: 2)
                        Image(systemName: "heart.fill")
                            .resizable()
                            .foregroundStyle(.red)
                            .frame(width: 16, height: 16)
                        Text("1.4M")
                            .font(.system(size: 14))
                            .foregroundStyle(.white)
                        Button {
                            
                        } label: {
                            Image(systemName: "lock.fill")
                                .resizable()
                                .frame(width: 8, height: 12)
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
                    .frame(maxWidth: .infinity, alignment: .trailing) // Align HStack to the right
                    .padding(.trailing, 10)
                }
                
                
            }
            .padding(.bottom, 15)
        }
        .frame(width: 450, height: 350)
        .background(Color.gray.opacity(0.2))
        .shadow(radius: 10)
    }
    
    func fetchOpens() {
        let db = Firestore.firestore()
        db.collection("opens").order(by: "timestamp", descending: true).getDocuments { snapshot, error in
            if let error = error {
                errorMessage = "Error fetching opens: \(error.localizedDescription)"
                isLoading = false
                return
            }
            
            print("Fetched opens: \(String(describing: snapshot?.documents))")
            
            if snapshot?.documents.isEmpty == true {
                print("No documents found!")
            }
            
            opens = snapshot?.documents.compactMap{ document in
                var open = try? document.data(as: ArtistOpen.self)
                if open == nil {
                    print("Error decoding beat from document: \(document.documentID)")
                }
                return open
            } ?? []
            
            isLoading = false
        }
    }
}
