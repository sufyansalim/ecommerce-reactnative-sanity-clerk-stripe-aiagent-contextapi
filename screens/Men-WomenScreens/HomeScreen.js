import React,{useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

import { Col,Grid,} from 'react-native-easy-grid';
import Slides from '../../components/sliders/Slides';
import CustomHeader from '../../components/header/CustomHeader.js'
import TwoColProducts from '../../components/sliders/TwoColSlide';
import { useNavigation } from '@react-navigation/native'
import Colors from '../../constants/Colors';
import { mockProducts, mockBrands, mockCelebrities } from '../../store/mockData';

// Get first 6 brands for the slider (all Unsplash URLs)
const SLIDE_DATA = mockBrands.slice(0, 6).map(brand => ({
  uri: brand.uri,
  text: brand.name
}));

// Get first 4 products for home display (Unsplash URLs)
const DATA = mockProducts.slice(0, 4).map((product) => ({
  ...product,
  uri: product.productImage, // Use productImage URL for home grid
  name: product.description?.substring(0, 20) || product.category,
}));

// Get first 6 celebrities for home display
const homeCelebrities = mockCelebrities.slice(0, 6);


const MenScreen=props=>{
  const navigation = useNavigation();
  const { navigate } = navigation;
  const [toggle, setToggle] = useState(false);
  return (
          <CustomHeader navigation={navigation}>
            <ScrollView
            showsVerticalScrollIndicator
            contentContainerStyle={{
                flexGrow:1
            }}>
                      {/* <View style={{flex:0.05,alignItems: 'center',justifyContent: 'center', marginBottom: 10, marginTop: 10}}>
                          <Grid style={{alignItems: 'center',}}>
                            <Col style={styles.genderTabs}>
                                <TouchableOpacity>
                                  { !toggle ? <Text style={[styles.textStyle,{color: Colors.accent}]}>Men</Text> : <Text style={styles.textStyle}>Men</Text>}
                                </TouchableOpacity>
                            </Col>
                            <Col style={styles.genderTabs}>
                                <TouchableOpacity onPress ={() => {navigate('Home2') }}>
                                { !toggle ? <Text style={[styles.textStyle,{fontWeight: "normal"}]}>Women</Text> : <Text style={styles.textStyle}>Women</Text>}
                                </TouchableOpacity>
                            </Col>
                          </Grid>
                      </View> */}
                      <View style={{flex:0.3,alignItems: 'center',justifyContent: 'center',}}>
                            <Image  resizeMode='cover' style={{width: '100%',height:200}}
                            source={require('../../assets/images/home/bannerm.png')}/>
                      </View>
                        <View style={{flex:0.05,alignItems: 'center',justifyContent: 'center', marginBottom: 5, marginTop:5}}>
                              <Grid >
                                <Col style={[styles.genderTabs,{alignItems: 'flex-start',paddingLeft:10,marginLeft:10}]}>
                                    <Text style={[styles.textStyle,{fontSize: 20,}]}>Celebrities</Text>
                                </Col>
                                <Col style={[styles.genderTabs,{alignItems:'flex-end',paddingTop:5,paddingRight:10,marginRight:10}]}>
                                  <TouchableOpacity onPress ={() => {navigate('CelebritiesStack') }}>
                                    <Text style={[styles.textStyle,{fontSize: 15,}]}>View all</Text>
                                  </TouchableOpacity>
                                </Col>
                              </Grid>
                        </View>
                              <View style={{flex:0.35,alignItems: 'center',justifyContent: 'center', marginLeft: '4.5%', marginRight: '4.5%'}}>
                                    <Grid style={styles.celebGrid}>
                                        {homeCelebrities.slice(0, 3).map((celeb, index) => (
                                          <Col key={celeb.id} style={styles.celebImageCol}>
                                            <TouchableOpacity onPress={() => navigate('CelebrityProduct', { 
                                              banner: celeb.banner, 
                                              products: celeb.products, 
                                              ids: celeb.ids 
                                            })}>
                                              <Image resizeMode='stretch' style={styles.celebImage}
                                                source={{ uri: celeb.uri }}/>
                                              <Text style={styles.celebName}>{celeb.name.toUpperCase()}</Text>
                                            </TouchableOpacity>
                                          </Col>
                                        ))}
                                  </Grid>
                                  <Grid style={styles.celebGrid}>
                                        {homeCelebrities.slice(3, 6).map((celeb, index) => (
                                          <Col key={celeb.id} style={styles.celebImageCol}>
                                            <TouchableOpacity onPress={() => navigate('CelebrityProduct', { 
                                              banner: celeb.banner, 
                                              products: celeb.products, 
                                              ids: celeb.ids 
                                            })}>
                                              <Image resizeMode='stretch' style={styles.celebImage}
                                                source={{ uri: celeb.uri }}/>
                                              <Text style={styles.celebName}>{celeb.name.toUpperCase()}</Text>
                                            </TouchableOpacity>
                                          </Col>
                                        ))}
                                  </Grid>
                              </View>

                    <View style={{flex:0.05,alignItems: 'flex-start',justifyContent: 'center',}}>                                          
                          <Text style={[styles.textStyle,{fontSize: 20,paddingLeft:10,marginLeft:10}]}>Products</Text>
                   </View>

                  <View style={{flex:0.3,paddingTop:5,marginTop:5,}}>
                          <TwoColProducts navigation={navigation} data={DATA} home={'home'}/>
                  </View>
                         
                          <View style={{
                                flex:0.2,
                                alignItems: 'flex-start',
                                paddingLeft: 10,
                                marginLeft: 10,
                                justifyContent: 'center',
                                paddingTop:5,
                                marginTop:5
                    
                                }}>        
                                    <Slides data={SLIDE_DATA}/>
                          </View>
              </ScrollView>   
        </CustomHeader>
  );
}


MenScreen.navigationOptions = {
  header: null,
};

export default MenScreen;


const styles = StyleSheet.create({
  textStyle: {
    color: Colors.primary,
    fontWeight:'bold',
    fontSize:20
  },
  genderTabs:{
    height: 25,
    alignItems: 'center',
  },
  celebImageCol:{
    alignItems: 'center',
    paddingLeft:5,
    marginLeft:5,
    paddingRight:5,
    marginRight:5
  },
  celebImage: {
    width: 100,
    height: 100
  },
  celebName:{
    fontSize: 10,
    paddingTop:5,
    fontWeight:'bold',
  },
  celebGrid: {
    marginBottom: 10
  },
  brandsImage: {
    padding:5,
    margin:5,
    alignItems: 'center'
  }

});

