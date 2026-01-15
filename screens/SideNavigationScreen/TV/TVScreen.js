import React, { useEffect, useState, Fragment, useCallback, useMemo } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  Text,
  Modal
} from 'react-native';

import LoadingScreen from '../../../components/LoadingScreen';
import EmptyListView from '../../../components/EmptyListView';
import CustomHeader from '../../../components/header/CustomHeader.js';
import { Col, Grid, Row } from "react-native-easy-grid";
import { AntDesign,MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAppState, useAppDispatch, fetchTvShows } from '../../../context';
import Colors from '../../../constants/Colors';

const SORT_OPTIONS = [
  { id: 'default', label: 'Default' },
  { id: 'name-asc', label: 'Name: A to Z' },
  { id: 'name-desc', label: 'Name: Z to A' },
  { id: 'products-high', label: 'Most Products' },
  { id: 'products-low', label: 'Least Products' },
];

const TVScreen = ({ navigation }) => {
  const { navigate, goBack } = useNavigation();
  const { tvShows: TvProducts, tvShowsLoading: loading } = useAppState();
  const dispatch = useAppDispatch();
  
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('default');

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        goBack();
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [goBack])
  );

  useEffect(() => {
    fetchTvShows(dispatch);
  }, [dispatch]);

  // Apply sorting
  const sortedTvShows = useMemo(() => {
    if (!TvProducts || !Array.isArray(TvProducts)) return [];
    
    let result = [...TvProducts];
    
    switch (selectedSort) {
      case 'name-asc':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'name-desc':
        result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;
      case 'products-high':
        result.sort((a, b) => (b.products?.length || 0) - (a.products?.length || 0));
        break;
      case 'products-low':
        result.sort((a, b) => (a.products?.length || 0) - (b.products?.length || 0));
        break;
      default:
        break;
    }
    
    return result;
  }, [TvProducts, selectedSort]);

  const handleSortSelect = (sortId) => {
    setSelectedSort(sortId);
    setSortModalVisible(false);
  };

  const clearFilters = () => {
    setSelectedSort('default');
  };

   const renderItems=(data)=>{
      
       return data.map((item,index)=>(
        <View key={item.id}  style={styles.slideStyle}>
            <TouchableOpacity style={{flex:0.3}} 
            onPress={() => {navigate('Products',{videoUrl: item.videoUrl || item.video, products: item.products || [], name: item.name})}}>
                  <ImageBackground source={{uri: item.uri}}
                  resizeMode='cover' 
                  style={{height:200,width:'100%',alignItems:'center',justifyContent: 'center',}}>
                        <Image source={require('../../../assets/images/play.png')}
                        resizeMode='cover' 
                        style={{height:100,width:100,}}/>
                  </ImageBackground>
            </TouchableOpacity>
            <View style={{flex:0.2,paddingTop:5,marginTop:5,justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
                <Text 
                style={{
                    fontSize:15,
                    fontWeight:'bold',
                    fontFamily: "Roboto",
                    paddingLeft:5,
                    marginLeft:5,
                    paddingBottom:10,
                    marginBottom:10,
                    flex:1,
                }}>
                        {item.name}
                </Text>
                <Text style={{fontSize:12,color:Colors.textGray,paddingRight:10}}>
                    {item.products?.length || 0} products
                </Text>
            </View>      
        </View>
        ));
    }
  return (
    <CustomHeader navigation={navigation}>
         <ScrollView
         showsVerticalScrollIndicator
         contentContainerStyle={{flexGrow:1}}>      
              <View style={{flex:0.1,alignItems: 'flex-start',justifyContent: 'center',paddingLeft: 10,marginLeft: 10,}}>                                          
                    <Text style={styles.textStyle}>TV</Text>
              </View>
          {loading ? <LoadingScreen message="Loading TV shows..." /> :
          sortedTvShows && sortedTvShows.length > 0 ? (
          <Fragment>
              <View style={{flex:0.2,alignItems: 'center',justifyContent: 'center',paddingBottom:5,marginBottom:5}}>
                  <Grid style={{paddingTop:5,marginTop:5,}}>
                  <Col style={{alignItems: 'center',paddingLeft:10,marginLeft:10}}>
                      <TouchableOpacity onPress={() => setSortModalVisible(true)}>
                        <Row style={styles.rowStyle}>
                          <MaterialIcons name='sort' style={styles.icon}/>
                          <Text style={styles.iconText}>Sort</Text>
                          {selectedSort !== 'default' && <View style={styles.activeDot} />}
                        </Row>
                      </TouchableOpacity>
                    </Col>
                    <Col style={{alignItems: 'center',paddingRight:10,marginRight:10}}>
                      {selectedSort !== 'default' && (
                        <TouchableOpacity onPress={clearFilters}>
                          <Row style={styles.rowStyle}>
                            <AntDesign name='close' style={styles.icon}/>
                            <Text style={styles.iconText}>Clear</Text>
                          </Row>
                        </TouchableOpacity>
                      )}
                    </Col>   
                  </Grid>
              </View>
                  {renderItems(sortedTvShows)}
            </Fragment>
          ) : (
            <EmptyListView 
              icon="tv-outline" 
              title="No TV shows available" 
              message="Check back later for new shows"
              showActions={false}
            />
          )
          }
      </ScrollView>
      
      {/* Sort Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sortModalVisible}
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <TouchableOpacity onPress={() => setSortModalVisible(false)}>
                <AntDesign name="close" size={24} color={Colors.iconDefault} />
              </TouchableOpacity>
            </View>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.modalOption, selectedSort === option.id && styles.modalOptionSelected]}
                onPress={() => handleSortSelect(option.id)}
              >
                <Text style={[styles.modalOptionText, selectedSort === option.id && styles.modalOptionTextSelected]}>
                  {option.label}
                </Text>
                {selectedSort === option.id && <AntDesign name="check" size={20} color={Colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </CustomHeader>
  );
}

TVScreen.navigationOptions = {
  header: null,
};

export default TVScreen;

const styles = StyleSheet.create({
  textStyle: {
    fontSize:20,
    fontWeight: "bold",
    fontFamily:"Roboto",
  },
  iconText: {
    fontSize:12,
    fontWeight: "bold",
    fontFamily:"Roboto",
    paddingLeft:5
  },
  icon:{
    fontSize:18,
    color: Colors.primary,
    paddingRight:5 
  },
  rowStyle:{
    alignItems:'center'
  },
  slideStyle:{
    flex:0.5,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.backgroundWhite || '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight || '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary || '#333',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  modalOptionSelected: {
    backgroundColor: Colors.backgroundGray || '#f5f5f5',
  },
  modalOptionText: {
    fontSize: 16,
    color: Colors.textPrimary || '#333',
  },
  modalOptionTextSelected: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
