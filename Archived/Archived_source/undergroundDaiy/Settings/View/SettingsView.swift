//
//  SettingsView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/7/22.
//

import SwiftUI
import Kingfisher

struct SettingsView: View {
    
    @ObservedObject var viewModel: ProfileViewModel
    
    init(user: AppUser) {
        self.viewModel = ProfileViewModel(user: user)
    }
    
    var body: some View {
        VStack {
            VStack {
                KFImage(URL(string: viewModel.user.profileImageUrl))
                    .resizable()
                    .frame(width: 80, height: 80)
                    .foregroundStyle(Color(.systemGray4))
                
                Text(viewModel.user.fullname)
                    .font(.title2)
                    .fontWeight(.semibold)
            }
            
            List {
                Section {
                    ForEach(SettingsOptionViewModel.allCases) { option in
                        HStack {
                            Image(systemName: option.imageName)
                                .resizable()
                                .frame(width: 24, height: 24)
                                .foregroundStyle(option.imageBackgroundColor)
                            
                            Text(option.title)
                                .font(.subheadline)
                        }
                    }
                }
                
                Section {
                    Button("Log Out") {
                        
                    }
                    
                    Button("Delete Account") {
                        
                    }
                }.foregroundStyle(.red)
            }
        }
    }
}

//#Preview {
//    SettingsView()
//}
