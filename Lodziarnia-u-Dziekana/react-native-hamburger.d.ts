declare module 'react-native-hamburger' {
  import * as React from 'react';
  import { ViewProps } from 'react-native';
 


  export interface HamburgerProps extends ViewProps {
    active?: boolean;
    type?: 'spinCross' | 'spinArrow' | 'squeeze' | 'arrowTurn' | 'arrow' | 'cross';
    color?: string;
    onPress?: () => void;
    underlayColor?: string;
    size?: number;
    animationDuration?: number;
    useNativeDriver?: true;
  }
  

  export default class Hamburger extends React.Component<HamburgerProps> {}
}

