import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ConfirmContent from '../screens/ConfirmContent';
import ConfirmUploadDetails from '../screens/confirmUploadDetails';
import DistributeContent from '../screens/DistributeContent';
import Drafts from '../screens/Drafts';
import EditCaption from '../screens/EditCaption';
import EditInstagramMedia from '../screens/EditInstagramMedia';
import EditThumbnail from '../screens/EditThumbnail';
import EditTitleDescription from '../screens/EditTitleDescription';
import EditVideo from '../screens/EditVideo';
import MainApp from '../screens/MainApp';
import ModuleSelectorScreen from '../screens/ModuleSelectorScreen';
import postSubmitted from '../screens/postSubmitted';
import Published from '../screens/Published';
import StreamActivity from '../screens/StreamActivity';

export type RootStackParamList = {
  MainApp: { goTo?: 'Drafts' | 'Published' } | undefined;
  DistributeContent: { type: string; projectName?: string };
  StreamActivity: undefined;
  Drafts: undefined;
  Published: undefined;
  ConfirmContent: undefined;
  ConfirmUploadDetails: undefined;
  postSubmitted: undefined;
  EditTitleDescription: undefined;
  EditVideo: undefined;
  EditThumbnail: undefined;
  EditCaption: undefined;
  EditInstagramMedia: undefined;
  ModuleSelectorScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainApp" component={MainApp} />
      <Stack.Screen name="DistributeContent" component={DistributeContent} />
      <Stack.Screen name="StreamActivity" component={StreamActivity} />
      <Stack.Screen name='Drafts' component={Drafts}/>
      <Stack.Screen name='Published' component={Published}/>
      <Stack.Screen name="ConfirmContent" component={ConfirmContent} />
      <Stack.Screen name="ConfirmUploadDetails" component={ConfirmUploadDetails} />
      <Stack.Screen name="postSubmitted" component={postSubmitted} />
      <Stack.Screen name="EditTitleDescription" component={EditTitleDescription}/>
      <Stack.Screen name="EditCaption" component={EditCaption}/>
      <Stack.Screen name="EditVideo" component={EditVideo}/>
      <Stack.Screen name="EditThumbnail" component={EditThumbnail}/>
      <Stack.Screen name='EditInstagramMedia' component={EditInstagramMedia}/>
      <Stack.Screen name="ModuleSelectorScreen" component={ModuleSelectorScreen}/>

    </Stack.Navigator>
  );
}
