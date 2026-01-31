//
//  CommunityListView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/5.
//

import SwiftUI
import Kingfisher

struct CommunityListView: View {
    @State private var searchedText = ""
    @ObservedObject var viewModel = CommunityViewModel()
    
    var body: some View {
        VStack {
            HStack {
                TextField("Search on 808archive", text: $searchedText)
                    .font(.subheadline)
                    .padding(12)
                    .background(Color(.systemGray6))
                    .cornerRadius(10)
                    .padding(.horizontal, 24)
            }
            .padding(.vertical)
            
            Spacer()
            
            ScrollView {
                LazyVStack { //list view, grows vertically
                    ForEach(viewModel.community) { community in
                        HStack {
                            HStack(spacing: 12) {
                                KFImage(URL(string: community.communityProfileUrl))
                                    .resizable()
                                    .scaledToFill()
                                    .clipShape(/*@START_MENU_TOKEN@*/Circle()/*@END_MENU_TOKEN@*/)
                                    .foregroundColor(.white)
                                    .frame(width: 64, height: 64)
                              
                                VStack(alignment: .leading) {
                                    
                                    Text(community.communityName)
                                        .font(.headline).bold()
                                        .foregroundColor(.white)
                                    Text("@\(community.communityUsername)")
                                        .font(.subheadline)
                                        .foregroundColor(.gray)
                                    
                                    Text(community.communityDescription)
                                        .font(.subheadline)
                                        .foregroundStyle(.white)
                                    
                                }
                                Spacer()
                            }
                            .padding(.horizontal)
                            .padding(.vertical, 4)
                            
                            Spacer()
                            
                            NavigationLink {
                                SingleCommunityView(community: community)
                            } label: {
                                Text("+ Join") //edit profile
                                    .font(.subheadline).bold()
                                    .frame(width: 80, height: 32)
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
                                print("DEBUG: Turn on community notification")
                            } label: {
                                Image(systemName: "bell.badge") //notification icon
                                    .foregroundColor(.red)
                                    .font(.title3)
                                    .padding(6)
                            }
                        }
                        .padding()
                    }
                }
            }
        }
        .onAppear() {
            self.viewModel.fetchCommunity()
        }
    }
}

#Preview {
    ThreadFeedView()
}
