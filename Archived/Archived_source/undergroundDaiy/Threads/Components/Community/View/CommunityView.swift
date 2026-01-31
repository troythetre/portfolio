//
//  SingleCommunityView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/5.
//

import SwiftUI
import Kingfisher


struct SingleCommunityView: View {
    
    @Environment(\.presentationMode) var mode
    @ObservedObject var viewModel = ThreadFeedViewModel()
    
    @ObservedObject var communityViewModel: CommunityFeedViewModel
    
    init(community: Community) {
        self.communityViewModel = CommunityFeedViewModel(community: community)
    }
    
    var body: some View {
        ZStack {
            KFImage(URL(string: communityViewModel.community.communityProfileUrl))
                .frame(width: 20, height: 40)
                .ignoresSafeArea()
            
            VStack(alignment: .leading) {
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text(communityViewModel.community.communityName)
                            .font(.title2).bold()
                        Image(systemName: "checkmark.seal.fill")
                            .foregroundColor(Color(.white))
                    }
                    Text(communityViewModel.community.communityUsername)
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    Text(communityViewModel.community.communityDescription)
                        .font(.subheadline)
                        .padding(.vertical)
                    HStack {
                        HStack {
                            Image(systemName: "mappin.and.ellipse")
                            
                            Text("YVL")
                        }
                        //Spacer()
                        HStack {
                            Image(systemName: "link")
                            
                            Text("www.playboicarti.com")
                        }
                    }
                    .font(.caption)
                    .foregroundColor(.gray)
                    
                    UserStatsView()
                        .padding(.vertical)
                    
                    HStack(spacing: 12) {
                        Button {
                            print("DEBUG: Join the community")
                        } label: {
                            Text("+ Join") //edit profile
                                .font(.subheadline).bold()
                                .frame(width: 120, height: 32)
                                .foregroundColor(.white)
                                .background(
                                    RoundedRectangle(cornerRadius: 20).stroke(Color.gray, lineWidth: 0.1).fill(Color.blue)
                                )
                                .overlay(
                                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                                        .strokeBorder(Color.gray, lineWidth: 0.1)
                                )
                        }
                        
                        Button {
                            print("DEBUG: let user upload threat to the community view")
                        } label: {
                            Text("+ Upload Thread") //edit profile
                                .font(.subheadline).bold()
                                .frame(width: 180, height: 32)
                                .foregroundColor(.white)
                                .background(
                                    RoundedRectangle(cornerRadius: 20).stroke(Color.gray, lineWidth: 0.1).fill(Color.black)
                                )
                                .overlay(
                                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                                        .strokeBorder(Color.gray, lineWidth: 0.1)
                                )
                        }
                        
                        Button {
                            print("DEBUG: Turn on community notification")
                        } label: {
                            Image(systemName: "bell.badge") //notification icon
                                .foregroundColor(.white)
                                .font(.title3)
                                .padding(6)
//                                .overlay(Circle().stroke(Color.gray, lineWidth: 0.75))
                                .background(
                                    Circle().stroke(Color.gray, lineWidth: 0.1).fill(Color.red)
                                )
                                .overlay(
                                    Circle()
                                        .strokeBorder(Color.gray, lineWidth: 0.1)
                                )
                        }
                    }
                    
                    HStack(spacing: 4) {
                        Button {
                            print("DEBUG: access community's Spotify playlist")
                        } label: {
                            Text("Spotify playlist") //edit profile
                                .font(.subheadline).bold()
                                .frame(width: 180, height: 32)
                                .foregroundColor(.white)
                                .background(
                                    RoundedRectangle(cornerRadius: 20).stroke(Color.gray, lineWidth: 0.1).fill(Color.green)
                                )
                                .overlay(
                                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                                        .strokeBorder(Color.gray, lineWidth: 0.1)
                                )
                        }
                        
                        Button {
                            print("DEBUG: access soundcloud playlist")
                        } label: {
                            Text("SoundCloud playlist") //edit profile
                                .font(.subheadline).bold()
                                .frame(width: 180, height: 32)
                                .foregroundColor(.white)
                                .background(
                                    RoundedRectangle(cornerRadius: 20).stroke(Color.gray, lineWidth: 0.1).fill(Color.orange)
                                )
                                .overlay(
                                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                                        .strokeBorder(Color.gray, lineWidth: 0.1)
                                )
                        }
                    }
                    
                    
                    
                }
                .padding()
                    
                VStack {
                    ScrollView {
                        LazyVStack {
                            ForEach(viewModel.posts) { post in
                                if post.tag == communityViewModel.community.communityUsername {
                                    PostView(post: post)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
