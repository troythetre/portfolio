//
//  ContentView.swift
//  MyCampusGym
//
//  Created by Troy Wu on 2024/10/21.
//

import SwiftUI

struct ContentView: View {
    
    @State private var showMenu = false
    @State private var tabSelection = 1
    @EnvironmentObject var viewModel: AuthViewModel
    
    var body: some View {
        
        NavigationStack {
            
            GeometryReader { geometry in
                
                let safeHeight = geometry.size.height - geometry.safeAreaInsets.top - geometry.safeAreaInsets.bottom
                
                ZStack {
                    
                    TabView() {
                        MyFitness(safeHeight: safeHeight)
                            .environmentObject(viewModel)
                            .tabItem {
                                VStack {
                                    Image(systemName: "dumbbell")
                                    Text("My Fitness")
                                }
                            }
                        CardStackView().tabItem {
                            Image(systemName: "person.3.fill")
                            VStack {
                                Text("My Buddies")
                            }
                        }
                        MyMentor().tabItem {
                            Image(systemName: "graduationcap")
                            VStack {
                                Text("My Mentor")
                            }
                        }
                        MyFeed()
                            .environmentObject(viewModel)
                            .tabItem {
                            VStack {
                                Image(systemName: "book.fill")
                                Text("MyFeed")
                            }
                        }
                    }
                    
                    SideMenuView(isShowing: $showMenu).environmentObject(viewModel)
                }
                .toolbar {
                    ToolbarItem(placement: .topBarLeading) {
                        Button(action: {
                            showMenu.toggle()
                        }, label: {
                            Image(systemName: "line.3.horizontal")
                        })
                    }
                }
            }
        }
    }
}
    

#Preview {
    ContentView().environmentObject(AuthViewModel())
}
