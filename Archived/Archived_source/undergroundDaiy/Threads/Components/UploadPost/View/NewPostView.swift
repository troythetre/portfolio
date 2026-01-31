//
//  NewPost.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/18.
//

import SwiftUI
import Kingfisher

struct NewPostView: View {
    @State private var tag = ""
    @State private var caption = ""
    @State var selectedImage: UIImage?
    @State var isPickerShowing = false
    @Environment(\.presentationMode) var presentationMode
    @EnvironmentObject var authViewModel: AuthViewModel
    @ObservedObject var viewModel = UploadPostViewModel()
    
    var body: some View {
        VStack {
            HStack {
                Button {
                    presentationMode.wrappedValue.dismiss()
                } label: {
                    Text("Cancel")
                        .foregroundColor(Color(.red))
                }
                
                Spacer()
                
                Button {
                    viewModel.uploadPost(withCaption: caption, withTag: tag, withImage: selectedImage!)
                } label: {
                    Text("Post")
                        .bold()
                        .padding(.horizontal)
                        .padding(.vertical, 8)
                        .background(Color(.white))
                        .foregroundColor(.black)
                        .clipShape(Capsule())
                }
            }
            .padding()
            
            VStack {
                HStack(alignment: .top) {
                    if let user = authViewModel.currentUser {
                        KFImage(URL(string: user.profileImageUrl))
                            .resizable()
                            .frame(width: 64, height: 64)
                            .clipShape(/*@START_MENU_TOKEN@*/Circle()/*@END_MENU_TOKEN@*/)
                    }
                        
                    
                    TextArea("What's happening", text: $caption)
                        .foregroundColor(.white)
                }
//                .padding()
                
                TextField("Tag", text: $tag)
                    .textFieldStyle(.roundedBorder)
                    .foregroundColor(.white)
                    .padding()
                
                HStack {
                    VStack {
                        
                        if selectedImage != nil {
                            Image(uiImage: selectedImage!)
                                .resizable()
                                .frame(width: 100, height: 100)
                        }
                        
                        Button {
                            //show the image picker
                            isPickerShowing = true
                        } label: {
                            Text("Select a photo")
                        }
                    }
                    .sheet(isPresented: $isPickerShowing, onDismiss: nil) {
                        //image picker
                        ImagePickerTester(selectedImage: $selectedImage, isPickershowing: $isPickerShowing)
                    }
                
            }
            
}
            
//            HStack() {
//                Button {
//                    
//                } label: {
//                    Image(systemName: "camera.fill")
//                        .clipShape(Circle())
//                        .foregroundColor(.black)
//                        .background(Color(.white))
//                }
//            }
//            .padding()
        }
        .onReceive(viewModel.$didUploadPost) { success in
            if success {
                presentationMode.wrappedValue.dismiss()
            }
        }
    }
}

#Preview {
    NewPostView()
}
