//
//  EditProfileView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/8.
//

import SwiftUI
import PhotosUI

struct EditProfileView: View {
    
    @State private var selectedImage: UIImage?
    @State private var bio = ""
    @State private var link = ""
    @State private var isPrivateProfile = false
    @Environment(\.dismiss) var dismiss
    
    @EnvironmentObject var viewModel: CurrentUserProfileViewModel
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color(.systemGroupedBackground)
                    .edgesIgnoringSafeArea([.bottom, .horizontal])
                
                VStack(alignment: .leading) {
                    //name and profile image
                    HStack {
                        VStack(alignment: .leading) {
                            Text("Name")
                                .fontWeight(.semibold)
                            Text("808archive")
                        }
                        .foregroundStyle(.black)
                        
                        Spacer()
                        
//                        ImagePicker(selectedImage: $selectedImage) {
//                            if let image = viewModel.profileImage {
//                                image
//                                    .resizable()
//                                    .scaledToFill()
//                                    .frame(width: 40, height: 40)
//                                    .clipShape(Circle())
//                            } else {
//                                Image("ken")
//                                    .resizable()
//                                    .clipShape(/*@START_MENU_TOKEN@*/Circle()/*@END_MENU_TOKEN@*/)
//                                    .frame(width: 60, height: 60)
//                            }
//                        }
                        
                        Image("ken")
                            .resizable()
                            .clipShape(/*@START_MENU_TOKEN@*/Circle()/*@END_MENU_TOKEN@*/)
                            .frame(width: 60, height: 60)
                    }
                    
                    Divider()
                    
                    //bio field
                    
                    VStack(alignment: .leading) {
                        Text("Bio")
                            .fontWeight(.semibold)
                        
                        TextField("Enter your bio: ", text: $bio, axis: .vertical)
                    }
                    .foregroundStyle(.black)
                    
                    Divider()
                    
                    VStack(alignment: .leading) {
                        Text("Link")
                            .fontWeight(.semibold)
                        
                        TextField("Enter your link: ", text: $link)
                    }
                    .foregroundStyle(.black)
                    
                    Divider()
                    
                    VStack(alignment: .leading) {
                        Toggle("Private profile", isOn: $isPrivateProfile).fontWeight(.semibold)
                    }
                    .foregroundStyle(.black)
                    
                }
                .font(.footnote)
                .padding()
                .background(.white)
                .cornerRadius(10)
                .overlay {
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(Color(.systemGray4), lineWidth: 1)
                }
                .padding()
            }
            .navigationTitle("Edit Profile")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                    .font(.subheadline)
                    .foregroundStyle(.red)
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        
                    }
                    .font(.subheadline)
                    .foregroundStyle(.blue)
                    .fontWeight(.semibold)
                }
            }
        }
    }
}

#Preview {
    EditProfileView()
}
