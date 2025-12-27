import { NewsItemCard } from "@/components/NewsItemCard";
import { useUserSync } from "@/hooks/useUserSync";
import { NewsItem } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useFetchNews } from "@/hooks/useNews";
import { FlatList, ListRenderItem, TextInput, View } from "react-native";

export default function NewsList() {
  useUserSync();
  const { news } = useFetchNews();
  const renderItem: ListRenderItem<NewsItem> = ({ item }) => {
    return <NewsItemCard item={item} />;
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Search Bar */}
      <View className="px-4 py-3 mx-3 border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-full border border-black px-4 ">
          <Feather name="search" size={20} color="#657786" />
          <TextInput
            placeholder="Search News"
            className="flex-1 ml-2 text-base"
            placeholderTextColor="#657786"
          />
        </View>
      </View>

      {/* News List */}
      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-24"
        // onRefresh={() => fetchNews(1, true)}
        // refreshing={refreshing}
        // onEndReached={() => {
        //   if (hasMore && !loading) {
        //     fetchNews(page + 1);
        //   }
        // }}
        // onEndReachedThreshold={0.5}
        // ListFooterComponent={
        //   loading && !refreshing ? (
        //     <View className="py-4">
        //       <ActivityIndicator size="small" color="#3B82F6" />
        //     </View>
        //   ) : null
        // }
      />
    </View>
  );
}

//  const toggleExpanded = (id: string) => {
//     setExpandedItems((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(id)) {
//         newSet.delete(id);
//       } else {
//         newSet.add(id);
//       }
//       return newSet;
//     });
//   };
