import InstagramLogo from '@/assets/logo/instagram_logo.png';
import TikTokLogo from '@/assets/logo/tiktok_logo.png';
import YouTubeLogo from '@/assets/logo/youtube_logo.png';
import Header from '@/src/components/Header';
import PrimaryButton from '@/src/components/PrimaryButton';

import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import PhylloConnect from 'react-native-phyllo-connect';

// Platform logos
const platformLogos: Record<string, any> = {
  instagram: InstagramLogo,
  youtube: YouTubeLogo,
  tiktok: TikTokLogo,
};

const supportedPlatforms = ['instagram', 'youtube', 'tiktok'] as const;

const platform_Ids: Record<string, string> = {
  instagram: '9bb8913b-ddd9-430b-a66a-d74d846e6c66',
  youtube: '14d9ddf5-51c6-415e-bde6-f8ed36ad7054',
  tiktok: 'de55aeec-0dc8-4119-bf90-16b3d1f0c987',
};

const platformIdToName: Record<string, keyof typeof platform_Ids> = Object.fromEntries(
  Object.entries(platform_Ids).map(([name, id]) => [id, name])
);

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

// Fetch SDK Token
async function fetchSdkToken(externalId: string): Promise<string> {
  const url =
    'https://i7ww5qgoa1.execute-api.us-east-1.amazonaws.com/Prod/cc-analytics/create-sdk-token';

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ external_id: externalId }),
  });

  if (!res.ok) throw new Error(`Failed to fetch SDK token: ${res.status}`);

  const json = await res.json();
  return json.sdk_token || json.token;
}

// Typed route params
type ScreenParams = {
  ConnectAccounts: {
    userId: string;
    username: string;
  };
};

export default function ConnectAccounts() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ScreenParams, 'ConnectAccounts'>>();

  const userId = route.params?.userId ?? '';
  const username = route.params?.username ?? '';

  const [connectedPlatforms, setConnectedPlatforms] = useState({
    instagram: false,
    youtube: false,
    tiktok: false,
  });

  const [connectingPlatforms, setConnectingPlatforms] = useState({
    instagram: false,
    youtube: false,
    tiktok: false,
  });

  const [error, setError] = useState<string | null>(null);

  const attachSdkListeners = (sdkInstance: any, platform: keyof typeof platform_Ids) => {
    sdkInstance.on('accountConnected', (_acc, _u, platformId) => {
      const platformName = platformIdToName[platformId] || platform;
      setConnectedPlatforms(prev => ({ ...prev, [platformName]: true }));
      setConnectingPlatforms(prev => ({ ...prev, [platformName]: false }));
    });

    sdkInstance.on('accountDisconnected', (_acc, _u, platformId) => {
      const platformName = platformIdToName[platformId] || platform;
      setConnectedPlatforms(prev => ({ ...prev, [platformName]: false }));
    });

    sdkInstance.on('connectionFailure', (_acc, _u, platformId, reason) => {
      const platformName = platformIdToName[platformId] || platform;
      setError(`Connection failed for ${platformName}: ${reason}`);
      setConnectingPlatforms(prev => ({ ...prev, [platformName]: false }));
    });

    sdkInstance.on('exit', (platformId: string) => {
      const platformName = platformIdToName[platformId] || platform;
      setConnectingPlatforms(prev => ({ ...prev, [platformName]: false }));
    });
  };

  const handleConnect = async (platform: keyof typeof platform_Ids) => {
    try {
      setError(null);
      setConnectingPlatforms(p => ({ ...p, [platform]: true }));

      const sdkToken = await fetchSdkToken(username);

      const instance = await PhylloConnect.initialize({
        clientDisplayName: 'Splitz',
        environment: 'staging',
        token: sdkToken,
        userId,
        workPlatformId: platform_Ids[platform],
        debug: true,
      });

      attachSdkListeners(instance, platform);

      instance.on('tokenExpired', async () => {
        try {
          const newToken = await fetchSdkToken(username);
          const refreshedInstance = await PhylloConnect.initialize({
            clientDisplayName: 'Splitz',
            environment: 'staging',
            token: newToken,
            userId,
            workPlatformId: platform_Ids[platform],
            singlePlatform: true,
            flow: 'connectAccount',
            debug: true,
          });

          attachSdkListeners(refreshedInstance, platform);
          refreshedInstance.open();
        } catch (err) {
          setError('Failed to refresh SDK token. Try again.');
        }
      });

      await instance.open();
    } catch (err) {
      setError(`Failed to connect ${platform}`);
      setConnectingPlatforms(p => ({ ...p, [platform]: false }));
    }
  };

  const handleDone = () => {
    navigation.replace('MainApp', { userId });
  };

  const atLeastOneConnected = Object.values(connectedPlatforms).some(v => v);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Connect Accounts" notificationCount={3} />
      <View style={styles.container}>
        <Text style={styles.heading}>Choose Services</Text>

        <View style={styles.platformList}>
          {supportedPlatforms.map(platform => {
            const connected = connectedPlatforms[platform];
            const connecting = connectingPlatforms[platform];

            return (
              <TouchableOpacity
                key={platform}
                style={styles.platformItem}
                onPress={() => handleConnect(platform)}
              >
                <View style={styles.logoContainer}>
                  <Image
                    source={platformLogos[platform]}
                    style={[
                      styles.platformLogo,
                      platform === 'tiktok' && { width: 45, height: 45 },
                    ]}
                    resizeMode="contain"
                  />
                </View>

                <Text style={styles.platformName}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Text>

                <Text style={[styles.checkmark, connected && styles.checkmarkActive]}>
                  {connecting ? '…' : connected ? '✓' : '○'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.bottomButton}>
          <PrimaryButton
            title="Continue"
            onPress={handleDone}
            style={[
              styles.ctaButton,
              atLeastOneConnected ? styles.ctaEnabled : styles.ctaDisabled,
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 40 },
  heading: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 12, marginTop: 20 },
  logoContainer: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  platformList: { flexDirection: 'column', gap: 12, marginTop: 8 },
  platformItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  platformLogo: { width: 30, height: 30, marginRight: 12 },
  platformName: { flex: 1, fontSize: 16, fontWeight: '600', color: '#ddd' },
  checkmark: { fontSize: 26, color: '#555' },
  checkmarkActive: { color: 'purple' },
  errorText: { color: '#ff6b6b', fontSize: 13, marginTop: 12 },
  ctaButton: { marginVertical: 20, height: 50, justifyContent: 'center' },
  ctaEnabled: { backgroundColor: '#007AFF' },
  ctaDisabled: { backgroundColor: '#555' },
  bottomButton: { marginTop: 'auto', marginBottom: 20 },
});
