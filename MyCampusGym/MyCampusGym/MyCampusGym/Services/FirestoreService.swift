//
//  FirebaseService.swift
//  MyCampusGym
//
//  Created by Brandon Holmes on 11/14/24.
//

import Foundation

class FirestoreService {
    
    func dateToString(date:Date?) -> String {
        if(date != nil) {
            let year = String(Calendar.current.component(.year, from: date!))
            var month = String(Calendar.current.component(.month, from: date!))
            if month.count < 2 {
                month = "0" + month
            }
            var day = String(Calendar.current.component(.day, from: date!))
            if day.count < 2 {
                day = "0" + day
            }
            return "\(year)-\(month)-\(day)"
        }
        return ""
    }
    
    func stringToDate(date:String) -> Date {
        if(date != "") {
            let splicedDate = date.split(separator: "-")
            let year = Int(splicedDate[0])
            let month = Int(splicedDate[1])
            let day = Int(splicedDate[2])
            return Calendar.current.date(from: DateComponents(year: year, month: month, day: day))!
        }
        return Calendar.current.date(from: DateComponents(year: 1900, month: 12, day: 31))!
    }
    
    func standardTimeToString(time:String) -> String {
        
        let formatter = DateFormatter()
        
        formatter.dateFormat = "hh:mm:ss a"
        
        guard let date = formatter.date(from: time) else { return "" }
        
        let hour = Calendar.current.component(.hour, from: date)
        let minute = Calendar.current.component(.minute, from: date)
        let second =  Calendar.current.component(.second, from: date)
        
        var finalHour: String
        var finalMin: String
        var finalSec: String
        
        if (hour < 10) {
            finalHour = "0" + String(hour)
        }
        else {
            finalHour = String(hour)
        }
        if (minute < 10) {
            finalMin = "0" + String(minute)
        }
        else {
            finalMin = String(minute)
        }
        if(second < 10) {
            finalSec = "0" + String(second)
        }
        else {
            finalSec = String(second)
        }
        
        return finalHour + ":" + finalMin + ":" + finalSec
    }
}
