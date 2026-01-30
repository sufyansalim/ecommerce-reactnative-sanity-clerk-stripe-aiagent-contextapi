import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
} from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';

import LoadingScreen from '../../../components/LoadingScreen';
import TwoColProducts from '../../../components/sliders/TwoColSlide';
import CustomHeader from '../../../components/header/CustomHeader';
import { WebView } from 'react-native-webview';
import Colors from '../../../constants/Colors';
import { Product } from '../../../types';
import { HomeStackParamList } from '../../../types/navigation';

interface TVProductsProps {
  navigation?: NavigationProp<any>;
  route?: RouteProp<{ Products: { products: Product[]; videoUrl: string; name: string } }, 'Products'>;
}

const TVProducts: React.FC<TVProductsProps> = ({ navigation, route }) => {
  const [paused, togglePaused] = useState<boolean>(true);
  const { width } = Dimensions.get('window');
  const products = route?.params?.products || [];
  const videoUrl = route?.params?.videoUrl;

  const [tvProducts, setTvProducts] = useState<Product[]>(products);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setTvProducts(products);
  }, []);

  const Toggle = (): void => { togglePaused(!paused); };

  return (
    <CustomHeader navigation={navigation}>
      {loading ? (
        <LoadingScreen message="Loading TV products..." />  
      ) : (
        <ScrollView
          showsVerticalScrollIndicator
          contentContainerStyle={{flexGrow:1}}
        >
          {videoUrl && (
            <WebView 
              source={{ uri: videoUrl }} 
              style={{marginHorizontal: 0, width:'100%', height:200, flex:0.5, alignItems:'center'}}
            />
          )}
          <View style={{flex:0.3, alignItems: 'flex-start', justifyContent: 'center',}}>                                          
            {/* Play/Pause button - currently commented out */}
          </View>

          <View style={{flex:0.5, paddingTop:5, marginTop:5,}}>
            <TwoColProducts navigation={navigation} data={tvProducts}/>
          </View>
        </ScrollView>
      )}          
    </CustomHeader>
  );
};

export default TVProducts;

const styles = StyleSheet.create({
  textStyle: {
    fontSize:12,
    fontWeight: "bold",
    fontFamily:"Roboto",
    paddingLeft:5
  },
  fab: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon:{
    fontSize:18,
    color: Colors.primary,
    paddingRight:5
  },
  rowStyle:{
    alignItems:'stretch'
  }
});
