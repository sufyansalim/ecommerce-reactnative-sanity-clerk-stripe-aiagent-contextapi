import React from 'react';
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
import Colors from '../constants/Colors';

const SLIDE_DATA = [
  {
      uri: require('../assets/images/home/nike1.png'),
      text: 'NIKE'
  },
  {
      uri: require('../assets/images/home/noomoon1.png'),
      text: 'NOOMOON'
  },
  {
    uri: require('../assets/images/home/nike1.png'),
    text: 'NIK'
},
{
    uri: require('../assets/images/home/noomoon1.png'),
    text: 'MOON'
},
{
  uri: require('../assets/images/home/nike1.png'),
  text: 'NIK'
},
{
  uri: require('../assets/images/home/noomoon1.png'),
  text: 'MOON'
},

];

const DATA = [
  {
      uri: require('../assets/images/home/products/blackwatch.jpg'),
      title: 'Apple Watch Band',
      name:'Green Band',
      price: '130.00 QAR'
  },
  {
    uri: require('../assets/images/home/products/perfume.jpg'),
    title: 'Oud Perfume',
    name:'Aqua de Oud',
    price: '430.00 QAR'
},
{
  uri: require('../assets/images/home/products/whitewatch.jpg'),
  title: 'Overdrive Watch',
  name:'D1 Edition',
  price: '3700.00 QAR'
},
{
  uri: require('../assets/images/home/products/blackwatch.jpg'),
  title: 'Gold BlacK Case',
  name:'iphone X',
  price: '120.00 QAR'
},
];


const Home = ({ navigation }) => {
  return (
          <CustomHeader navigation={navigation}>
            <ScrollView
            showsVerticalScrollIndicator
            contentContainerStyle={{
                flexGrow:1
            }}>
                      <View style={{flex:0.05,alignItems: 'center',justifyContent: 'center',}}>
                          <Grid style={{alignItems: 'center',}}>
                            <Col style={styles.genderTabs}>
                                <TouchableOpacity>
                                    <Text style={styles.textStyle}>Men</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col style={styles.genderTabs}>
                                <TouchableOpacity>
                                    <Text style={styles.textStyle}>Women</Text>
                                </TouchableOpacity>
                            </Col>
                          </Grid>
                      </View>
                      <View style={{flex:0.3,alignItems: 'center',justifyContent: 'center',}}>
                            <Image  resizeMode='stretch' style={{width: '100%',height:200}}
                            source={require('../assets/images/home/banner.png')}/>
                      </View>
                    
                        <View style={{flex:0.05,alignItems: 'center',justifyContent: 'center',}}>
                              <Grid style={{paddingBottom:5,marginBottom:5}}>
                                <Col style={[styles.genderTabs,{alignItems: 'flex-start',paddingLeft:10,marginLeft:10}]}>
                                    <Text style={[styles.textStyle,{fontSize: 20,}]}>Celebrities</Text>
                                </Col>
                                <Col style={[styles.genderTabs,{alignItems:'flex-end',paddingTop:5,paddingRight:10,marginRight:10}]}>
                                    <Text style={[styles.textStyle,{fontSize: 15,}]}>View all</Text>
                                </Col>
                              </Grid>
                        </View>
                              <View style={{flex:0.35,alignItems: 'center',justifyContent: 'center',}}>
                                    <Grid style={styles.celebGrid}>
                                        <Col style={styles.celebImageCol}>
                                              <Image  resizeMode='stretch' style={styles.celebImage}
                                              source={require('../assets/images/home/c1.png')}/>
                                                <Text style={styles.celebName}>AMAL AL AWADHI</Text>
                                        </Col>
                                        <Col style={styles.celebImageCol}>
                                              <Image  resizeMode='stretch' style={styles.celebImage}
                                              source={require('../assets/images/home/f6.png')}/>
                                                <Text style={styles.celebName}>SARA HABIB</Text>
                                        </Col>
                                        <Col style={styles.celebImageCol}>
                                              <Image  resizeMode='stretch' style={styles.celebImage}
                                              source={require('../assets/images/home/c3.png')}/>
                                                <Text style={styles.celebName}>FAHAD AL KUBAISI</Text>
                                        </Col>
                                  </Grid>
                                  <Grid style={styles.celebGrid}>
                                        <Col style={styles.celebImageCol}>
                                              <Image  resizeMode='stretch' style={styles.celebImage}
                                              source={require('../assets/images/home/c4.png')}/>
                                                <Text style={styles.celebName}>AMAL AL AWADHI</Text>
                                        </Col>
                                        <Col style={styles.celebImageCol}>
                                              <Image  resizeMode='stretch' style={styles.celebImage}
                                              source={require('../assets/images/home/f2.png')}/>
                                                <Text style={styles.celebName}>ZEINA ALNAJJAR</Text>
                                        </Col>
                                        <Col style={styles.celebImageCol}>
                                              <Image  resizeMode='stretch' style={styles.celebImage}
                                              source={require('../assets/images/home/c6.png')}/>
                                                <Text style={styles.celebName}>FAHAD AL KUBAISI</Text>
                                        </Col>
                                  </Grid>
                              </View>

                    <View style={{flex:0.05,alignItems: 'flex-start',justifyContent: 'center',}}>                                          
                          <Text style={[styles.textStyle,{fontSize: 20,paddingLeft:10,marginLeft:10}]}>Products</Text>
                   </View>

                  <View style={{flex:0.3,paddingTop:5,marginTop:5,}}>
                          <TwoColProducts navigation={navigation} data={DATA}/>
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
};

export default Home;

Home.navigationOptions = {
  header: null,
};



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
    fontSize: 12,
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

