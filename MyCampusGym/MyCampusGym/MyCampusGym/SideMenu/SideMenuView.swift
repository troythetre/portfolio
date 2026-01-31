//
//  SideMenuView.swift
//  MyCampusGym
//
//  Created by Troy Wu on 2024/10/28.
//

import SwiftUI

struct SideMenuView: View {
    @Binding var isShowing: Bool
    @State private var selectedOption: SideMenuOptionModel?
    @EnvironmentObject var viewModel: AuthViewModel
    @State var profile:Profile = Profile()
    private let profileService:ProfileService = ProfileService()
    
    var body: some View {
        ZStack {
            if isShowing {
                Rectangle()
                    .opacity(0.3)
                    .ignoresSafeArea()
                    .onTapGesture {isShowing.toggle()}
                
                HStack {
                    VStack(alignment: .leading) {
                        SideMenuHeaderView(profile: profile)
                        
                        NavigationLink {
                            MyJournalView()
                                .environmentObject(viewModel)
                        } label: {
                            HStack {
                                Image(systemName: "filemenu.and.cursorarrow")
                                    .imageScale(.small)
                                    .foregroundColor(.primary)
                                
                                Text("My Journal")
                                    .font(.subheadline)
                                    .foregroundColor(.primary)
                                
                                Spacer()
                            }
                            .padding(.leading)
                            .foregroundStyle(.black)
                            .frame(width: 216, height: 44)
                            .background(.clear)
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                        }
                        
                        NavigationLink {
                            MyPlan()
                                .environmentObject(viewModel)
                        } label: {
                            HStack {
                                Image(systemName: "figure.strengthtraining.traditional")
                                    .imageScale(.small)
                                    .foregroundColor(.primary)
                                
                                Text("My Plan")
                                    .font(.subheadline)
                                    .foregroundColor(.primary)
                                
                                Spacer()
                            }
                            .padding(.leading)
                            .foregroundStyle(.black)
                            .frame(width: 216, height: 44)
                            .background(.clear)
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                        }
                        
                        NavigationLink {
                            MyRewind()
                                .environmentObject(viewModel)
                        } label: {
                            HStack {
                                Image(systemName: "chart.bar")
                                    .imageScale(.small)
                                    .foregroundColor(.primary)
                                
                                Text("My Rewind")
                                    .font(.subheadline)
                                    .foregroundColor(.primary)
                                
                                Spacer()
                            }
                            .padding(.leading)
                            .foregroundStyle(.black)
                            .frame(width: 216, height: 44)
                            .background(.clear)
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                        }
                        
                        NavigationLink {
                            MyHealthView()
                                .environmentObject(viewModel)
                        } label: {
                            HStack {
                                Image(systemName: "heart.fill")
                                    .imageScale(.small)
                                    .foregroundColor(.primary)
                                
                                Text("My Health")
                                    .font(.subheadline)
                                    .foregroundColor(.primary)
                                
                                Spacer()
                            }
                            .padding(.leading)
                            .foregroundStyle(.black)
                            .frame(width: 216, height: 44)
                            .background(.clear)
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                        }
                        
                        NavigationLink {
                            ProfileView()
                                .environmentObject(viewModel)
                        } label: {
                            HStack {
                                Image(systemName: "person")
                                    .imageScale(.small)
                                    .foregroundColor(.primary)
                                
                                Text("Profile & Settings")
                                    .font(.subheadline)
                                    .foregroundColor(.primary)
                                
                                Spacer()
                            }
                            .padding(.leading)
                            .foregroundStyle(.black)
                            .frame(width: 216, height: 44)
                            .background(.clear)
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                        }
                        
                        if($profile.isAdmin.wrappedValue == true) {
                            NavigationLink {
                                AdminView(profile:profile)
                            } label: {
                                HStack {
                                    Image(systemName: "gear")
                                        .imageScale(.small)
                                        .foregroundColor(.primary)
                                    
                                    Text("Campus Administration")
                                        .font(.subheadline)
                                        .foregroundColor(.primary)
                                    
                                    Spacer()
                                }
                                .padding(.leading)
                                .foregroundStyle(.black)
                                .frame(width: 216, height: 44)
                                .background(.clear)
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                            }
                        }
                        
                        Spacer()
                    }
                    .padding()
                    .frame(width: 270, alignment: .leading)
                    .background()
                    
                    Spacer()
                }
            }
        }
        .transition(.move(edge: .leading))
        .animation(.easeInOut, value: isShowing)
        .onAppear {
            profileService.getProfile(uid: viewModel.currentSessionUser?.id ?? "") { p in
                profile = p
            }
        }
    }
}

#Preview {
    SideMenuView(isShowing: .constant(true)).environmentObject(AuthViewModel())
}
