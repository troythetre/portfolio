//
//  ContentView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/12.
//

import SwiftUI
import Kingfisher

struct ContentView: View {
    @State private var showMenu = false
    @EnvironmentObject var viewModel: AuthViewModel
    
    var body: some View {
        Group {
            //if no user logs in - user gets to log in or sign up
            if viewModel.userSession == nil {
                LogInView()
            } else {
                //have a logged in user - straight to homepage
                mainInterfaceView
            }
        }
        
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            ContentView()
        }
    }
}

extension ContentView {
    //activate side menu and tabbar
    var mainInterfaceView: some View {
        ZStack(alignment: .topLeading) {
            TabBar()
                .navigationBarHidden(showMenu)
            
            if showMenu {
                ZStack {
                    Color(.black)
                        .opacity(showMenu ? 0.25:0.0)
                }.onTapGesture {
                    withAnimation(.easeInOut) {
                        showMenu = false //sidemenu animation
                    }
                }
                .ignoresSafeArea()
            }
            
            SidemenuView()
                .frame(width: 300)
                .offset(x: showMenu ? 0: -300, y: 0)
                //.background(showMenu ? Color.white : Color.clear)
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigation) {
                HStack(alignment: .center) {
                    Image("logo")
                        .resizable()
                        .scaledToFill()
                        .frame(width: 80, height: 100)
                }
            } //archive logo
            
            ToolbarItem(placement: .navigationBarTrailing) {
                NavigationLink {
                    AudioFilePickerView()
                } label: {
                    Image(systemName: "plus.circle")
                        .resizable()
                        .scaledToFill()
                        .frame(width: 20, height: 20)
                        .foregroundStyle(LinearGradient(
                            gradient: Gradient(colors: [Color(hex: "#5de0e6"), Color(hex: "#004aad")]),
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ))
                }
            }
            
            ToolbarItem(placement: .navigationBarTrailing) {
                NavigationLink {
                    NotificationView()
                } label: {
                    Image(systemName: "bell.badge")
                        .resizable()
                        .scaledToFill()
                        .frame(width: 20, height: 20)
                        .foregroundStyle(LinearGradient(
                            gradient: Gradient(colors: [Color(hex: "#5de0e6"), Color(hex: "#004aad")]),
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ))
                }
            } //search bar
            
            ToolbarItem(placement: .navigationBarTrailing) {
                if let user = viewModel.currentUser {
                    Button {
                        withAnimation(.easeInOut) {
                            showMenu.toggle()
                        }
                    } label: {
                        KFImage(URL(string: user.profileImageUrl))
                            .resizable()
                            .scaledToFill()
                            .frame(width: 30, height: 30)
                            .clipShape(/*@START_MENU_TOKEN@*/Circle()/*@END_MENU_TOKEN@*/)
                            .overlay(
                                    Circle() // Adds a border around the circular image
                                        .stroke(LinearGradient(
                                            gradient: Gradient(colors: [Color(hex: "#5de0e6"), Color(hex: "#004aad")]),
                                            startPoint: .topLeading,
                                            endPoint: .bottomTrailing
                                        ), lineWidth: 2) // Customize border color and width
                                )
                    }
                }
                
            } //sidemenu profile pic
        }
        .onAppear {
            showMenu = false
        }
        
    }
}
