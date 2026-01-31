//
//  AuthViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/20.
//

import SwiftUI
import Firebase

class AuthViewModel: ObservableObject {
    let db = Firestore.firestore()
    @Published var userSession: FirebaseAuth.User?
    @Published var didAuthenticateUser = false
    @Published var currentUser: AppUser?
    private var tempUserSession: FirebaseAuth.User?
    
    private let service = UserService()
    
    //firestore configuration
    
    init() {
        self.userSession = Auth.auth().currentUser //validate user session
        self.fetchUser() //get user's uid
    }
    
    func login(withEmail email: String, password: String) {
        Auth.auth().signIn(withEmail: email, password: password) { result, error in
            if let error = error {
                print("DEBUG: failed to sign in with error \(error.localizedDescription)") //email or password wrong with account
                return
            }
            
            guard let user = result?.user else { return }
            self.userSession = user
            self.fetchUser()
        }
    }
    
    func register(withEmail email: String, password: String, fullname: String, username: String) {
        Auth.auth().createUser(withEmail: email, password: password) { result, error in
            if let error = error {
                print("DEBUG: failed to register with error \(error.localizedDescription)")
                return
            }
            
            guard let user = result?.user else { return }
            self.tempUserSession = user
            
            let data = ["email": email,
                        "username": username.lowercased(),
                        "fullname": fullname,
                        "uid": user.uid] //registration information
            
            Firestore.firestore().collection("users")
                .document(user.uid)
                .setData(data) { _ in
                    self.didAuthenticateUser = true //authenticating user into the firebase
                }
        }
    }
    
    func signOut() {
        //sets user session to nil so we show login view
        userSession = nil
        
        //signs user out on server
        try? Auth.auth().signOut()
    }
    
    func uploadProfileImage(_ image: UIImage) { //uploading profile image
        guard let uid = tempUserSession?.uid else { return }
        print("DEBUG: print out uid \(uid)")
        
        ImageUploader.uploadImage(image: image) { profileImageUrl in
            Firestore.firestore().collection("users")
                .document(uid)
                .updateData(["profileImageUrl": profileImageUrl]) { _ in
                    self.userSession = self.tempUserSession
                    self.fetchUser()
                }
        }
    }
    
    func fetchUser() {
        guard let uid = self.userSession?.uid else { return}
        
        service.fetchUser(withUid: uid) { user in
            self.currentUser = user
        }
    }
}
