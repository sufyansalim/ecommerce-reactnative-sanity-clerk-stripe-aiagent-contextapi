import React,{useState,useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  Image,
  ImageBackground
} from 'react-native';

import LoadingScreen from '../../../components/LoadingScreen';
import TwoColProducts from '../../../components/sliders/TwoColSlide.js';
import CustomHeader from '../../../components/header/CustomHeader.js';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useAppState, useAppDispatch, setTvProducts } from '../../../context';
import Colors from '../../../constants/Colors';

const TVProducts=({ navigation, route })=> {
  const [paused, togglePaused] = useState(true);
  const {width} = Dimensions.get('window');
  const products = route?.params?.products || [];
  const videoUrl = route?.params?.videoUrl;

  const { tvProducts, productsLoading: loading } = useAppState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("TV Products from params:", products);
    // Pass the products array directly (already fetched with TV show data)
    setTvProducts(dispatch, products);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Toggle = () => { togglePaused(!paused); };
  return (
    <CustomHeader navigation={navigation}>
      { loading ?
          <LoadingScreen message="Loading TV products..." />  
        : 
         <ScrollView
         showsVerticalScrollIndicator
         contentContainerStyle={{flexGrow:1}}>
            {videoUrl && (
              <WebView 
                source={{ uri: videoUrl }} 
                style={{marginHorizontal : 0, width:'100%',height:200,flex:0.5,alignItems:'center'}}
              />
            )}
              <View style={{flex:0.3,alignItems: 'flex-start',justifyContent: 'center',}}>                                          
                    {/* <View style={styles.fabContainer}>
                      <TouchableOpacity onPress={Toggle} style={styles.fab}>
                        <Ionicons
                          name={paused ? 'md-play' : 'md-pause'}
                          size={30}
                          color="white"
                        />
                      </TouchableOpacity>
                    </View> */}
              </View>

              <View style={{flex:0.5,paddingTop:5,marginTop:5,}}>
                  <TwoColProducts navigation={navigation} data={tvProducts}/>
              </View>
              </ScrollView>
        }          
    </CustomHeader>
  );
}

TVProducts.navigationOptions = {
  header: null,
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
    color: Colors.textWhite,
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
