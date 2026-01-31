//
//  DirectMessageViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2025/4/18.
//

import Foundation
import Firebase
import FirebaseFirestore
import Combine

class DirectMessageViewModel: ObservableObject {
    @Published var messages: [Message] = []
    let user: AppUser
    private var listener: ListenerRegistration?
    
    let currentUserId = Auth.auth().currentUser?.uid ?? ""
    private var conversationId: String {
        guard let otherUserId = user.id else {
            return "unknown_convo"
        }
        return [currentUserId, otherUserId].sorted().joined(separator: "_")
    }

    init(user: AppUser) {
        self.user = user
        fetchMessages()
    }

    deinit {
        listener?.remove()
    }

    func fetchMessages() {
        print("Fetching messages for conversation ID: \(conversationId)") // Debugging line
        let db = Firestore.firestore()
        listener = db.collection("messages")
            .document(conversationId)
            .collection("messages")
            .order(by: "timestamp", descending: false)
            .addSnapshotListener { [weak self] snapshot, error in
                if let error = error {
                    print("Error fetching messages: \(error.localizedDescription)") // Debugging line
                    return
                }

                guard let documents = snapshot?.documents else {
                    print("No documents found.") // Debugging line
                    return
                }

                print("Fetched \(documents.count) messages from Firestore") // Debugging line
                self?.messages = documents.compactMap { try? $0.data(as: Message.self) }

                print("Messages count after fetch: \(self?.messages.count ?? 0)") // Debugging line
            }
    }

    func sendMessage(text: String) {
        guard let receiverId = user.id else {
            print("Receiver ID is missing")
            return
        }
        
        let db = Firestore.firestore()
        let newMessage = Message(
            text: text,
            senderId: currentUserId,
            receiverId: receiverId,
            timestamp: Date()
        )

        do {
            try db.collection("messages")
                .document(conversationId)
                .collection("messages")
                .addDocument(from: newMessage)
        } catch {
            print("Failed to send message: \(error)")
        }
    }
    
    func likeMessage(_ message: Message) {
        guard let messageId = message.id else { return }

        let messageRef = Firestore.firestore()
            .collection("messages")
            .document(conversationId)
            .collection("messages")
            .document(messageId)

        messageRef.updateData([
            "likedBy": FieldValue.arrayUnion([currentUserId])
        ]) { error in
            if let error = error {
                print("Error liking message: \(error.localizedDescription)")
            } else {
                print("Message liked!")
            }
        }
    }
}
