//
//  Activity.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/12.
//

import SwiftUI

struct NotificationView: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVStack(spacing: 24) {
                    ForEach(0..<10) { notification in
                        NotificationCell()
                    }
                }
            }
            .navigationTitle("Notifications")
            //.navigationBarTitleDisplayMode(.inline)
            .padding(.top)
        }
    }
}

#Preview {
    NotificationView()
}
