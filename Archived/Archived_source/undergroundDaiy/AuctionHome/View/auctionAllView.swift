import SwiftUI
import SDWebImageSwiftUI

struct auctionAllView: View {
    @State var trending: Trending?
    @State var currentIndex = 0
    @ObservedObject var viewModel = ArchivedProfileViewModel()
    
    var body: some View {
        
        ScrollView {
            VStack(spacing: 6) {
                Divider()
                     .foregroundStyle(.white)
                     .padding(.bottom, 8)
                 
                ScrollView(.horizontal) {
                    recommendedArtists
                       .padding(.horizontal, 2)
                       .padding(.vertical, 10)
                }
                
                opensListing(open:  Open(title: "Asian Rock", artistUsername: "lazerdim700", image: "netalbum", gifUrl: "https://media1.giphy.com/media/GfiH70LJ0QPvGQ7Xhj/giphy.gif?cid=6c09b952pipz2s6h2haq8d75d58unaybk5qv95m03lvo23ud&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g"))
                    .padding(.vertical, 10)
                
//                NavigationLink {
//                    beatProductView(beat: Beat(beatName: "Izaya x UntilJapan Type Beat", beatUsername: "izayabeat", beatImage: "izayatijitypebeat", beatLike: 164, beatPlay: 744, beatComment: 35, beatPrice: "Free"))
//                } label: {
//                    beatRowView(beat: Beat(beatName: "Izaya x UntilJapan Type Beat", beatUsername: "izayabeat", beatImage: "izayatijitypebeat", beatLike: 164, beatPlay: 744, beatComment: 35, beatPrice: "Free"))
//                }
//                NavigationLink {
//                    beatProductView(beat: Beat(beatName: "Summrs x Autumn Type Beat", beatUsername: "pluggnbmusic", beatImage: "summrsautumntypebeat", beatLike: 54, beatPlay: 1132, beatComment: 62, beatPrice: "Free"))
//                } label: {
//                    beatRowView(beat: Beat(beatName: "Summrs x Autumn Type Beat", beatUsername: "pluggnbmusic", beatImage: "summrsautumntypebeat", beatLike: 54, beatPlay: 1132, beatComment: 62, beatPrice: "Free"))
//                }
//                
//                opensListing(open:  Open(title: "Rehhab (prod. ok)", artistUsername: "osamason", image: "osamasonheadline", gifUrl: "https://media0.giphy.com/media/k8a7PvG0Emc0jjhixi/giphy.gif?cid=6c09b952q1mz0wzp95fvnqrz53doc0flitv2cqnpyc8bo7is&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g"))
//                
//                NavigationLink {
//                    beatProductView(beat: Beat(beatName: "Izaya x UntilJapan Type Beat", beatUsername: "izayabeat", beatImage: "izayatijitypebeat", beatLike: 164, beatPlay: 744, beatComment: 35, beatPrice: "$3"))
//                } label: {
//                    beatRowView(beat: Beat(beatName: "Izaya x UntilJapan Type Beat", beatUsername: "izayabeat", beatImage: "izayatijitypebeat", beatLike: 164, beatPlay: 744, beatComment: 35, beatPrice: "$3"))
//                }
//                NavigationLink {
//                    beatProductView(beat: Beat(beatName: "Ken Carson x Starboy Type Beat", beatUsername: "kencarsonbeat", beatImage: "kencarsontypebeat", beatLike: 333, beatPlay: 644, beatComment: 10, beatPrice: "Free"))
//                } label: {
//                    beatRowView(beat: Beat(beatName: "Ken Carson x Starboy Type Beat", beatUsername: "kencarsonbeat", beatImage: "kencarsontypebeat", beatLike: 333, beatPlay: 644, beatComment: 10, beatPrice: "Free"))
//                }
                
                
                Spacer()
            }
        }
        
       
        
    }
    
    func opensListing(open: Open) -> some View {
        // Second ZStack with GIF
        ZStack {
            AnimatedImage(url: URL(string: open.gifUrl))
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(width: 400, height: 180)
                .clipShape(RoundedRectangle(cornerRadius: 15))
                .shadow(radius: 10)
                .opacity(0.3)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(open.title)
                    .fontWeight(.bold)
                    .font(.system(size: 14))
                
                HStack(spacing: 10) {
                    Image(open.image)
                        .resizable()
                        .frame(width: 20, height: 20)
                        .clipShape(Circle())
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text("@\(open.artistUsername)")
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
}

extension auctionAllView {
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
    
    var trendingView: some View {
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
    
    var recommendedArtists: some View {
        HStack(spacing: 20) {
            ForEach(viewModel.profiles) { profile in
                ArchivedProfileView(profile: profile)
            }
        }
        .frame(maxWidth: .infinity, alignment: .center)
        .padding(.vertical, 5)
        
    }
}
