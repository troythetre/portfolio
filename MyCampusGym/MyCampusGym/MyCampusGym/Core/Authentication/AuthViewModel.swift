//
//  AuthViewModel.swift
//  MyCampusGym
//
//  Created by Troy Wu on 2024/10/23.
//

import SwiftUI
import Foundation
import Firebase
import FirebaseAuth
import Combine

class AuthViewModel: ObservableObject {
    
    var handle: AuthStateDidChangeListenerHandle?
    @Published var isLoggedIn = false
    var willChange = PassthroughSubject<AuthViewModel, Never>()
    @Published var currentSessionUser: User?
    var ps:ProfileService = ProfileService()
    
    func listenAuthenticationState() {
        handle = Auth.auth().addStateDidChangeListener { (auth, user) in
            if let user = user {
                // if we have a user, create a new user model
                print("Got user: \(user)")
                self.currentSessionUser = User(
                    id: user.uid,
                    displayName: user.displayName ?? "",
                    email: user.email ?? ""
                )
            } else {
                self.currentSessionUser = nil
            }
        }
    }

    
    init() {
        
    }
    
    func signIn(withemail email: String, password: String, alertMessage: Binding<String>, showAlert: Binding<Bool>) async throws {
        print("SignIn 21") //For debugging only
        Auth.auth().signIn(withEmail: email.trimmingCharacters(in: .whitespaces), password: password) { [weak self] authResult, firebaseError in
            guard self != nil else { return }
            
            if let error = firebaseError as NSError? {
                alertMessage.wrappedValue = (error.userInfo[AuthErrorUserInfoNameKey] as? String)!
                showAlert.wrappedValue = true
                return
            }
            
            print("SignIn 54")
            guard let user = authResult?.user else { return }
            
            if user.isEmailVerified {
                print("User (\(user)) is verified = \(user.isEmailVerified)")
            } else {
                user.sendEmailVerification { error in
                    if let error = error {
                        print("Error sending verification email: \(error.localizedDescription)")
                    } else {
                        print("Verification email sent! Please check your inbox.")
                        self!.signOut()
                        alertMessage.wrappedValue = "Verification email sent to \(self!.currentSessionUser!.email). You must verify your email address before you can sign-in."
                        showAlert.wrappedValue = true
                    }
                    
                }
            }
            print("SignIn 71")
        }
        
    }
    
    func createUser(withEmail email: String, password: String, fullName: String, alertMessage:Binding<String> = .constant(""), showAlert: Binding<Bool> = .constant(false)) async throws {
        //print("Create User 27") //For debugging only
        Auth.auth().createUser(withEmail: email.trimmingCharacters(in: .whitespaces), password: password) { authResult, error in
            if let error = error as NSError? {
                print("Error querying document: \(error.localizedDescription)")
                print("Error code: \(error.code)")
                print("User info: \(error.userInfo)")
                alertMessage.wrappedValue = (error.userInfo[AuthErrorUserInfoNameKey] as? String)!
                showAlert.wrappedValue = true
                return
            }
            
            self.currentSessionUser = User(
                id: (authResult?.user.uid)!,
                displayName: authResult?.user.displayName ?? "",
                email: authResult?.user.email ?? ""
                )
            
            guard let user = authResult?.user else {
                return
            }
            
            let changeRequest = user.createProfileChangeRequest()
                changeRequest.displayName = fullName
                changeRequest.commitChanges { error in
                    
                }
            self.currentSessionUser?.displayName = fullName
            
            self.ps.createProfile(uid: self.currentSessionUser?.id ?? "", email: self.currentSessionUser?.email ?? "") { p in
                
            }
            
            user.sendEmailVerification { error in
                if let error = error {
                    print("Error sending verification email: \(error.localizedDescription)")
                } else {
                    print("Verification email sent! Please check your inbox.")
                    alertMessage.wrappedValue = "Verification email sent to \(self.currentSessionUser!.email)."
                    showAlert.wrappedValue = true
                    self.signOut()
                }
            }
        }
        
        
        //print("Create user 31") //For debugging only
    }
    
    func signOut() {
        let firebaseAuth = Auth.auth()
        do {
          try firebaseAuth.signOut()
        } catch let signOutError as NSError {
          print("Error signing out: %@", signOutError)
        }

    }
    
    //Update Name is used to set the name of a user after creation in firebase
    func updateName() {
        let changeRequest = Auth.auth().currentUser?.createProfileChangeRequest()
        changeRequest?.displayName = "Brandon Holmes"
        changeRequest?.commitChanges { error in
                
            }
        self.currentSessionUser?.displayName = "Brandon Holmes"
    }
    
    func deleteAccount() {
        
    }
    
    func fetchUser() async {
        
    }
}
