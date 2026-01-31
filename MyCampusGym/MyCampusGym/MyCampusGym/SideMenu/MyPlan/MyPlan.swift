//
//  MyPlan.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 10/30/24.
//

import SwiftUI

struct MyPlan: View {
    
    @State var goalWeight:String = "150"
    @State var weeklyFrequency:String = "Three"
    @State var dailyFrequency:String = "One"
    @State var days:[Bool] = [false, false, false,
                              false, false, false, false]
    
    var frequencyOptions:[PickerOption] = [
        PickerOption(type: "String", value: "One", label: "Once"),
        PickerOption(type: "String", value: "Two", label: "Two"),
        PickerOption(type: "String", value: "Three", label: "Three"),
        PickerOption(type: "String", value: "Four", label: "Four"),
        PickerOption(type: "String", value: "Five", label: "Five"),
        PickerOption(type: "String", value: "Six", label: "Six"),
        PickerOption(type: "String", value: "Seven", label: "Seven")
    ]
    
    var body: some View {
        VStack(alignment: .leading) {
            Text("My Plan").font(.largeTitle).bold().padding(.bottom)
            InputView(text: $goalWeight, title: "Goal Weight", placeholder: "100")
            InputPicker(text: $dailyFrequency, title: "Workout Frequency (times per day)", options: frequencyOptions)
            InputPicker(text: $weeklyFrequency, title: "Workout Frequency (days per week)", options: frequencyOptions)
            Spacer()
        }.padding()
    }
}

#Preview {
    MyPlan(goalWeight: "", dailyFrequency: "")
}
