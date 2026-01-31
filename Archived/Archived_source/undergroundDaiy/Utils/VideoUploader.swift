//
//  VideoUploader.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/23.
//

import Foundation
import FirebaseStorage

struct VideoUploader {
    
    static func uploadVideo(withData videoData: Data) async throws -> String? {
        let filename = NSUUID().uuidString
        let ref = Storage.storage().reference().child("/videos/\(filename)")
       
        let metadata = StorageMetadata()
        metadata.contentType = "video/quicktime"
        
        do {
            let _ = try await ref.putDataAsync(videoData, metadata: metadata)
            let url = try await ref.downloadURL()
            return url.absoluteString
        } catch {
            print("DEBUG: fail to upload video with error \(error.localizedDescription)")
            return nil
        }
    }
}
