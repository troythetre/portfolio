//
//  NewMessageView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/10.
//

import SwiftUI
import Kingfisher

struct NewMessageView: View {
    @State private var searchText = ""
    @Environment(\.dismiss) var dismiss
    @ObservedObject var viewModel = ExploreViewModel()
    
    var body: some View {
        NavigationStack {
            ScrollView {
                TextField("To: ", text: $searchText)
//                    .frame(height: 44)
//                    .padding(.leading)
//                    .background(Color(.systemGray4))
                    .font(.subheadline)
                    .padding(12)
                    .background(Color(.systemGray6))
                    .cornerRadius(10)
                    .padding(.horizontal, 24)
                
                Text("RECENT")
                    .foregroundStyle(.white)
                    .font(.footnote)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
                
                ForEach(viewModel.searchableUser) { user in
                    VStack {
                        HStack {
                            CircularProfileView(size: .medium, user: user)
                            
                            Text(user.username)
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .foregroundStyle(.white)
                            
                            Spacer()
                        }
                        .padding(.leading)
                        
                        Divider()
                            .padding(.leading, 40)
                    }
                }
            }
            .navigationTitle("New Message")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                    .foregroundColor(.red)
                }
            }
        }
    }
}

#Preview {
    NewMessageView()
}
