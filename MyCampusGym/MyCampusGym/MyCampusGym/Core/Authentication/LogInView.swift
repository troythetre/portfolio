//
//  LogInView.swift
//  MyCampusGym
//
//  Created by Troy Wu on 2024/10/21.
//

import SwiftUI

struct LogInView: View {
    @State private var email = ""
    @State private var password = ""
    @EnvironmentObject var viewModel: AuthViewModel
    @State var showAlert = false
    @State var alertMessage = ""
    
    var body: some View {
        NavigationStack {
            VStack {
                //image
                Image("MyCampusGym")
                    .resizable()
                    .scaledToFill()
                    .cornerRadius(15)
                    .frame(width: 100, height: 120)
                    .padding(.vertical, 32)
                
                //form fields
                VStack(spacing: 24) {
                    InputView(text: $email,
                              title: "Email Address",
                              placeholder: "name@domain.edu")
                    .autocapitalization(.none)
                    
                    InputView(text: $password,
                              title: "Password",
                              placeholder: "Enter your password",
                              isSecureField: true)
                }
                .padding(.horizontal)
                .padding(.top, 12)
                
                //sign in button
                
                Button {
                    Task {
                        try await viewModel.signIn(withemail: email,
                                                   password: password,
                                                   alertMessage: $alertMessage,
                                                   showAlert: $showAlert)
                    }
                    
                } label: {
                    HStack {
                        Text("SIGN IN")
                            .fontWeight(.semibold)
                        Image(systemName: "arrow.right")
                    }
                    .foregroundColor(.white)
                    .frame(width: UIScreen.main.bounds.width - 32, height: 48)
                }
                .background(Color(.systemBlue))
                .cornerRadius(10)
                .padding(.top, 24)
                .alert(isPresented: $showAlert) {
                    Alert(
                      title: Text("Error"),
                      message: Text(alertMessage),
                      dismissButton: .default(Text("OK"))
                    )
                }
                
                Spacer()
                
                //sign up button
                
                NavigationLink {
                    RegistrationView()
                        .navigationBarBackButtonHidden(true)
                } label: {
                    HStack(spacing: 3) {
                        Text("Don't have an account?")
                        Text("Sign up")
                            .fontWeight(.bold)
                    }
                    .font(.system(size: 14))
                }
            }
        }
    }
}

#Preview {
    LogInView()
}
