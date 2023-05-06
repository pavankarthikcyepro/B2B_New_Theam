import React, { useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../styles';
import { IconButton } from 'react-native-paper';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearRecordedCallsData, getRecordedCallList } from '../../../redux/recordedCallsReducer';
import { LoaderComponent } from '../../../components';
import moment from 'moment';
import TrackPlayer, { Event, RepeatMode, useProgress, useTrackPlayerEvents } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import { showToast } from '../../../utils/toast';

let previousPosition = null;

const RecordedCalls = ({ navigation, route }) => {
  const { taskId } = route.params;
  const { position, duration } = useProgress(500);
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.recordedCallsReducer);
  
  const [recordingList, setRecordingList] = useState([]);
  const [onSliding, setOnSliding] = useState(false);
  const [previousActiveIndex, setPreviousActiveIndex] = useState(null);

  useEffect(() => {
    if (
      previousPosition == 0 ||
      previousPosition == null ||
      previousPosition > position
    ) {
      if (recordingList.length > 0 && !onSliding) {
        previousPosition = 0;
        let element = recordingList;
        let playingIndex = element.findIndex((val) => val.isPlay == true);
        if (playingIndex >= 0) {
          element[playingIndex].currentDuration = position;
        }
      }
    }
  }, [position, duration]);
  
  useEffect(async () => {
    if (selector.recordedCallList.length > 0) {
      let trackArr = [];
      let currentTrackArr = [];
      const element = selector.recordedCallList;
      for (let i = 0; i < element.length; i++) {
        const trackObj = {
          url: element[i].assetUrl,
          date: element[i].start,
          duration: element[i].duration ? Number(element[i].duration) : 0,
        };
        trackArr.push(Object.assign({}, trackObj));
        const currentTrackObj = {
          ...element[i],
          currentDuration: 0,
          duration: element[i].duration ? Number(element[i].duration) : 0,
          isPlay: false,
          isMute: false,
        };
        currentTrackArr.push(Object.assign({}, currentTrackObj));
      }
      await TrackPlayer.add(trackArr);
      await TrackPlayer.setRepeatMode(RepeatMode.Track);
      setRecordingList([...currentTrackArr]);
    }
  }, [selector.recordedCallList]);
  

  useEffect(() => {
    // dispatch(getRecordedCallList(1600453));
    dispatch(getRecordedCallList(taskId));
    return () => {
      dispatch(clearRecordedCallsData());
      TrackPlayer.reset();
      previousPosition = null;
    };
  }, []);
  
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    previousPosition = event.position;
  });
  
  const noData = () => {
    return (
      <View style={styles.noDataView}>
        <Text style={styles.noDataText}>No Records !</Text>
      </View>
    );
  };

  const itemSeparator = () => {
    return <View style={styles.itemDivider} />;
  };

  const onVolume = async (item, index) => {
    let element = recordingList;
    element[index].isMute = !element[index].isMute;
    setRecordingList([...element]);

    if (item.isPlay) {
      await TrackPlayer.pause();
      await TrackPlayer.skip(index);
      await TrackPlayer.seekTo(item.currentDuration);

      if (item.isMute) {
        TrackPlayer.setVolume(0);
      } else {
        TrackPlayer.setVolume(1);
      }
      await TrackPlayer.play();
    }
  };

  const onPlayerEvents = async (item, index) => {
    if (item.duration <= 0) {
      showToast("Recording Not Available");
      return;
    }

    let element = recordingList;
    if (previousActiveIndex != index) {
      await TrackPlayer.clearNowPlayingMetadata();
      for (let i = 0; i < element.length; i++) {
        element[i].currentDuration = 0;
      }
    }
    if (!item.isPlay) {
      for (let i = 0; i < element.length; i++) {
        element[i].isPlay = false;
      }
    }

    let isPlay = false;
    if (item.isPlay) {
      isPlay = false;
    } else {
      await TrackPlayer.skip(index);
      await TrackPlayer.seekTo(item.currentDuration);
      isPlay = true;
    }

    if (isPlay) {
      if (item.isMute) {
        TrackPlayer.setVolume(0);
      } else {
        TrackPlayer.setVolume(1);
      }
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
    element[index].isPlay = isPlay;
    setRecordingList([...element]);
    setPreviousActiveIndex(index);
  };

  const convertSecToTime = (value) => {
    return moment.utc(value * 1000).format("mm:ss");
  }

  const onSliderValueChange = (value, item, index) => {
    let element = recordingList;
    element[index].currentDuration = value;
    setRecordingList(Object.assign([], element));
  }; 
  
  const onSlideCompleted = (value, item, index) => {
    if(item.isPlay){
      TrackPlayer.seekTo(value);
    }
  }; 

  const renderItem = ({ item, index }) => {
    return (
      <View key={index} style={styles.itemContainer}>
        <View style={styles.numberRow}>
          <View>
            <Text style={styles.mobileNumberText}>{item.mobileNo}</Text>
            <Text style={styles.timeText}>
              {moment(item.start).format("DD/MM/YYYY HH:MM a")}
            </Text>
          </View>
          <IconButton
            icon={item.isMute ? "volume-off" : "volume-high"}
            size={25}
            onPress={() => onVolume(item, index)}
          />
        </View>
        <View style={styles.row1}>
          <IconButton
            icon={item.isPlay ? "pause-circle-outline" : "play-circle-outline"}
            size={45}
            style={styles.playIcon}
            color={Colors.LIGHT_GRAY2}
            onPress={() => onPlayerEvents(item, index)}
          />

          <View style={{ flex: 1 }}>
            <Slider
              style={styles.sliderContainer}
              value={item.currentDuration}
              maximumValue={item.duration}
              thumbTintColor={Colors.PINK}
              minimumTrackTintColor={Colors.PINK}
              maximumTrackTintColor={Colors.LIGHT_GRAY2}
              onSlidingStart={(value) => setOnSliding(true)}
              onSlidingComplete={(value) => {
                setOnSliding(false);
                onSlideCompleted(value, item, index);
              }}
              step={0.5}
              // thumbImage={require("./../../../assets/images/cy.png")}
              onValueChange={(value) => onSliderValueChange(value, item, index)}
            />
            <View style={styles.timeRow}>
              <Text style={[styles.durationTimeText, { marginLeft: 7 }]}>
                {convertSecToTime(item.currentDuration)}
              </Text>
              <Text style={styles.durationTimeText}>
                {convertSecToTime(item.duration)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={recordingList}
        renderItem={renderItem}
        ListEmptyComponent={noData}
        contentContainerStyle={[styles.container, { padding: 15 }]}
        ItemSeparatorComponent={itemSeparator}
      />
      <LoaderComponent visible={selector.isLoading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },

  itemContainer: {
    // flexDirection: "row",
    // alignItems: "center",
  },
  row1: {
    flexDirection: "row",
    alignItems: "center",
  },
  playIcon: {
    margin: -10,
  },
  numberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  mobileNumberText: {
    fontWeight: "600",
    fontSize: 14,
  },
  timeText: {
    fontSize: 13,
    marginTop: 3,
    marginBottom: 3,
  },
  currentDurationText: {
    fontSize: 12,
    color: Colors.GRAY_LIGHT,
  },
  sliderContainer: {
    height: 50,
    width: "100%",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  durationTimeText: {
    fontWeight: "500",
    fontSize: 13,
    color: Colors.DARK_GRAY,
  },

  noDataView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.BLACK,
  },
  itemDivider: {
    height: 1,
    width: "100%",
    backgroundColor: Colors.LIGHT_GRAY2,
    marginVertical: 10,
  },
});

export default RecordedCalls;