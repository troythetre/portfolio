//
//  communityExplore.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/10.
//

//import SwiftUI
//import Kingfisher
//
//struct communityExplore: View {
//    
//    @ObservedObject var viewModel = CommunityViewModel()
//    var body: some View {
//        HStack {
//            HStack(spacing: 12) {
//                KFImage(URL(string: viewModel.community.communityProfileUrl))
//                    .resizable()
//                    .scaledToFill()
//                    .clipShape(/*@START_MENU_TOKEN@*/Circle()/*@END_MENU_TOKEN@*/)
//                    .foregroundColor(.white)
//                    .frame(width: 64, height: 64)
//              
//                VStack(alignment: .leading) {
//                    
//                    Text(viewModel.community.communityName)
//                        .font(.headline).bold()
//                        .foregroundColor(.white)
//                    Text("@\(viewModel.community.communityUsername)")
//                        .font(.subheadline)
//                        .foregroundColor(.gray)
//                    
//                    Text(viewModel.community.communityDescription)
//                        .font(.subheadline)
//                        .foregroundStyle(.white)
//                    
//                }
//                Spacer()
//            }
//            .padding(.horizontal)
//            .padding(.vertical, 4)
//            
//            Spacer()
//            
//            NavigationLink {
//                SingleCommunityView(community: viewModel.community)
//            } label: {
//                Text("+ Join") //edit profile
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
//            
//            Button {
//                print("DEBUG: Turn on community notification")
//            } label: {
//                Image(systemName: "bell.badge") //notification icon
//                    .foregroundColor(.white)
//                    .font(.title3)
//                    .padding(6)
//            }
//        }
//        .padding()
//    }
//}
//
//#Preview {
//    communityExplore()
//}
