//
//  ViewA.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/12.
//

import SwiftUI
import AVKit
import Kingfisher

struct Home: View {
    
    @State private var searchedText = ""
    @State private var selectedFilter: HomeFilterViewModel = .home
    @Namespace var animation
    @State private var selectedIndex: Int = 0
    private let categories = ["All", "Music", "Videos", "Clothing", "Community", "Livestream"]
    
    private let artworkImages = ["ken", "izaya", "iayze", "nmnl"]
    
    let upcomingReleases: [UpcomingRelease] = [
        UpcomingRelease(artistName: "Izaya Tji", albumName: "New Izaya Tiji album", image: "izaya"),
        UpcomingRelease(artistName: "Ken Carson", albumName: "A Great Chaos", image: "ken"),
        UpcomingRelease(artistName: "Iayze", albumName: "Reverence 4", image: "iayze"),
        UpcomingRelease(artistName: "Izaya Tji", albumName: "New Izaya Tiji album", image: "izaya"),
        UpcomingRelease(artistName: "Ken Carson", albumName: "A Great Chaos", image: "ken"),
    ]
    
    let artistRec: [ArtistRecommendation] = [
        artist1,
        artist2,
        artist3,
    ]
    
    @State var currentItem: CardModel?
    @State var showDetailPage: Bool = false
    @State var isAnimationView: Bool = false
    
    var body: some View {
        NavigationStack {
            VStack {
                Divider()
        
                HStack {
                    TextField("Search on 808archive", text: $searchedText)
                        .font(.subheadline)
                        .padding(10)
                        .background(Color(.systemGray6))
                        .cornerRadius(20)
                        .padding(.horizontal, 24)
                }
                .padding(.vertical)
                
                filterBar
                
                if selectedFilter == .home {
                    ScrollView(.vertical, showsIndicators: false) {
                        VStack(spacing: 30) { //header + dashboard shortcut
                            HStack(alignment: .bottom) {
                                VStack(alignment: .leading, spacing: 8) {
                                    Text("Today")
                                        .font(.title.bold())
                                    Text("10 August")
                                        .font(.callout.bold())
                                        .opacity(0.8)
                                }
                                .frame(maxWidth: 380, alignment: .leading)
                            }
                        }
                        .padding()
                        
                        ForEach(cardItems) { item in
                            Button {
                                withAnimation(.interactiveSpring(response: 0.6, dampingFraction: 0.7, blendDuration: 0.7)) {
                                    currentItem = item
                                    showDetailPage = true
                                }
                            } label: {
                                CardView(item: item)
                                    .multilineTextAlignment(.leading)
                                    .foregroundStyle(.white)
                                
                                //For matched geometry effect we didn't apply padding
                                    .scaleEffect(currentItem?.id == item.id && showDetailPage ? 1: 0.90)
                                
                            }
                            .buttonStyle(ScaledButtonStyle())
                            .opacity(showDetailPage ? (currentItem?.id == item.id ? 1: 0) : 1)
                            
                        }
                    }
                    .overlay {
                        if let currentItem = currentItem, showDetailPage {
                            DetailView(item: currentItem)
                                .edgesIgnoringSafeArea(.top)
                        }
                    }
                }

                if selectedFilter == .social {
                    ScrollView {
                        VStack(alignment: .leading) {
                            Text("Online Now")
                                .font(.headline)
                                .fontWeight(.bold)
                            ActiveUsersView()
                        }
                        
                        VStack(alignment: .leading) {
                            GroupBox {
                                GroupBox {
                                    MusicPlayerView()
                                }
                            } label: {
                                Label("Josh Lang is now Playing", systemImage: "music.note")
                                    .foregroundStyle(.pink)
                            }
                            GroupBox {
                                GroupBox {
                                    MusicPlayerView()
                                }
                            } label: {
                                Label("Troy Wu is now Playing", systemImage: "music.note")
                                    .foregroundStyle(.purple)
                            }
                        }
                    }
                }
            }
        }
    }
    
    @ViewBuilder
    func CardView(item: CardModel) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            //Card View
            ZStack(alignment: .topLeading) {
                GeometryReader { proxy in
                    let size = proxy.size
                    
                    Image(item.artwork)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: size.width, height: size.height)
                        .clipped()
                    
                    VStack(alignment: .leading) {
                        Spacer()
                        Text("\(item.category)")
                            .font(.callout.bold())
                        
                        Text("\(item.bannerTitle)")
                            .font(.title.bold())
                        
                        Text("\(item.cardDescription)")
                            .font(.title3.bold())
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
                    .background(LinearGradient(colors: [Color.clear, (item.color).opacity(0.8)], startPoint: .top, endPoint: .bottom))
                }
                .frame(height: 400)
                .clipShape(.rect(topLeadingRadius: 20, topTrailingRadius: 20))
                
            }
            
