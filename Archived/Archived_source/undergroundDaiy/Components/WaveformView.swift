//
//  WaveformView.swift
//  undergroundDaiy
//
//  Created by Troy Wu on 2025/1/25.
//

import SwiftUI
import AVFoundation

struct WaveformView: View {
    @Binding var audioPlayer: AVAudioPlayer?
    @State private var waveformPoints: [CGFloat] = []
    @Binding var currentTime: TimeInterval // Bind to the current time of the audio
    @State private var timer: Timer? // Timer to track playback
    @State private var waveformOpacities: [Double] = [] // Track opacity for each point
    
    var body: some View {
        GeometryReader { geometry in
            let width = geometry.size.width
            let waveformWidth = width / CGFloat(waveformPoints.count)
            
            HStack(spacing: 2) {
                ForEach(0..<waveformPoints.count, id: \.self) { i in
                    RoundedRectangle(cornerRadius: 2)
                        .fill(Color.blue)
                        .frame(width: waveformWidth, height: waveformPoints[i])
                        .opacity(waveformOpacities[i]) // Set opacity dynamically
                }
            }
            .onChange(of: currentTime) { _ in
                // Update the waveform's position as audio plays
                updateWaveform()
            }
        }
        .onAppear(perform: loadWaveform)
        .onDisappear(perform: stopTimer)
        .frame(height: 100)
    }
    
    // Function to load the waveform when the view appears
    private func loadWaveform() {
        guard let player = audioPlayer else { return }
        let duration = player.duration
        let sampleRate = player.settings[AVSampleRateKey] as? Double ?? 44100
        let totalSamples = Int(duration * sampleRate)
        let samplesPerPoint = totalSamples / 100 //Simplify to 100 points
        
        //Generate mock waveform points for illustration
        waveformPoints = (0..<100).map { _ in
            CGFloat.random(in: 10...100) // Replace with actual audio sample data processing
        }
        
        // Initialize or reset waveformOpacities to have the same length as waveformPoints
        waveformOpacities = Array(repeating: 1.0, count: waveformPoints.count) // Set initial opacity to 1.0
        
        // Start the timer to update the current time of the audio player
        startTimer()
    }
    
    // Function to start the timer that tracks the audio playback
    private func startTimer() {
        timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { _ in
            guard let player = audioPlayer else { return }
            currentTime = player.currentTime
        }
    }
    
    // Function to stop the timer when the view disappears
    private func stopTimer() {
        timer?.invalidate()
        timer = nil
    }
    
    // Update waveform representation as audio progresses
    private func updateWaveform() {
        guard let player = audioPlayer else { return }
        
        let progress = CGFloat(player.currentTime / player.duration) // Calculate progress
        let activePointCount = Int(progress * CGFloat(waveformPoints.count))
        
        // Create a new array to track the opacity of each waveform point
        var updatedOpacities: [Double] = []
        
        // Update the opacity for each point based on its position in the waveform
        for i in 0..<waveformPoints.count {
            if i < activePointCount {
                // Active points (highlighted): full opacity
                updatedOpacities.append(1.0)
            } else {
                // Inactive points (dimmed): reduced opacity
                updatedOpacities.append(0.3) // Adjust this value to control dimming
            }
        }

        // Now, the `updatedOpacities` array holds the opacity values for each point
        // Use the updated opacity when drawing the waveform
        waveformOpacities = updatedOpacities
    }
}
