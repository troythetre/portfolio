//
//  ProfileView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/17.
//

import SwiftUI
import Kingfisher
import SDWebImageSwiftUI

struct ProfileView: View {
    let gifUrl: String = "https://media1.giphy.com/media/hAqL0H7V6KsZV06h6e/200w.gif?cid=82a1493bfqupf5elblx62s07q08ets44s316a4he9sudreav&ep=v1_gifs_related&rid=200w.gif&ct=g"
    @State private var selectedFilter: FilterViewModel = .archive
    @ObservedObject var viewModel: UserProfileViewModel
    @Environment(\.presentationMode) var mode
    @Environment(\.dismiss) var dismiss // EnvironmentValue
    @Namespace var animation
    
    @State private var showEditProfile = false
    
    init(user: AppUser) {
        self.viewModel = UserProfileViewModel(user: user)
    }
    
    var body: some View {
        NavigationStack {
            if viewModel.user.tag == "producer" {
                producerProfileView
            }
            
            if viewModel.user.tag == "user" {
                artistProfileView
            }
            
            if viewModel.user.tag == "artist" {
                artistProfileView
            }

            Spacer()
        }
        .navigationBarBackButtonHidden(false)
    }
    
    func opensListing() -> some View {
        // Second ZStack with GIF
        ZStack {
            AnimatedImage(url: URL(string: gifUrl))
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(width: 350, height: 150)
                .clipShape(RoundedRectangle(cornerRadius: 15))
                .shadow(radius: 10)
                .opacity(0.3)
            
            VStack(alignment: .leading, spacing: 2) {
                Text("*NEW* - Dom Corleo Open Verse")
                    .fontWeight(.bold)
                    .font(.system(size: 16))
                
                HStack(spacing: 10) {
                    Image("izayatijitypebeat")
                        .resizable()
                        .frame(width: 20, height: 20)
                        .clipShape(Circle())
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text("@domcorleo")
                            .foregroundStyle(Color(hex: "#06b9ff"))
                            .font(.system(size: 12))
                        
                        Text("Artist")
                            .font(.system(size: 10))
                            .foregroundStyle(.white)
                            .padding(.horizontal, 12)
                            .background(Color.purple.opacity(0.2))
                            .clipShape(Capsule())
                    }
                    Spacer()
                }
                
                
            }
            .foregroundColor(.white)
            .padding(.horizontal)
            .offset(y: -40)
        }
        .frame(width: 350, height: 150)
        .padding(.bottom, 40)
    }
}

