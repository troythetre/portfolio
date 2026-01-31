import SwiftUI

struct MarqueeText: View {
    var text: String
    var uniqueID: String
    var textColor: Color // Add color parameter
    @State private var animate = false

    var body: some View {
        GeometryReader { geometry in
            let textWidth = textSize(text: text, font: UIFont.systemFont(ofSize: 14)).width
            let containerWidth = geometry.size.width

            ZStack {
                if textWidth > containerWidth { // Animate only if text is wider
                    Text(text)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(textColor) // Apply custom color
                        .lineLimit(1)
                        .fixedSize(horizontal: true, vertical: false)
                        .offset(x: animate ? -textWidth - 20 : 0)
                        .animation(
                            Animation.linear(duration: 4)
                                .repeatForever(autoreverses: false),
                            value: animate
                        )
                        .onAppear {
                            DispatchQueue.main.asyncAfter(deadline: .now() + Double(Int.random(in: 0...2))) {
                                animate = true
                            }
                        }
                } else { // If text fits, display normally
                    Text(text)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(textColor) // Apply custom color
                        .lineLimit(1)
                        .fixedSize(horizontal: true, vertical: false)
                }
            }
            .frame(width: containerWidth, height: geometry.size.height, alignment: .leading)
            .clipped()
        }
        .frame(height: 20)
    }

    func textSize(text: String, font: UIFont) -> CGSize {
        let attributes = [NSAttributedString.Key.font: font]
        return text.size(withAttributes: attributes)
    }
}
