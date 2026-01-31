//
//  RegistrationView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/18.
//

import SwiftUI

struct RegistrationView: View {
    
    @State private var email = ""
    @State private var username = ""
    @State private var fullname = ""
    @State private var password = ""
    @Environment(\.presentationMode) var presentationMode
    @EnvironmentObject var viewModel: AuthViewModel
    
    var body: some View {
        NavigationStack() {
            VStack {
        //            if $viewModel.didAuthenticateUser == true {
        //                NavigationLink(destination: ProfilePhotoSelectorView(), label: { })
        //            }
        //            NavigationView {
        //                NavigationLink(destination: ProfilePhotoSelectorView(),
        //                               isActive: $viewModel.didAuthenticateUser,
        //                               label: { })
        //            }
        //            .navigationViewStyle(StackNavigationViewStyle())
                    
                   
                    
        //            NavigationLink(destination: ProfilePhotoSelectorView(),
        //                           isActive: $viewModel.didAuthenticateUser,
        //                           label: { })
                   
                    //AuthHeaderView(title1: "Get Started", title2: "Be a part of the community")
                    
                    VStack(alignment: .leading) {
                        HStack {
                            Spacer()
                        }
                        
                        Image("logo")
                            .resizable()
                            .frame(width: 590, height: 700)
                            .offset(x: -8, y:20)
                            .multilineTextAlignment(.center)
                    }
                    .frame(height: 260)
                    .padding(.leading)
                    .background(Color(.black))
                    .foregroundColor(.white)
                    .clipShape(roundedShape(corners: [.bottomRight]))
                    
                    VStack(spacing: 40) {
                        CustomInputField(imageName: "envelope",
                                         placeholderText: "Email",
                                         text: $email)
                        
                        CustomInputField(imageName: "person",
                                         placeholderText: "Username",
                                         text: $username)
                        
                        CustomInputField(imageName: "person", 
                                         placeholderText: "Name",
                                         text: $fullname)
                        
                        CustomInputField(imageName: "lock",
                                         placeholderText: "Password",
                                         isSecureField: true,
                                         text: $password)
                        
                    }
                    .padding(32)
                    
                    Button {
                        viewModel.register(withEmail: email, password: password, 
                                           fullname: fullname, username: username)
                    } label: {
                        Text("Sign Up")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(width: 340, height: 50)
                            .background(Color(.black))
                            .clipShape(Capsule())
                            .padding()
                    }
                    .shadow(color: .gray.opacity(0.5), radius: 10, x: 0, y: 0)
                    
                    
                    Spacer()
                    
                    Button {
                        presentationMode.wrappedValue.dismiss()
                    } label: {
                        HStack {
                            Text("Already have an account?")
                                .font(.footnote)
                            
                            Text("Sign In")
                                .font(.footnote)
                                .fontWeight(.semibold)
                        }
                    }
                    .navigationDestination(isPresented: $viewModel.didAuthenticateUser) {ProfilePhotoSelectorView()}
                    .padding(.bottom, 32)
                    .foregroundColor(Color(.black))
                }
                
            .ignoresSafeArea()
        }
        
    }
}

#Preview {
    RegistrationView()
}
