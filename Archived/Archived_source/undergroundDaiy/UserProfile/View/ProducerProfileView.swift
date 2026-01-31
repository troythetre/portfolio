import SwiftUI
import Kingfisher

struct ProducerProfileView: View {
    @State private var selectedFilter: FilterViewModel = .archive
    @ObservedObject var viewModel: ProfileViewModel
    @Environment(\.dismiss) var dismiss
    @Namespace var animation

    @State private var showEditProfile = false

    init(user: AppUser) {
        self.viewModel = ProfileViewModel(user: user)
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) { // Use VStack with no spacing for seamless stacking
                ZStack(alignment: .center) { // Background and profile header
                    KFImage(URL(string: viewModel.user.profileImageUrl))
                        .resizable()
                        .scaledToFill()
                        .opacity(0.35)
                        .frame(height: 300) // Adjust height for better layout
                    
                    VStack(alignment: .leading) {
                        HStack {
                            KFImage(URL(string: viewModel.user.profileImageUrl))
                                .resizable()
                                .scaledToFill()
                                .clipShape(Circle())
                                .frame(width: 100, height: 100)
                            
                            VStack(alignment: .leading, spacing: 4) {
                                Text("@\(viewModel.user.username)")
                                    .font(.title2)
                                    .fontWeight(.bold)
                                    .foregroundColor(.blue)
                                
                                Text(viewModel.user.tag)
                                    .font(.subheadline)
                                    .foregroundColor(.gray)
                                    .padding(4)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 8)
                                            .stroke(Color.blue, lineWidth: 1.5)
                                    )
                                
                                HStack {
                                    Image(systemName: "mappin.and.ellipse")
                                    Text("Los Angeles, CA")
                                        .font(.footnote)
                                        .foregroundColor(.gray)
                                }
                            }
                            .padding(.leading, 8)
                        }
                        
                        Text("Insert bio here: biggest carti glazer.... sike")
                            .font(.body)
                            .padding(.vertical, 4)
                        
                        HStack(spacing: 16) {
                            HStack {
                                Image(systemName: "person.3.fill")
                                Text("1,482 followers")
                            }
                            
                            HStack {
                                Image(systemName: "tag.fill")
                                Text("113 sold")
                            }
                        }
                        .font(.footnote)
                        .padding(.vertical, 8)
                        
                        HStack(spacing: 16) {
                            Button(action: {
                                // Follow action
                            }) {
                                Text("FOLLOW")
                                    .font(.subheadline)
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 8)
                                    .background(Color.cyan)
                                    .foregroundColor(.white)
                                    .clipShape(RoundedRectangle(cornerRadius: 5))
                            }
                            
                            Button(action: {
                                // Message action
                            }) {
                                Text("MESSAGE")
                                    .font(.subheadline)
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 8)
                                    .background(Color.white)
                                    .foregroundColor(.black)
                                    .clipShape(RoundedRectangle(cornerRadius: 5))
                            }
                            
                            Image(systemName: "music.note.house.fill")
                                .foregroundColor(.red)
                            
                            Image(systemName: "ellipsis")
                        }
                        .padding(.vertical, 8)
                    }
                    .padding(.top, 40)
                    .padding(.horizontal)
                }
                .frame(height: 300) // Match the background height for a cohesive layout

                filterBar
                
                Spacer() // Pushes remaining content (if any) to the bottom
            }
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

extension ProducerProfileView {
    var filterBar: some View {
        HStack(spacing: 16) {
            ForEach(FilterViewModel.allCases, id: \.rawValue) { item in
                VStack {
                    Text(item.title)
                        .font(.subheadline)
                        .fontWeight(selectedFilter == item ? .semibold : .regular)
                        .foregroundColor(selectedFilter == item ? .white : .gray)
                    
                    if selectedFilter == item {
                        Capsule()
                            .foregroundColor(.white)
                            .frame(height: 3)
                            .matchedGeometryEffect(id: "filter", in: animation)
                    } else {
                        Capsule()
                            .foregroundColor(.clear)
                            .frame(height: 3)
                    }
                }
                .onTapGesture {
                    withAnimation(.easeInOut) {
                        selectedFilter = item
                    }
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .center)
        .padding(.horizontal, 32)
        .padding(.vertical, 8)
        .background(Color.black) // Optional: Customize background for filter bar
        .overlay(Divider(), alignment: .bottom)
    }
}
