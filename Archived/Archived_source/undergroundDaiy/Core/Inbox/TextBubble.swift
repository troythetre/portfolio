//
//  TextBubble.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2025/4/18.
//

import SwiftUI

struct TextBubble: View {
    let message: Message
    let isFromCurrentUser: Bool
    
    private func formattedTimestamp() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "h:mm a" // Change format as needed
        return formatter.string(from: message.timestamp)
    }

    var body: some View {
        VStack(alignment: isFromCurrentUser ? .trailing : .leading) {
            Text(message.text)
                .padding(10)
                .background(isFromCurrentUser ? Color.blue : Color.gray.opacity(0.3))
                .foregroundColor(isFromCurrentUser ? .white : .black)
                .cornerRadius(12)
                .frame(maxWidth: 250, alignment: isFromCurrentUser ? .trailing : .leading)
            
            Text(formattedTimestamp())
                .font(.caption)
                .foregroundColor(.gray)
                .padding(.top, 2)
                .padding(.trailing, isFromCurrentUser ? 10 : 0)
                .padding(.leading, isFromCurrentUser ? 0 : 10)
        }
    }
}
