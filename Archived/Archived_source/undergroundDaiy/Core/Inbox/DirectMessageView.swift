//
//  DirectMessageView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2025/4/18.
//

import SwiftUI

struct DirectMessageView: View {
    let user: AppUser
    @State private var newMessageText: String = ""
    @StateObject private var viewModel: DirectMessageViewModel
    
    init(user: AppUser) {
        self.user = user
        //print("ViewModel initialized for user: \(user.username)") // Debugging line
        _viewModel = StateObject(wrappedValue: DirectMessageViewModel(user: user))
    }
    
    var body: some View {
        VStack {
            ScrollViewReader { scrollViewProxy in
                ScrollView {
                    VStack {
                        Text("Messages count: \(viewModel.messages.count)")
                            .foregroundColor(.red)
                        
                        LazyVStack(alignment: .leading, spacing: 12) {
                            ForEach(viewModel.messages) { message in
                                HStack {
                                    if message.senderId == viewModel.currentUserId {
                                        Spacer()
                                        TextBubble(message: message, isFromCurrentUser: true)
                                    } else {
                                        TextBubble(message: message, isFromCurrentUser: false)
                                        Spacer()
                                    }
                                }
                                .id(message.id)
                            }
                        }
                        .padding(.horizontal)
                        .padding(.top)
                    }
                    
                }
                .onChange(of: viewModel.messages.count) { _ in
                    if let lastMessage = viewModel.messages.last {
                        scrollViewProxy.scrollTo(lastMessage.id, anchor: .bottom)
                    }
                }
            }

            Divider()

            HStack {
                TextField("Message...", text: $newMessageText)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .frame(minHeight: 30)
                
                Button(action: {
                    viewModel.sendMessage(text: newMessageText)
                    newMessageText = ""
                }) {
                    Image(systemName: "paperplane.fill")
                        .rotationEffect(.degrees(45))
                        .padding(8)
                }
            }
            .padding()
        }
        .navigationTitle("@\(user.username)")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            viewModel.fetchMessages()
        }
    }
}
