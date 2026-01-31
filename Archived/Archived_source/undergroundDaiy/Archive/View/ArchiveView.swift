//
//  ArchiveView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2024/5/26.
//

import SwiftUI

struct ArchiveView: View {
    
    @State private var selectedFilter: JournalismFilterViewModel = .feed
    @Namespace var animation
    
    var body: some View {
        VStack {
            Text("Archives") //Title
                .font(.title).bold()
            Text("") //spacing
            filterBar //navigation bar
//            ScrollView {
//                VStack {
//                    if selectedFilter == .videos {
//                        Text("Videos")
//                            .font(.headline)
//                            .fontWeight(.semibold)
//                        Button {
//                            print("DEBUG: enter saved videos")
//                        } label: {
//                            VStack {
//                                ForEach(0 ..< 6, id: \.self) { video in
//                                    videoCardView
//                                }
//                            }
//                        }
//                    }
//                    if selectedFilter == .articles {
//                        Text("Journalism")
//                            .font(.headline)
//                            .fontWeight(.semibold)
//                        Button {
//                            print("DEBUG: enter saved articles")
//                        } label: {
//                            journalismCardView
//                        }
//                    }
//                }
//            }
        }
    }
}

//#Preview {
//    ArchiveView()
//}

extension ArchiveView {
    var journalismCardView: some View {
        VStack {
            
            Image("mascot")
                .resizable()
                .aspectRatio(contentMode: .fit)
            HStack {
                VStack(alignment: .leading) {
                    Text("From Journalism Page")
                        .font(.headline)
                        .foregroundColor(.secondary)
                    Text("Saved articles")
                        .font(.title)
                        .fontWeight(.black)
                        .foregroundColor(.primary)
                        .lineLimit(3)
                    Text("View all articles")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .layoutPriority(100)
                Spacer()
            }
            .padding()
            
        }
        .cornerRadius(10)
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(Color(.sRGB,
                              red: 150/255,
                              green: 150/255,
                              blue: 150/255,
                              opacity: 0.2),
                        lineWidth: 1)
            )
    }
    
    var videoCardView: some View {
        VStack {
            Image("mascot")
                .resizable()
                .aspectRatio(contentMode: .fit)
            HStack {
                VStack(alignment: .leading) {
                    Text("From Videos Page")
                        .font(.headline)
                        .foregroundColor(.secondary)
                    Text("Saved videos")
                        .font(.title)
                        .fontWeight(.black)
                        .foregroundColor(.primary)
                        .lineLimit(3)
                    Text("View all videos")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .layoutPriority(100)
                Spacer()
            }
            .padding()
        }
        .cornerRadius(10)
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(Color(.sRGB,
                              red: 150/255,
                              green: 150/255,
                              blue: 150/255,
                              opacity: 0.2),
                        lineWidth: 1)
            )
    }
    
    var filterBar: some View {
        HStack {
            ForEach(JournalismFilterViewModel.allCases, id: \.rawValue) { item in
                VStack {
                    Text(item.title)
                        .font(.subheadline)
                        .fontWeight(selectedFilter == item ? .semibold: .regular)
                        .foregroundColor(selectedFilter == item ? .white: .gray)
                    
                    if selectedFilter == item {
                        Capsule()
                            .foregroundColor(.white)
                            .frame(height: 3)
                            .matchedGeometryEffect(id: "filter", in: animation)
                    } else {
                        Capsule()
                            .foregroundColor(Color(.clear))
                            .frame(height: 3)
                    }
                }
                .onTapGesture {
                    withAnimation(.easeInOut) {
                        self.selectedFilter = item
                    }
                }
            }
        }
        .overlay(Divider().offset(x: 0, y: 16))
    }
}