extension ProfileView {
//    var headerView: some View {
//        ZStack(alignment: .bottomLeading) { //sets the background
//            KFImage(URL(string: viewModel.user.profileImageUrl))
//                .resizable()
//                .scaledToFill()
//                .frame(width: 450, height: 380)
//        }
//        .frame(height: 55)
//    }
//    
//    var actionButtons: some View {
//        HStack(spacing: 12) {
//            Spacer()
//            Image(systemName: "bell.badge") //notification icon
//                .font(.title3)
//                .padding(6)
//                .foregroundStyle(.red)
//                .overlay(Circle().stroke(Color.red, lineWidth: 0.75))
//            Button {
//                showEditProfile.toggle()
//            } label: {
//                Text(viewModel.actionButtonTitle) //edit profile
//                    .font(.subheadline).bold()
//                    .frame(width: 80, height: 32)
//                    .foregroundColor(.white)
//                    .background(
//                        RoundedRectangle(cornerRadius: 20).stroke(Color.gray, lineWidth: 0.1).fill(Color.blue)
//                    )
//                    .overlay(
//                        RoundedRectangle(cornerRadius: 20, style: .continuous)
//                            .strokeBorder(Color.gray, lineWidth: 0.1)
//                    )
//            }
//        }
//        .padding(.horizontal)
//    }
//    
//    var userInfoDetails: some View {
//        VStack(alignment: .leading, spacing: 4) {
//            HStack {
//                HStack {
//                    Text(viewModel.user.fullname)
//                        .font(.title2).bold()
//                        .foregroundStyle(.white)
//                    Image(systemName: "checkmark.seal.fill")
//                        .foregroundColor(Color(.white))
//                }
//                
//                HStack(spacing: 12) {
//                    Spacer()
//                    Button {
//                        print("DEBUG: turn on user notification")
//                    } label: {
//                        Image(systemName: "bell.badge") //notification icon
//                            .font(.title3)
//                            .padding(6)
//                            .foregroundStyle(.red)
//                            .overlay(Circle().stroke(Color.red, lineWidth: 0.75))
//                    }
//                    Button {
//                        showEditProfile.toggle()
//                    } label: {
//                        Text(viewModel.actionButtonTitle) //edit profile
//                            .font(.subheadline).bold()
//                            .fontWeight(.semibold)
//                            .frame(width: 100, height: 32)
//                            .foregroundColor(.white)
//                            .background(
//                                RoundedRectangle(cornerRadius: 20).stroke(Color.gray, lineWidth: 0.1).fill(Color.black)
//                            )
//                            .overlay(
//                                RoundedRectangle(cornerRadius: 20, style: .continuous)
//                                    .strokeBorder(Color.gray, lineWidth: 0.1)
//                            )
//                    }
//                }
////                .padding(.horizontal)
//                
//                
//            }
//            
//            Text("@\(viewModel.user.username)")
//                .font(.subheadline)
//                .foregroundColor(.gray)
//            Text("Home of the underground music")
//                .font(.subheadline)
//                .padding(.vertical)
//            HStack {
//                HStack {
//                    Image(systemName: "mappin.and.ellipse")
//                    
//                    Text("Underground, Underwrld")
//                }
//                //Spacer()
//                HStack {
//                    Image(systemName: "link")
//                    
//                    Text("www.underground-daily.com")
//                }
//            }
//            .font(.caption)
//            .foregroundColor(.gray)
//            
//            UserStatsView()
//                .padding(.vertical)
//            
//        }
//        .padding()
//    }
//
    var producerProfileView: some View {
        VStack(alignment: .leading, spacing: 0) {
            ZStack(alignment: .center) { //sets the background
                //KFImage(URL(string: viewModel.user.profileImageUrl))
                AnimatedImage(url: URL(string: "https://media1.giphy.com/media/hAqL0H7V6KsZV06h6e/200w.gif?cid=82a1493bfqupf5elblx62s07q08ets44s316a4he9sudreav&ep=v1_gifs_related&rid=200w.gif&ct=g"))
                    .resizable()
                    .scaledToFill()
                    .opacity(0.35)
                    .frame(width: 450, height: 330)
                
                VStack(alignment: .leading) {
                    HStack {
                        KFImage(URL(string: viewModel.user.profileImageUrl))
                            .resizable()
                            .scaledToFill()
                            .clipShape(/*@START_MENU_TOKEN@*/Circle()/*@END_MENU_TOKEN@*/)
                            .frame(width: 80, height: 80)
                        
                        VStack(alignment: .leading) {
                            Text("@\(viewModel.user.username)")
                                .font(.system(size: 24))
                                .fontWeight(.bold)
                                .foregroundStyle(Color(hex: "#06b9ff"))
                                .padding(.vertical, 2)
                            Text(viewModel.user.tag)
                                .font(.system(size: 16))
                                .fontWeight(.semibold)
                                .padding(.horizontal, 8)
                                .frame(alignment: .leading)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 10)
                                        .stroke(Color(hex: "06b9ff"), lineWidth: 2)  // Border color and thickness
                                )
                                .background(Color.clear)  // Transparent background)
                                .padding(.vertical, 2)
                            HStack {
                                Image(systemName: "mappin.and.ellipse")
                                Text("Los Angeles, CA")
                            }
                            .padding(.vertical, 2)
                            
                        }
                        .padding(.vertical, 10)
                        .padding(.horizontal, 4)
                    }
                    
                    Text("Insert bio here: biggest carti glazer.... sike")
                        .font(.system(size: 18))
                        .padding(.vertical, 2)
                    
                    HStack {
                        HStack {
                            Image(systemName: "person.fill")
                            Text("1,482 followers")
                        }
                        
                        HStack {
                            Image(systemName: "tag.fill")
                            Text("113 sold")
                        }
                    }
                    .frame(alignment: .center)
                    .padding(.vertical, 4)
                    
                    HStack {
                        Text("FOLLOW")
                            .font(.system(size: 16))
                            .fontWeight(.semibold)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 2)
                            .background(Color(hex: "06b9ff"))
                            .clipShape(RoundedRectangle(cornerRadius: 5))
                        
                        Text("MESSAGE")
                            .font(.system(size: 16))
                            .fontWeight(.semibold)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 2)
                            .foregroundStyle(.black)
                            .background(Color.white)
                            .clipShape(RoundedRectangle(cornerRadius: 5))
                        
                        Spacer().frame(width: 85)
                        
                        Image(systemName: "music.note.house.fill")
                            .foregroundStyle(.red)
                        
                        Spacer().frame(width: 30)
                        
                        Image(systemName: "ellipsis")
                    }
                    .padding(.vertical, 4)
                }
                .padding(.top, 4)
            }
            .frame(height: 275)
            Spacer().frame(height: 30)
            Divider()
                .foregroundStyle(.white)
                .frame(height: 4)
                .shadow(color: .gray, radius: 2, x: 0, y: 2)
            filterBar
            HStack {
                HStack {
                    Image(systemName: "list.dash")
                        .padding(.leading, 8) // Moves it slightly to the right
                    Text("\(viewModel.beats(forFilter: .archive).count) beats")
                }
                Spacer()
                Spacer()
                Button(action: {
                    // Implement filter action
                }) {
                    Image(systemName: "magnifyingglass")
                        .resizable()
                        .frame(width: 24, height: 24)
                        .foregroundColor(.white)
                }
                Button(action: {
                    // Implement filter action
                }) {
                    Image(systemName: "line.3.horizontal.decrease.circle")
                        .resizable()
                        .frame(width: 24, height: 24)
                        .foregroundColor(.white)
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 8)
            postsView
            Spacer()
        }
