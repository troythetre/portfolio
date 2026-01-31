//
//  RegistrationView.swift
//  MyCampusGym
//
//  Created by Troy Wu on 2024/10/21.
//

import SwiftUI

struct RegistrationView: View {
    @State private var email = ""
    @State private var fullname = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var alertMessage = ""
    @State private var showAlert = false
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var viewModel:AuthViewModel
    
    var body: some View {
        VStack {
            //image
            Image("MyCampusGym")
                .resizable()
                .scaledToFill()
                .cornerRadius(15)
                .frame(width: 100, height: 120)
                .padding(.vertical, 32)
            
            VStack(spacing: 24) {
                InputView(text: $email,
                          title: "Email Address",
                          placeholder: "name@domain.edu")
                .autocapitalization(.none)
                
                InputView(text: $fullname,
                          title: "Full Name",
                          placeholder: "Enter your name")
                
                InputView(text: $password,
                          title: "Password",
                          placeholder: "Enter your password",
                          isSecureField: true)
                
                InputView(text: $confirmPassword,
                          title: "Confirm Password",
                          placeholder: "Confirm your password",
                          isSecureField: true)
            }
            .padding(.horizontal)
            .padding(.top, 12)
            
            Button {
                Task {
                    try await viewModel.createUser(withEmail: email,
                                                   password: password,
                                                   fullName: fullname,
                                                   alertMessage: $alertMessage,
                                                   showAlert: $showAlert)
                }
            } label: {
                HStack {
                    Text("Sign Up")
                        .fontWeight(.semibold)
                    Image(systemName: "arrow.right")
                }
                .foregroundColor(.white)
                .frame(width: UIScreen.main.bounds.width - 32, height: 48)
            }
            .background(password != confirmPassword ? Color.gray : Color(.systemBlue))
            .cornerRadius(10)
            .padding(.top, 24)
            .alert(isPresented: $showAlert) {
                Alert(
                  title: Text("Error"),
                  message: Text(alertMessage),
                  dismissButton: .default(Text("OK"))
                )
            }
            .disabled(password != confirmPassword)
            
            Spacer()
            
            Button {
                dismiss()
            } label: {
                HStack(spacing: 3) {
                    Text("Already have an account?")
                    Text("Sign in")
                        .fontWeight(.bold)
                }
                .font(.system(size: 14))
            }
        }
    }
}

#Preview {
    RegistrationView()
}
