//
//  threadPhotos.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/30.
//

import SwiftUI

struct threadPhotos: View {
    
    @State var isPickerShowing = false
    @State var selectedImage: UIImage?
    
    var body: some View {
        VStack {
            
            if selectedImage != nil {
                Image(uiImage: selectedImage!)
                    .resizable()
                    .frame(width: 200, height: 200)
            }
            
            Button {
                //show the image picker
                isPickerShowing = true
            } label: {
                Text("Select a photo")
            }
        }
        .sheet(isPresented: $isPickerShowing, onDismiss: nil) {
            //image picker
            ImagePickerTester(selectedImage: $selectedImage, isPickershowing: $isPickerShowing)
        }
        
    }
    
}

#Preview {
    threadPhotos()
}
