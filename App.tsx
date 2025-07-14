import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import axios from 'axios';

type Vehicle = {
  id: number;
  name: string;
  vehicle_registration_number: string;
  image_url?: string;
  brand: {
    name_en: string;
  };
};

const API_URL = 'https://devappapi.gogofuels.com/api/v1/vehicles?perpage=1';
const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2RldmFwcGFwaS5nb2dvZnVlbHMuY29tL2FwaS92MS9sb2dpbiIsImlhdCI6MTc1MjA0MDYwOCwiZXhwIjoxNzUyNjQ1NDA4LCJuYmYiOjE3NTIwNDA2MDgsImp0aSI6IjhpaHZhMWFidjZvd3ludm4iLCJzdWIiOiIyMCIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjciLCJ1c2VyIjp7ImlkIjoyMCwibmFtZSI6IlNodWJoYW0gQ2hpa2FuaSIsImVtYWlsIjoic2h1YmhhbS5uZWN0YXJiaXRzQGdtYWlsLmNvbSIsIm1vYmlsZV9ubyI6Iis5MTg4NTU3NzQ5NjYiLCJnb29nbGVfaWQiOiIxMTEzOTc5NjcwNzE3MzY4ODQ0MzEiLCJhcHBsZV9pZCI6bnVsbCwicHJvZmlsZV9waWN0dXJlIjoidXNlcnMvdXNlcnMtMjAyNTA2MTgwNjE3MDBKUlRGcXB3d2FGLnBuZyIsImVtYWlsX3ZlcmlmaWNhdGlvbl90b2tlbiI6IiIsImVtYWlsX3ZlcmlmaWVkX2F0IjpudWxsLCJsYXN0X2xvZ2luX2F0IjoiMjAyNS0wNy0wOVQwNTo1Njo0OC4wNzU5NTFaIiwiZmFpbGVkX2xvZ2luX2F0dGVtcHRzIjowLCJzdGF0dXMiOiJhY3RpdmUiLCJyZWZlcl9jb2RlIjoidkYwbm0iLCJsYW5ndWFnZSI6ImVuIiwid2FudHNfcHVzaF9ub3RpZmljYXRpb24iOjAsImlzX2FwcF9sb2NrX2VuYWJsZWQiOjAsImNyZWF0ZWRfYXQiOiIyMDI1LTA1LTIyVDE4OjQ5OjQ3LjAwMDAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAyNS0wNy0wOVQwNTo1Njo0OC4wMDAwMDBaIiwiZGVsZXRlZF9hdCI6bnVsbCwicm9sZSI6ImN1c3RvbWVyIn19.Ja0CIWKJggfwvMdu3_wIPG4bCZsZ2mCTNVc8XR18Vjc'; // Replace with your full token

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<number>(1);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'en',
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      console.log('api Response:', JSON.stringify(res.data, null, 2));

      const vehicleData: Vehicle[] = res.data.data.vehicle.data;
      setVehicles(vehicleData);
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Vehicle }) => {
    const isSelected = selectedId === item.id;
    return (
      <TouchableOpacity
        onPress={() => setSelectedId(item.id)}
        style={[styles.card]}
      >
        <Image
          source={item.image_url ? { uri: item.image_url } : require('./assets/car.png')}
          style={styles.image}
        />
        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: "center" }}>
            <Text style={styles.info}>{item.brand?.name_en} - </Text>
            <Text style={{ fontSize: 13, fontWeight: '700' }}>{item.vehicle_registration_number}</Text>
          </View>
        </View>
        <View style={styles.radio}>
          {isSelected && <View style={styles.dot} />}
        </View>
      </TouchableOpacity>
    );
  };
  
  const steps = [{ id: 1, name: 'Fuel assets' }, { id: 2, name: 'Address' }, { id: 3, name: 'Service' }, { id: 4, name: 'Payment' }];
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
      <StatusBar barStyle='default' />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom:10 }}>
          <TouchableOpacity>
            <Image source={require('./assets/back.png')} style={{ height: 20, width: 20 }} />
          </TouchableOpacity>
          <Text style={styles.header}>Create booking</Text>
          <Text style={{ color: '#fff' }}>5</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {steps.map((step, index) => (
            <View style={{flexDirection:'row',alignItems:'center'}} key={step.id}>
              <TouchableOpacity
                onPress={() => setSelectedStepId(step.id)}
                style={styles.radio}
              >
                {selectedStepId === step.id && <View style={styles.dot} />}
              </TouchableOpacity>
                <View
                  style={[
                    styles.stepLine
                  ]}
                />
            </View>
          ))}
        </View>
        <View style={styles.stepLabelContainer}>
          {steps.map((step) => (
            <Text
              key={step.id}
              style={[
                styles.substep,
                {
                  color: selectedStepId === step.id ? '#000' : '#a5a5a5',
                  flex: 1,
                  textAlign: 'center',
                  fontWeight: '500',
                  fontSize: 13
                },
              ]}
            >
              {step.name}
            </Text>
          ))}
        </View>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            <FlatList
              data={vehicles}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={{paddingBottom:80}}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                <TouchableOpacity activeOpacity={0.6} style={styles.addBtn}>
                  <Text style={styles.addBtnText}>+ Add fuel asset</Text>
                </TouchableOpacity>
              }
            />
            <TouchableOpacity activeOpacity={0.6} style={styles.nextBtn}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#fff',
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    // paddingBottom: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  header: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 9,
    alignSelf: 'center'
  },
  substep: {
    fontSize: 16,
    color: '#000',
    // marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginVertical: 6,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: '#eee',
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
  },
  info: {
    fontSize: 14,
    color: '#555',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#fed136',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: '#fed136',
    borderRadius: 5,
  },
  addBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#A5A5A53D',
    borderWidth: 1,
    marginTop: 10,
  },
  addBtnText: {
    color: '#FF9203',
    fontSize: 16,
    fontWeight: '600',
  },
  nextBtn: {
    backgroundColor: '#fed136',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  nextText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '700',
  },
  stepLine: {
    height: 2,
    width: 75,
    backgroundColor: '#ccc',
  },
  stepLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8
  },
});
