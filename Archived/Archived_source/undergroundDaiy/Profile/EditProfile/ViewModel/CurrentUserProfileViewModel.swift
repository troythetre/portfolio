//
//  CurrentUserProfileViewModel.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/8.
//

import Foundation
import PhotosUI
import SwiftUI

class CurrentUserProfileViewModel: ObservableObject {
    @Published var currentUser: AppUser?
    @Published var selectedItem: PhotosPickerItem?
    @Published var profileImage: Image?
}
