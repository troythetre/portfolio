//
//  LogInView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/18.
//

import SwiftUI

struct LogInView: View {
    @State private var email = ""
    @State private var password = ""
    @EnvironmentObject var viewModel: AuthViewModel
    var body: some View {
        //parent container
        VStack {
            
            //header view
            VStack(alignment: .leading) {
                HStack {
                    Spacer()
                }
                
                Image("logo")
                    .resizable()
                    .frame(width: 400, height: 400)
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
                
                CustomInputField(imageName: "lock",
                                 placeholderText: "Password",
                                 isSecureField: true,
                                 text: $password)
            }
            .padding(.horizontal, 32)
            .padding(.top, 44)
            
            HStack {
                Spacer()
                
                NavigationLink {
                    Text("Reset password view..")
                } label: {
                    Text("Forgot Password?")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundColor(.black)
                        .padding(.top)
                        .padding(.trailing, 24)
                }
            }
            
            Button {
                viewModel.login(withEmail: email, password: password)
            } label: {
                Text("Sign In")
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(width: 340, height: 50)
                    .background(Color(.black))
                    .clipShape(Capsule())
                    .padding()
            }
            .shadow(color: .gray.opacity(0.5), radius: 10, x: 0, y: 0)
            
            
            
            Spacer()
            
            NavigationLink {
                RegistrationView()
                    .navigationBarHidden(true)
            } label: {
                HStack {
                    Text("Don't have an account?")
                        .font(.footnote)
                    
                    Text("Sign Up")
                        .font(.footnote)
                        .fontWeight(.semibold)
                }
            }
            .padding(.bottom, 32)
            .foregroundColor(.black)
        }
        .ignoresSafeArea()
        .navigationBarHidden(true)
    }
}

#Preview {
    LogInView()
}
