//
//  FirebaseStorageService.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/30/24.
//
/*
import FirebaseStorage
import Foundation
import UIKit

func uploadPhoto(image: UIImage, completion: @escaping (Result<String, Error>) -> Void) {
    // Convert UIImage to Data
    guard let imageData = image.jpegData(compressionQuality: 0.8) else {
        completion(.failure(NSError(domain: "Image Conversion Error", code: -1, userInfo: nil)))
        return
    }

    // Create a unique filename for the image
    let filename = UUID().uuidString + ".jpg"

    // Reference to Firebase Storage
    let storageRef = Storage.storage().reference().child("images/\(filename)")

    // Upload the image data
    storageRef.putData(imageData, metadata: nil) { metadata, error in
        if let error = error {
            completion(.failure(error))
            return
        }

        // Get the download URL
        storageRef.downloadURL { url, error in
            if let error = error {
                completion(.failure(error))
            } else if let downloadURL = url?.absoluteString {
                completion(.success(downloadURL))
            }
        }
    }
}

*/
