import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabBar from '../components/BottomTabBar';
import { RootStackParamList } from '../navigation/AppStack';
import DealDashboard from './DealDashboardOverview';
import HomeDashboard from './homeDashboard';


type Tab = 'Home' | 'Projects';
type DealTab = 'Drafts' | 'Published';

export default function MainApp() {
  const [activeTab, setActiveTab] = useState<Tab>('Home');
  const [projectsTab, setProjectsTab] = useState<DealTab>('Drafts');
  const [showAddModal, setShowAddModal] = useState(false);
  const route = useRoute();
  const params = route.params as { goTo?: 'Drafts' | 'Published' } | undefined;

  React.useEffect(() => {
    if (params?.goTo) {
      setProjectsTab(params.goTo);
      setActiveTab('Projects');
    }
  }, [params]);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const contentOptions = [
    { iconName: 'logo-instagram', iconColor: '#fff', name: 'Instagram Post', subtext: 'Create an Instagram post' },
    { iconName: 'logo-instagram', iconColor: '#fff', name: 'Instagram Reel', subtext: 'Create an Instagram reel' },
    { iconName: 'logo-youtube', iconColor: '#fff', name: 'YouTube Video', subtext: 'Create a YouTube video' },
    { iconName: 'logo-youtube', iconColor: '#fff', name: 'YouTube Short', subtext: 'Create a YouTube short' },
    { iconName: 'logo-tiktok', iconColor: '#fff', name: 'TikTok Video', subtext: 'Create a TikTok video' },
  ];

  const handlePlusOptionPress = (optionName: string) => {
    setShowAddModal(false);
    navigation.navigate('DistributeContent', { type: optionName });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      
      {activeTab === 'Home' ? (
       <HomeDashboard
         onOpenDrafts={() => {
           setProjectsTab('Drafts');
           setActiveTab('Projects');
         }}
         onOpenPublished={() => {
           setProjectsTab('Published');
           setActiveTab('Projects');
         }}
       />
     ) : (
       <DealDashboard
         selectedTab={projectsTab}
         onChangeTab={(tab) => setProjectsTab(tab)}
       />
     )}




      

      <BottomTabBar
        tabs={['Home', 'Projects', 'Plus']}
        activeTab={activeTab}
        onTabPress={(tab) => {
          if (tab === 'Plus') setShowAddModal(true);
          else setActiveTab(tab as Tab);
        }}
        plusIconSize={50}
      />

      <Modal visible={showAddModal} animationType="fade" transparent onRequestClose={() => setShowAddModal(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }} onPress={() => setShowAddModal(false)}>
          <View style={{
            backgroundColor: '#111', paddingVertical: 25, paddingHorizontal: 20,
            borderTopLeftRadius: 24, borderTopRightRadius: 24, borderColor: '#333', borderWidth: 1
          }}>
            {contentOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}
                onPress={() => handlePlusOptionPress(option.name)}
              >
                <Ionicons name={option.iconName as any} size={32} color={option.iconColor} style={{ marginRight: 16 }}/>

                <View>
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>{option.name}</Text>
                  <Text style={{ color: '#aaa', fontSize: 14, marginTop: 2 }}>{option.subtext}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
