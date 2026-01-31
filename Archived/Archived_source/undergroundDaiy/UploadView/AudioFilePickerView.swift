//
//  AudioFilePickerView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2025/1/24.
//

import SwiftUI
import UniformTypeIdentifiers
import FirebaseStorage
import FirebaseFirestore
import FirebaseAuth
import PhotosUI

struct AudioFilePickerView: View {
    @DocumentID var id: String?  // Use this for Firestore's auto-generated ID
    @State private var selectedFileURL: URL?
    @State private var selectedImage: UIImage?
    @State private var isDocumentPickerPresented = false
    @State private var fileName = "No file selected"
    
    //for beat
    @State private var beatName = ""
    @State private var beatLikes: Int = 0
    @State private var beatComments: Int = 0
    @State private var beatArchives: Int = 0
    @State private var beatStreams: Int = 0
    @State private var price = ""
    @State private var uploadStatus = ""
    @State private var isPhotoPickerPresented = false
    @State private var currentUser: AppUser?
    @State private var selectedOption: String? = "Beat"
    @State private var newHashtag: String = ""
    @State private var hashtags: [String]? = nil
    
    var body: some View {
        VStack {
            Text("Select an MP3 or WAV file")
                .font(.title)
                .padding()
            
            Picker("Select Type", selection: $selectedOption) {
                Text("Beat").tag("Beat")
                Text("Open").tag("Open")
            }
            .pickerStyle(MenuPickerStyle()) // Uses dropdown menu style
            .padding(.horizontal, 2)
            .background(Color.gray.opacity(0.2))
            .cornerRadius(4)
            
            TextField("Enter \(selectedOption ?? "Beat") Name", text: $beatName)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()
            
            TextField("Enter \(selectedOption ?? "Beat") Price", text: $price)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .keyboardType(.decimalPad) //Ensure numerical input for price
                .padding()
            
            VStack(alignment: .leading) {
                Text("Add Hashtags")
                    .font(.headline)
                    .padding(.top)

                HStack {
                    TextField("Enter hashtag", text: $newHashtag)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .autocapitalization(.none)
                        .disableAutocorrection(true)

                    Button(action: addHashtag) {
                        Image(systemName: "plus.circle.fill")
                            .foregroundColor(.blue)
                    }
                }
                .padding(.bottom)
                
                ScrollView(.horizontal, showsIndicators: false) {
                        HStack {
                            if let safeHashtags = hashtags {
                                ForEach(safeHashtags, id: \.self) { hashtag in
                                    HStack {
                                        Text("#\(hashtag)")
                                            .padding(8)
                                            .background(Color.blue.opacity(0.2))
                                            .cornerRadius(10)

                                        Button(action: { removeHashtag(hashtag) }) {
                                            Image(systemName: "xmark.circle.fill")
                                                .foregroundColor(.red)
                                        }
                                    }
                                }
                            }
                        }
                }
            }
            .padding()
            
            Button(action: {
                isPhotoPickerPresented.toggle()
            }) {
                Text("Choose Cover Art")
                    .padding()
                    .background(Color.purple)
                    .foregroundStyle(.white)
                    .cornerRadius(8)
            }
            .sheet(isPresented: $isPhotoPickerPresented) {
                PhotoPicker(selectedImage: $selectedImage)
            }
            
            if let selectedImage = selectedImage {
                Image(uiImage: selectedImage)
                    .resizable()
                    .scaledToFit()
                    .frame(height: 150)
                    .cornerRadius(8)
                    .padding()
            }
            
            Button(action: {
                isDocumentPickerPresented.toggle()
            }) {
                Text("Choose Audio File")
                    .padding()
                    .background(Color.blue)
                    .foregroundStyle(.white)
                    .cornerRadius(8)
            }
            .fileImporter(
                isPresented: $isDocumentPickerPresented,
                allowedContentTypes: [.mp3, .wav],
                allowsMultipleSelection: false
            ) { result in
                    switch result {
                    case .success(let urls):
                        if let url = urls.first {
                            selectedFileURL = url
                            fileName = url.lastPathComponent
                        }
                    case .failure(let error):
                        print("File selection failed: \(error.localizedDescription)")
                    }
                }
            
            Text("Selected file: \(fileName)")
                .padding()
            
            if let fileURL = selectedFileURL {
                Text("File path: \(fileURL.path)")
                    .font(.footnote)
                    .padding()
                
                Button(action: {
                    fetchCurrentUser {
                        uploadFileToFirebase(fileURL: fileURL, image: selectedImage)
                    }
                }) {
                    Text("Upload Beat")
                        .padding()
                        .background(Color.green)
                        .foregroundStyle(.white)
                        .cornerRadius(8)
                }
                .padding()
            }
            
            Text(uploadStatus)
                .foregroundStyle(uploadStatus.contains("Error") ? .red: .green)
                .padding()
        }
        .padding()
        .onAppear {
            fetchCurrentUser()
        }
    }
    
    private func addHashtag() {
        let trimmedHashtag = newHashtag.trimmingCharacters(in: .whitespacesAndNewlines)
        if !trimmedHashtag.isEmpty {
            if hashtags == nil {
                hashtags = []
            }
            if !hashtags!.contains(trimmedHashtag) {
                hashtags!.append(trimmedHashtag)
            }
        }
        newHashtag = ""
    }
    
    private func removeHashtag(_ hashtag: String) {
        hashtags?.removeAll { $0 == hashtag }
        if hashtags?.isEmpty == true {
            hashtags = nil
        }
    }
    