//            .sheet(isPresented: $showEditProfile, content: {
//                EditProfileView()
//                    .environmentObject(viewModel)
//            })
    }
    
    var artistProfileView: some View {
        VStack(alignment: .leading, spacing: 0) {
            ZStack(alignment: .center) { //sets the background
                //KFImage(URL(string: viewModel.user.profileImageUrl))
                AnimatedImage(url: URL(string: "https://media1.giphy.com/media/hAqL0H7V6KsZV06h6e/200w.gif?cid=82a1493bfqupf5elblx62s07q08ets44s316a4he9sudreav&ep=v1_gifs_related&rid=200w.gif&ct=g"))
                    .resizable()
                    .scaledToFill()
                    .opacity(0.35)
                    .frame(width: 450, height: 330)
                
                VStack(alignment: .leading) {
                    HStack {
                        KFImage(URL(string: viewModel.user.profileImageUrl))
                            .resizable()
                            .scaledToFill()
                            .clipShape(/*@START_MENU_TOKEN@*/Circle()/*@END_MENU_TOKEN@*/)
                            .frame(width: 80, height: 80)
                        
                        VStack(alignment: .leading) {
                            Text("@\(viewModel.user.username)")
                                .font(.system(size: 24))
                                .fontWeight(.bold)
                                .foregroundStyle(Color(hex: "#06b9ff"))
                                .padding(.vertical, 2)
                            Text(viewModel.user.tag)
                                .font(.system(size: 16))
                                .fontWeight(.semibold)
                                .padding(.horizontal, 8)
                                .frame(alignment: .leading)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 10)
                                        .stroke(Color(hex: "06b9ff"), lineWidth: 2)  // Border color and thickness
                                )
                                .background(Color.clear)  // Transparent background)
                                .padding(.vertical, 2)
                            HStack {
                                Image(systemName: "mappin.and.ellipse")
                                Text("Los Angeles, CA")
                            }
                            .padding(.vertical, 2)
                            
                        }
                        .padding(.vertical, 10)
                        .padding(.horizontal, 4)
                    }
                    
                    Text("Insert bio here: biggest carti glazer.... sike")
                        .font(.system(size: 18))
                        .padding(.vertical, 2)
                    
                    HStack {
                        HStack {
                            Image(systemName: "person.fill")
                            Text("1,482 followers")
                        }
                        
                        HStack {
                            Image(systemName: "tag.fill")
                            Text("113 sold")
                        }
                    }
                    .frame(alignment: .center)
                    .padding(.vertical, 4)
                    
                    HStack {
                        Text("FOLLOW")
                            .font(.system(size: 16))
                            .fontWeight(.semibold)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 2)
                            .background(Color(hex: "06b9ff"))
                            .clipShape(RoundedRectangle(cornerRadius: 5))
                        
                        Text("MESSAGE")
                            .font(.system(size: 16))
                            .fontWeight(.semibold)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 2)
                            .foregroundStyle(.black)
                            .background(Color.white)
                            .clipShape(RoundedRectangle(cornerRadius: 5))
                        
                        Spacer().frame(width: 85)
                        
                        Image(systemName: "music.note.house.fill")
                            .foregroundStyle(.red)
                        
                        Spacer().frame(width: 30)
                        
                        Image(systemName: "ellipsis")
                    }
                    .padding(.vertical, 4)
                }
                .padding(.top, 4)
            }
            .frame(height: 275)
            Spacer().frame(height: 30)
            Divider()
                .foregroundStyle(.white)
                .frame(height: 4)
                .shadow(color: .gray, radius: 2, x: 0, y: 2)
            filterBar
            ScrollView {
                LazyVStack {
                    ForEach(viewModel.beats(forFilter: self.selectedFilter)) { beat in
                        beatRowView(beat: beat)
                            .padding(.vertical, 6)
                    }
                }
                .background(.black.opacity(0.75))
            }
            Spacer()
        }
    }
    var filterBar: some View {
        HStack {
            Spacer(minLength: 20)
            ForEach(FilterViewModel.allCases, id: \.rawValue) { item in //posts, upvotes, downvotes, archives
                VStack {
                    Text(item.title)
                        .font(.subheadline)
                        .fontWeight(selectedFilter == item ? .semibold: .regular) //if selected, fontWeight = semibold
                        .foregroundColor(selectedFilter == item ? Color(hex: "06b9ff"): .gray) //if selected, color = white
                    
                    if selectedFilter == item {
                        Capsule()
                            .foregroundColor(Color(hex: "06b9ff"))
                            .frame(height: 3)
                            .matchedGeometryEffect(id: "filter", in: animation)
                    } else {
                        Capsule()
                            .foregroundColor(Color(.clear))
                            .frame(height: 3)
                            .bold()
                    }
                }
                .onTapGesture {
                    withAnimation(.easeInOut) {
                        self.selectedFilter = item
                    }
                }
            }
            Spacer()
        }
        .overlay(Divider().offset(x: 0, y: 16))
    }
    var postsView: some View {
        ScrollView {
            LazyVStack {
                ForEach(viewModel.beats(forFilter: self.selectedFilter)) { beat in
                    beatRowView(beat: beat)
                        .padding(.vertical, 6)
                }
            }
            .background(.black.opacity(0.75))
        }
        .padding(.leading, 20) // Adjust the value to move it more or less
    }
}
