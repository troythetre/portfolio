//
//  TabBar.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/17.
//

import SwiftUI

struct TabBar: View {
    
    @EnvironmentObject var authViewModel: AuthViewModel
    
    @State private var selectedIndex = 0
    var body: some View {
        if let user = authViewModel.currentUser {
            HStack {
                TabView(selection: $selectedIndex) {
                    HomeRootView()
                        .preferredColorScheme(.dark)
                        .onTapGesture {
                            self.selectedIndex = 0
                        }
                        .tabItem {
                            Image(systemName: "staroflife")
                                .foregroundColor(selectedIndex == 0 ? Color(hex: "#06b9ff") : .white) // Change color based on selection
                            Text("Home")
                                .foregroundColor(selectedIndex == 0 ? Color(hex: "#06b9ff") : .white) // Change color based on selection
                        }.tag(0)
                    
                    ProfileView(user: user)
                        .onTapGesture {
                            self.selectedIndex = 1
                        }
                        .tabItem {
                            Image(systemName: "magnifyingglass")
                                .foregroundColor(selectedIndex == 1 ? Color(hex: "#06b9ff") : .white) // Change color based on selection
                            Text("Search")
                                .foregroundColor(selectedIndex == 1 ? Color(hex: "#06b9ff") : .white) // Change color based on selection
                        }.tag(1)

                    //Home()
                    InboxView()
                        .preferredColorScheme(.dark)
                        .onTapGesture {
                            self.selectedIndex = 2
                        }
                        .tabItem {
                            Image(systemName: "globe.americas.fill")
                                .foregroundColor(selectedIndex == 2 ? Color(hex: "#06b9ff") : .white) // Change color based on selection
                            Text("Connect")
                                .foregroundColor(selectedIndex == 2 ? Color(hex: "#06b9ff") : .white) // Change color based on selection
                        }.tag(2)
                    
//                    ShopHomeView()
//                        .onTapGesture {
//                            self.selectedIndex = 3
//                        }
//                        .tabItem {
//                            Image(systemName: "stop.circle")
//                        }.tag(3)
//                    
//                    ThreadFeedView()
//                        //.preferredColorScheme(/*@START_MENU_TOKEN@*/.dark/*@END_MENU_TOKEN@*/)
//                        .onTapGesture {
//                            self.selectedIndex = 4
//                        }
//                        .tabItem {
//                            Image(systemName: "globe")
//                        }.tag(4)
                }
                .accentColor(Color(hex: "#06b9ff")) // Ensures the tab's selected indicator is blue
                .background(.black)
            }
        }
    }
}

#Preview {
    TabBar()
}
