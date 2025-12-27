// import { View, Text, Image, TouchableOpacity } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// interface NewsItem {
//   _id: string;
//   channelProfilePic: string;
//   channelUsername: string;
//   publishedAt: string;
//   content?: string;
//   mediaUrl?: string;
// }

// type Props = {
//   item: NewsItem;
//   isExpanded: boolean;
//   isLiked: boolean;
//   isBookmarked: boolean;
//   onToggleExpanded: () => void;
//   onToggleLike: () => void;
//   onToggleBookmark: () => void;
// };

// export const NewsItemCard = ({
//   item,
//   isExpanded,
//   isLiked,
//   isBookmarked,
//   onToggleExpanded,
//   onToggleLike,
//   onToggleBookmark,
// }: Props) => {
//   return (
//     <View className="bg-white border-b border-gray-200 pb-4 mb-2">
//       {/* Header */}
//       <View className="flex-row items-center justify-between px-4 pt-4 mb-3">
//         <View className="flex-row items-center flex-1">
//           <Image
//             source={{ uri: item.channelProfilePic }}
//             style={{
//               width: 44,
//               height: 44,
//               borderRadius: 22,
//               borderWidth: 2,
//               borderColor: "#F3F4F6",
//             }}
//           />
//           <View className="ml-3 flex-1">
//             <Text className="text-base font-bold text-gray-900">
//               {item.channelUsername}
//             </Text>
//             <Text className="text-[13px] text-gray-500">
//               {new Date(item.publishedAt).toLocaleDateString()}
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* Content */}
//       {item.content && (
//         <View className="px-4 mb-3">
//           <Text numberOfLines={isExpanded ? undefined : 3}>{item.content}</Text>

//           {item.content.length > 100 && (
//             <TouchableOpacity onPress={onToggleExpanded}>
//               <Text className="text-blue-600 mt-1">
//                 {isExpanded ? "Show less" : "Read more"}
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       )}

//       {/* Media */}
//       {item.mediaUrl && (
//         <Image
//           source={{ uri: item.mediaUrl }}
//           style={{ width: "100%", height: 256 }}
//         />
//       )}

//       {/* Actions */}
//       <View className="flex-row justify-between px-6 pt-2">
//         <TouchableOpacity onPress={onToggleLike}>
//           <Ionicons
//             name={isLiked ? "heart" : "heart-outline"}
//             size={24}
//             color={isLiked ? "red" : "gray"}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity>
//           <Ionicons name="chatbubble-outline" size={24} color="gray" />
//         </TouchableOpacity>

//         <TouchableOpacity>
//           <Ionicons name="share-social-outline" size={24} color="gray" />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={onToggleBookmark}>
//           <Ionicons
//             name={isBookmarked ? "bookmark" : "bookmark-outline"}
//             size={24}
//             color={isBookmarked ? "blue" : "gray"}
//           />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };
