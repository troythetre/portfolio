//
//  UploadPostViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/24.
//

import Foundation
import UIKit

class UploadPostViewModel: ObservableObject {
    @Published var didUploadPost = false
    let service = PostService()
    
    func uploadPost(withCaption caption: String, withTag tag: String, withImage image: UIImage) {
        service.uploadPhoto(image: image) { success in
    
            }
        
        service.uploadPost(caption: caption, tag: tag, image: image) { success in
            if success {
                //dismiss screen somehow
                self.didUploadPost = true
            } else {
                //show error message to user..
            }
        }
    }
}
