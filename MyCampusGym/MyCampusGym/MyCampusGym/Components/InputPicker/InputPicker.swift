//
//  InputPicker.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 10/30/24.
//

import SwiftUI

struct InputPicker: View {
    @Binding var text: String
    let title: String
    let options:[PickerOption]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .foregroundStyle(Color(.darkGray))
                .fontWeight(.semibold)
                .font(.footnote)
            
            Picker(title, selection: $text) {
                ForEach(options, id: \.self.id) {option in
                    Text(option.value)
                        .tag(option.value)
                }
            }
            .font(.system(size: 14))
            
            Divider()
        }
    }
}

#Preview {
    InputPicker(text: .constant("TestValue"), title: "Options", options: [PickerOption(type:"String", value:"TestValue", label:"TestLabel")])
}
