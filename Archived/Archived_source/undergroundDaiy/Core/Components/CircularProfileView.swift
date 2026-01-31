//
//  CircularProfileView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/6/10.
//

import SwiftUI
import Kingfisher

enum ProfileImageSize {
    case xxSmall
    case xSmall
    case small
    case medium
    case large
    case xlarge
    
    var dimension: CGFloat {
        switch self {
        case .xxSmall: return 28
        case .xSmall: return 32
        case .small: return 40
        case .medium: return 56
        case .large: return 64
        case .xlarge: return 80
        }
    }
}

struct CircularProfileView: View {
    let size: ProfileImageSize
    let user: AppUser
    
    var body: some View {
        let imageUrl = user.profileImageUrl
        if imageUrl != "" {
            KFImage(URL(string: imageUrl))
                .resizable()
                .scaledToFill()
                .frame(width: size.dimension, height: size.dimension)
                .clipShape(Circle())
        } else {
            Image(systemName: "person.circle.fill")
                .resizable()
                .frame(width: size.dimension, height: size.dimension)
                .foregroundColor(Color(.systemGray4))
        }
    }
}

//#Preview {
//    CircularProfileView()
//}
