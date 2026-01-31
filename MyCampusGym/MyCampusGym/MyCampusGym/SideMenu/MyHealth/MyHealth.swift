//
//  MyHealth.swift
//  MyCampusGym
//
//  Created by Anthony Mendizabal on 11/4/24.
//

import SwiftUI

struct MyHealthView: View {
    @State private var weight: String = ""
    @State private var feet: String = ""
    @State private var inches: String = ""
    @State private var bmi: Double = 0.0

    var body: some View {
        Form {
            Section(header: Text("Enter Your Health Data")) {
                TextField("Weight (lbs)", text: $weight)
                    .keyboardType(.decimalPad)

                TextField("Height (feet)", text: $feet)
                    .keyboardType(.numberPad)

                TextField("Height (inches)", text: $inches)
                    .keyboardType(.numberPad)
            }

            Section(header: Text("Body Mass Index")) {
                Text("\(bmi, specifier: "%.2f")")
                    .font(.title2)
            }

            Button("Update Health Data") {
                calculateBMI()
                saveHealthData()
            }
        }.onAppear {
            loadHealthData()
            calculateBMI()
        }
    }

    private func calculateBMI() {
        if let weightValue = Double(weight),
           let feetValue = Double(feet),
           let inchesValue = Double(inches) {
            
            let totalHeightInInches = (feetValue * 12) + inchesValue
            if totalHeightInInches > 0 {
                bmi = (weightValue * 703) / (totalHeightInInches * totalHeightInInches)
            } else {
                bmi = 0.0
            }
        } else {
            bmi = 0.0
        }
    }
    
    private func saveHealthData() {
        UserDefaults.standard.set(weight, forKey: "weight")
        UserDefaults.standard.set(feet, forKey: "heightFeet")
        UserDefaults.standard.set(inches, forKey: "heightInches")
        UserDefaults.standard.set(bmi, forKey: "bmi")
    }
    
    private func loadHealthData() {
        weight = UserDefaults.standard.string(forKey: "weight") ?? ""
        feet = UserDefaults.standard.string(forKey: "heightFeet") ?? ""
        inches = UserDefaults.standard.string(forKey: "heightInches") ?? ""
        bmi = UserDefaults.standard.double(forKey: "bmi")
    }
}

#Preview {
    MyHealthView()
}
