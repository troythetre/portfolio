import Foundation
import FirebaseFirestore
import FirebaseAuth
import Firebase

class CommentService: ObservableObject {
    @Published var comments: [Comment] = []
    
    private let db = Firestore.firestore()

    func fetchComments(forBeatID beatID: String) {
        db.collection("beats").document(beatID).collection("comments")
            .order(by: "timestamp", descending: true)
            .addSnapshotListener { snapshot, error in
                if let error = error {
                    print("Error fetching comments: \(error.localizedDescription)")
                    return
                }
                
                self.comments = snapshot?.documents.compactMap { doc -> Comment? in
                    try? doc.data(as: Comment.self)
                } ?? []
            }
    }

    func addComment(toBeatID beatID: String, text: String, completion: @escaping () -> Void) {
        guard let currentUser = Auth.auth().currentUser else {
            print("No authenticated user found!")
            return
        }
        
        let uid = currentUser.uid
        
        db.collection("users").document(uid).getDocument { snapshot, error in
            let data = snapshot?.data()
            let username = data?["username"] as? String ?? "anon"
            let profilePicture = data?["profileImageUrl"] as? String ?? ""
            
            let comment = Comment(
                beatID: beatID,
                userID: uid,
                username: username,
                userProfilePicture: profilePicture,
                text: text,
                timestamp: Date()
            )
            
            do {
                try self.db.collection("beats").document(beatID).collection("comments")
                    .addDocument(from: comment) { error in
                        if let error = error {
                            print("Error adding comment: \(error)")
                        } else {
                            print("✅ Comment successfully added to beat \(beatID)!")
                        }
                        completion()
                    }
            } catch {
                print("🔥 Failed to encode comment: \(error.localizedDescription)")
                completion()
            }
        }
    }
}
