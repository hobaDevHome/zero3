import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  Image,
  NativeModules,
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';

const OwnGallery = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [images, setImages] = useState([]);

  // useEffect(() => {
  //   navigation.addListener('focus', () => {
  //     getImage();
  //   });
  // }, []);

  async function getImage() {
    try {
      const storedImages = await AsyncStorage.getItem('storedimages');
      console.log('from use effect', storedImages);

      if (storedImages !== null) {
        setImages(storedImages);
        console.log('after calling asyc', images);
      }
    } catch (e) {
      // saving error
    }
  }

  // useEffect(() => {
  //   console.log('images use effec', images);

  //   (async function fetchData() {
  //     try {
  //       const storedImages = await AsyncStorage.getItem('storedimages');
  //       console.log('from use effect', storedImages);

  //       if (storedImages !== null) {
  //         setImages(storedImages);
  //         console.log('after calling asyc', images);
  //       }
  //     } catch (e) {
  //       // saving error
  //     }
  //   })();
  // }, []);

  const storeImge = async seneImages => {
    try {
      await AsyncStorage.setItem('storedimages', JSON.stringify(seneImages));
      const stored = await AsyncStorage.getItem('storedimages');
      console.log('from store', stored);
    } catch (e) {
      // saving error
    }
  };

  const chooseFromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      multiple: true,
      height: 400,
      cropping: true,
    }).then(image => {
      const selectedImagePath = image[0].path;
      setModalVisible(false);

      setImages([...images, {id: Date(), url: selectedImagePath}]);
      console.log('images choose', images);
      storeImge(images);
    });
  };

  const takeWithCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      const selectedImagePath = image['path'];
      setModalVisible(false);
      setImages([...images, {id: new Date(), url: selectedImagePath}]);
      storeImge(images);
    });
  };

  const renderImage = image => {
    return (
      <View style={{alignItems: 'center', padding: 10}}>
        <View>
          <Image
            style={{
              height: 200,
              width: 350,
              resizeMode: 'cover',
              marginBottom: 20,
            }}
            source={{
              uri: image.url,
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.main}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Icon
          name="add-a-photo"
          size={40}
          color="black"
          style={{marginRight: 10}}
        />
      </TouchableOpacity>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={{position: 'absolute', bottom: 0, left: 0, right: 0}}
        hasBackdrop={false}
        backdropOpacity={0.6}>
        <View style={styles.modalStyle}>
          <TouchableOpacity onPress={takeWithCamera} style={styles.button}>
            <Text style={{color: 'orange', fontSize: 18, fontWeight: 'bold'}}>
              Take a photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => chooseFromGallery()}
            style={styles.button}>
            <Text style={{color: 'orange', fontSize: 18, fontWeight: 'bold'}}>
              Choose from gallery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.button}>
            <Text style={{color: 'orange', fontSize: 18, fontWeight: 'bold'}}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <FlatList
        scrollEnabled={true}
        pagingEnabled
        data={images}
        style={{marginBottom: 50}}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({item}) => renderImage(item)}
      />
    </View>
  );
};

export default OwnGallery;

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    marginTop: 15,
  },
  button: {
    width: '90%',
    height: 50,
    borderRadius: 5,
    backgroundColor: 'teal',
    margin: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalStyle: {
    backgroundColor: '#DDDBCF',
    borderRadius: 10,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
  },
});

// {"cropRect": {"height": 960, "width": 719, "x": 120, "y": 0},
//  "height": 400,
//  "mime": "image/jpeg",
//   "modificationDate": "1624193418000",
//    "path": "file:///storage/emulated/0/Android/data/com.zero/files/Pictures/4210bb0e-3c0d-407c-9665-29c0bb3f8106.jpg",
//    "size": 64120, "width": 300}