    func fetchCurrentUser(completion: (() -> Void)? = nil) {
        guard let userID = Auth.auth().currentUser?.uid else {
            uploadStatus = "Error: User not authenticated"
            return
        }
        
        Firestore.firestore().collection("users").document(userID).getDocument { snapshot, error in
            if let error = error {
                print("Failed to fetch user: \(error.localizedDescription)")
                uploadStatus = "Error fetching user data."
            } else if let snapshot = snapshot, snapshot.exists {
                do {
                    currentUser = try snapshot.data(as: AppUser.self)
                    completion?()
                } catch {
                    print("Error decoding AppUser: \(error.localizedDescription)")
                    uploadStatus = "Error decoding user data."
                }
            }
        }
    }
    
    func uploadFileToFirebase(fileURL: URL, image: UIImage?) { //this function uploads the file to storage, it iterates another function to write file onto firestore database
        guard let user = currentUser else {
            uploadStatus = "Error: User data not available."
            return
        }
        
        let storage = Storage.storage()
        let storageRef = storage.reference()
        let beatsRef = storageRef.child("beats/\(fileURL.lastPathComponent)")
        
        //upload the file
        let metadata = StorageMetadata()
        metadata.contentType = "audio/mpeg" //subjected to update if uploaded under different format
        
        beatsRef.putFile(from: fileURL, metadata: metadata) { metadata, error in
            if let error = error {
                print("Upload error: \(error.localizedDescription)")
                uploadStatus = "Error: \(error.localizedDescription)"
            } else {
                beatsRef.downloadURL { url, error in
                    if let error = error {
                        print("Failed to get download URL: \(error.localizedDescription)")
                    } else if let downloadURL = url {
                        if let image = image {
                            uploadImage(image: image) { imageURL in
                                saveFileMetadataToFirestore(fileName: fileURL.lastPathComponent, fileURL: downloadURL, imageURL: imageURL, user: user)
                            }
                            print("File uploaded successfully, Download URL: \(downloadURL.absoluteString)")
                            uploadStatus = "Upload and metadata save successful!"
                        } else {
                            saveFileMetadataToFirestore(fileName: fileURL.lastPathComponent, fileURL: downloadURL, imageURL: nil, user: user)
                        }
                    }
                }
            }
        }
    }
    
    func uploadImage(image: UIImage, completion: @escaping (URL?) -> Void) {
        let storage = Storage.storage()
        let storageRef = storage.reference()
        let imageRef = storageRef.child("beats/coverArt/\(UUID().uuidString).jpg")
        let metadata = StorageMetadata()
        metadata.contentType = "image/jpeg"
        
        if let imageData = image.jpegData(compressionQuality: 0.8) {
            imageRef.putData(imageData, metadata: metadata) {_, error in
                if let error = error {
                    print("Image upload error: \(error.localizedDescription)")
                    uploadStatus = "Error uploading cover art."
                    completion(nil)
                } else {
                    imageRef.downloadURL { url, error in
                        if let error = error {
                            print("Image URL error: \(error.localizedDescription)")
                            completion(nil)
                        } else {
                            completion(url)
                        }
                    }
                }
            }
        } else {
            print("Error converting image to data.")
            completion(nil)
        }
    }
    
    func saveFileMetadataToFirestore(fileName: String, fileURL: URL, imageURL: URL?, user: AppUser) {
        guard !beatName.isEmpty else {
            uploadStatus = "Error: Beat name is required."
            return
        }
        
        guard let priceValue = Double(price), priceValue > 0 else {
            uploadStatus = "Error: Price must be a valid positive number."
            return
        }
        
        let db = Firestore.firestore()
        
        var data: [String: Any] = [
            "fileName": fileName,
            "fileURL": fileURL.absoluteString,
            "beatName": beatName,
            "price": priceValue,
            "userID": user.id ?? "",
            "username": user.username,
            "userProfilePicture": user.profileImageUrl,
            "beatLikes": beatLikes,
            "beatComments": beatComments,
            "beatArchives": beatArchives,
            "beatStreams": beatStreams,
            "timestamp": Timestamp(date: Date())
        ]
        
        if let imageURL = imageURL {
            data["coverArtURL"] = imageURL.absoluteString
        }
        
        if let hashtags = hashtags, !hashtags.isEmpty {
            data["hashtags"] = hashtags
        }
        
        let collectionName = (selectedOption == "Open") ? "opens" : "beats"
        db.collection(collectionName).addDocument(data: data) { error in
            if let error = error {
                print("Error saving metadata to Firestore: \(error.localizedDescription)")
                uploadStatus = "Error saving metadata to Firestore"
            } else {
                // Successfully added the document, fetch its ID
                let documentRef = db.collection("beats").document()
                let documentID = documentRef.documentID
                print("File metadata saved to Firestore successfully.")
                uploadStatus = "Upload and metadata save successful!"
            }
        }
    }
}

struct PhotoPicker: UIViewControllerRepresentable {
    @Binding var selectedImage: UIImage?
    
    func makeUIViewController(context: Context) -> PHPickerViewController {
        var config = PHPickerConfiguration()
        config.filter = .images
        config.selectionLimit = 1
        
        let picker = PHPickerViewController(configuration: config)
        picker.delegate = context.coordinator
        return picker
    }
    
    func updateUIViewController(_ uiViewController: PHPickerViewController, context: Context) {}
    
    func makeCoordinator() -> Coordinator {
        return Coordinator(self)
    }
    
    class Coordinator: NSObject, PHPickerViewControllerDelegate {
        let parent: PhotoPicker
        
        init(_ parent: PhotoPicker) {
            self.parent = parent
        }
        
        func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
            picker.dismiss(animated: true)
            
            guard let provider = results.first?.itemProvider, provider.canLoadObject(ofClass: UIImage.self) else { return }
            
            provider.loadObject(ofClass: UIImage.self) { image, _ in
                DispatchQueue.main.async {
                    self.parent.selectedImage = image as? UIImage
                }
            }
        }
    }
}