            HStack(spacing: 12){
                Image(item.profileIcon)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(width: 50, height: 50)
                    .clipShape(.rect(cornerRadius: 15))
                
                VStack(alignment: .leading, spacing: 1) {
                    Text("\(item.artistName)")
                        .font(.caption.bold())
                    Text("\(item.artistGenre)")
                        .font(.headline.bold())
                    Text("\(item.artistSubDescription)")
                        .font(.caption.bold())
                }
                
                Spacer()
                
                Button {
                    
                } label: {
                    Text("+ Follow")
                        .foregroundStyle(.white)
                        .fontWeight(.bold)
                        .padding(.vertical, 8)
                        .padding(.horizontal, 20)
                        .background {
                            Capsule().fill(.ultraThickMaterial)
                        }
                }
                .buttonStyle(ScaledButtonStyle())
            }
            .padding()
            .background(item.color)
            .clipShape(.rect(bottomLeadingRadius: isAnimationView ? 0: 20, bottomTrailingRadius: isAnimationView ? 0: 20))
        }
        .matchedGeometryEffect(id: item.id, in: animation)

        
    }
    
    func DetailView(item: CardModel) -> some View {
        ScrollView(.vertical, showsIndicators: false) {
            VStack {
                CardView(item: item)
                    .scaleEffect(isAnimationView ? 1: 0.90)
                
                VStack(alignment: .leading) {
                    Text("More Like This")
                        .font(.title)
                        .fontWeight(.bold)
                    
                    ScrollView(.horizontal) {
                       
                        HStack {
                            ForEach(0 ..< artworkImages.count) { i in
                                VStack(alignment: .leading) {
                                    Image(artworkImages[i])
                                        .resizable()
                                        .aspectRatio(contentMode: .fill)
                                        .frame(width: 160, height: 160)
                                        .clipShape(RoundedRectangle(cornerRadius: 10))
                                        .padding(.horizontal, 5)
                                    Text("Default Album Name")
                                        .font(.headline.bold())
                                    Text("Default Artist Name")
                                        .font(.caption.bold())
                                }
                                
                            }
                        }
                    }
                    
                }
                
                
            }
        }
        .overlay(alignment: .topTrailing) {
            Button {
                withAnimation(.interactiveSpring(response: 0.6, dampingFraction: 0.7, blendDuration: 0.7)) {
                    isAnimationView = false
                }
                
                withAnimation(.interactiveSpring(response: 0.6, dampingFraction: 0.7, blendDuration: 0.7).delay(0.5)) {
                    currentItem = nil
                    showDetailPage = false
                }
            } label: {
                Image(systemName: "xmark.circle.fill")
                    .font(.title)
                    .foregroundStyle(.white)
            }
            .padding([.top], safeArea().top)
            .padding(.trailing)
            .opacity(isAnimationView ? 1: 0)
        }
        .onAppear() {
            withAnimation(.interactiveSpring(response: 0.6, dampingFraction: 0.7, blendDuration: 0.7)) {
                isAnimationView = true
            }
        }
    }
}

struct CategoryView: View {
    let isActive: Bool
    let text: String
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(text)
                .font(.system(size: 18))
                .fontWeight(.medium)
                .foregroundStyle(isActive ? Color.white: Color.white.opacity(0.5))
            
            if (isActive) {
                Color.blue
                    .frame(width: 15, height: 2)
                    .clipShape(Capsule())
            }
        }
        .padding(.trailing)
    }
}
                
extension Home {
    var filterBar: some View {
        HStack {
            ForEach(HomeFilterViewModel.allCases, id: \.rawValue) { item in
                VStack {
                    Text(item.title)
                        .font(.subheadline)
                        .fontWeight(selectedFilter == item ? .semibold: .regular)
                        .foregroundColor(selectedFilter == item ? .white: .gray)
                    
                    if selectedFilter == item {
                        Capsule()
                            .foregroundColor(.white)
                            .frame(height: 3)
                            .matchedGeometryEffect(id: "filter", in: animation)
                    } else {
                        Capsule()
                            .foregroundColor(Color(.clear))
                            .frame(height: 3)
                    }
                }
                .onTapGesture {
                    withAnimation(.easeInOut) {
                        self.selectedFilter = item
                    }
                }
            }
        }
        .overlay(Divider().offset(x: 0, y: 16))
    }

    
    func safeArea() -> UIEdgeInsets {
        guard let screen = UIApplication.shared.connectedScenes.first as? UIWindowScene else {
            return .zero
        }
        
        guard let safeArea = screen.windows.first?.safeAreaInsets else {
            return .zero
        }
        
        return safeArea
    }
}
