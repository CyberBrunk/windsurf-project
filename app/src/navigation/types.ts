import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Tabs: undefined;
  Onboarding: undefined;
  UserDataCollection: undefined;
  SunCardGeneration: undefined;
  FriendDetail: { friendId: string };
};

export type TabParamList = {
  Today: undefined;
  Connections: undefined;
  Reflections: undefined;
  PlanetaryPath: undefined;
  Chat: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
