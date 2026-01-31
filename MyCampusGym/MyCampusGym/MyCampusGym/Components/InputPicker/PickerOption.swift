//
//  PickerOption.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 10/30/24.
//

import Foundation

struct PickerOption:Identifiable {
    var id:UUID = UUID()
    var type:String
    var value:String
    var label:String
    
    mutating func setValue(value:String) -> Bool {
        if(type == "String") {
            self.value = value
            return true
        }
        else if(type == "Int") {
            if(Int(value) != 0) {
                self.value = value
                return true
            }
        }
        else if(type == "Bool") {
            if(value == "true" || value == "false") {
                self.value = value
                return true
            }
        }
        return false
    }
}
